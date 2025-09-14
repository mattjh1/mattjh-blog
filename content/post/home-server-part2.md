---
title: "Home Server - Part 2: The Docker Spiral"
date: "2025-09-14"
description: "How my simple docker-compose.yml grew from 20 lines to managing 15+ services without losing my sanity"
tags:
  - docker
  - homeserver
  - container-management
categories:
  - hosting-and-deployment
  - automation
toc: true
---

My `docker-compose.yml` started as maybe 20 lines for a simple Nextcloud installation. Fast forward a few weeks, and I'm managing 15+ services, each with their own personality disorders and resource requirements. Here's how I survived the container explosion without everything catching fire.

<!--more-->

_This is Part 2 of my home server journey. [Part 1 covered the inspiration and initial setup](../home-server-part1)_

## Docker Compose at Scale

What nobody tells you about self-hosting is that your `docker-compose.yml` becomes this living, breathing document that starts innocent and grows into something that could power a small startup.

```yaml
services:
  nextcloud:
    image: nextcloud:31.0.8
    container_name: nextcloud
    restart: unless-stopped
    depends_on:
      - db
      - redis
    ports:
      - "127.0.0.1:8080:80"
    environment:
      POSTGRES_HOST: db
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      REDIS_HOST_PORT: 6379
      OVERWRITEPROTOCOL: https
      OVERWRITEHOST: cloud.mattjh.sh
      OVERWRITECLIURL: https://cloud.mattjh.sh
      NEXTCLOUD_TRUSTED_DOMAINS: cloud.mattjh.sh
      NEXTCLOUD_TRUSTED_PROXIES: "172.18.0.0/16"
      # PHP OPcache settings
      PHP_MEMORY_LIMIT: 1024M
      PHP_UPLOAD_LIMIT: 16G
    volumes:
      - /srv/docker/nextcloud:/var/www/html
      - /srv-data/nextcloud/data:/var/www/html/data
      - /srv-data/immich/photos:/mnt/immich-photos:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/status.php"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Every single service has health checks now. I learned this lesson the hard way when services would appear to be running but were actually broken in creative ways. "Running" doesn't mean "working," and Docker will happily keep a zombie container warm for you indefinitely.

## Version Pinning and Renovate

I pin every single version because I've been burned by automatic updates before. Not necessarily on this stack, but enough times to know better.
Looking at my setup - everything from `nextcloud:31.0.8` to `prom/prometheus:v2.55.1` to Immich's proper version tags like `v1.118.0` (though I went through a confusing phase with those commit-based tags before I found the actual releases).

I initially spent way too much time digging through `ghcr.io/immich-app/immich-server` and kept finding these cryptic commit hash images like `commit-cb9e07ee32b25e7b31349d8171e3dc5e27429101`. Turns out Immich actually has thousands of proper version tags - I was just looking in the wrong place or the registry UI wasn't showing them clearly. Once I found the actual `v1.x.x` tags, everything made much more sense.

Manual version management gets old fast when you have 15+ services. Enter Renovate - it automates the tedious parts while keeping me in control:

```json
{
  "schedule": ["before 6am on monday"],
  "timezone": "Europe/Stockholm",
  "packageRules": [
    {
      "description": "Block all major updates - manual process only",
      "matchUpdateTypes": ["major"],
      "enabled": false
    },
    {
      "description": "Nextcloud - monthly updates only",
      "matchPackageNames": ["nextcloud"],
      "schedule": ["before 6am on the first day of the month"],
      "minimumReleaseAge": "7 days"
    },
    {
      "description": "Auto-merge security updates",
      "matchUpdateTypes": ["pin", "digest"],
      "automerge": true
    }
  ]
}
```

Renovate opens pull requests when new versions are available, but with guardrails. Major updates are blocked entirely - those need human judgment. Nextcloud only gets updated monthly after the release has been out for a week (because rushing Nextcloud updates is asking for trouble). Security patches get auto-merged because sleeping through a security vulnerability is worse than dealing with a potential bug.

It runs Monday mornings at 6 AM Stockholm time, so I can review updates over coffee instead of being surprised by them at random times. One PR per hour, maximum two concurrent, so my repository doesn't get spammed.

## Data Architecture

### Database Strategy

Instead of spinning up separate databases for every service, I use one PostgreSQL instance with multiple databases:

```yaml
db:
  image: tensorchord/pgvecto-rs:pg16-v0.3.0
  container_name: nextcloud-db
  restart: unless-stopped
  environment:
    POSTGRES_DB: ${POSTGRES_DB}
    POSTGRES_USER: ${POSTGRES_USER}
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  volumes:
    - /srv/docker/postgres:/var/lib/postgresql/data
    - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
```

That `pgvecto-rs` variant isn't just any Postgres - it's got vector extensions that Immich needs for its AI features. One database server handles Nextcloud, Immich, and Paperless-ngx. The `init-db.sql` script creates the individual databases during first startup.

Same approach with Redis - one instance, multiple services using it as cache and message broker.

### Storage Strategy

You'll notice I'm not using Docker volumes everywhere:

```yaml
volumes:
  - /srv/docker/nextcloud:/var/www/html
  - /srv-data/nextcloud/data:/var/www/html/data
  - /srv-data/immich/photos:/mnt/immich-photos:ro
```

That's intentional. I want full control over where data lives:

```bash
# Fast stuff (NVMe)
/srv/docker/
├── adguard/
├── grafana/
├── immich/
├── nextcloud/
├── paperless/
├── postgres/
├── prometheus/
└── redis/

# Bulk storage (HDD)
/srv-data/
├── immich/photos/
├── nextcloud/data/
└── paperless/
    ├── data/
    ├── export/
    └── media/
```

Why let Docker decide when I can optimize it myself? The database gets SSD speeds, photos get bulk storage, and everything has a logical place in the filesystem.

## The Machine Learning Beast

The container I'm most happy about is Immich's machine learning service. This thing will happily eat all your RAM if you let it:

```yaml
immich-machine-learning:
  image: ghcr.io/immich-app/immich-machine-learning:v1.142.0
  container_name: immich-machine-learning
  restart: unless-stopped
  environment:
    MACHINE_LEARNING_CACHE_FOLDER: /cache
    MACHINE_LEARNING_MODEL_TTL: "600"
    MACHINE_LEARNING_WORKERS: "4"
    MACHINE_LEARNING_WORKER_TIMEOUT: "120"
    TRANSFORMERS_CACHE: /cache/transformers
    TORCH_HOME: /cache/torch
  volumes:
    - /srv/docker/immich/cache:/cache
    - /srv/docker/immich/model-cache:/usr/src/app/model-cache
  deploy:
    resources:
      limits:
        memory: 8G
      reservations:
        memory: 2G
```

Eight gigs of RAM limit, four workers, proper cache volumes. It's like having a small AI research lab in my closet, complete with the same kind of resource constraints you'd face in a real deployment.

The memory limits took some tuning. Too low and the ML models can't load properly. Too high and it starves other services. 8GB with a 2GB reservation seems to be the sweet spot for my 32GB system.

## Document Management Integration

One of my favorite additions is Paperless-ngx, which automatically OCRs and organizes documents:

```yaml
paperless-ngx:
  image: ghcr.io/paperless-ngx/paperless-ngx:2.18.4
  container_name: paperless-ngx
  restart: unless-stopped
  depends_on:
    - db
    - redis
  environment:
    PAPERLESS_URL: https://paperless.mattjh.sh
    PAPERLESS_DBHOST: db
    PAPERLESS_DBNAME: paperless
    PAPERLESS_REDIS: redis://redis:6379
    PAPERLESS_OCR_LANGUAGES: eng swe
    PAPERLESS_OCR_LANGUAGE: eng+swe
    PAPERLESS_CONSUMER_RECURSIVE: true
    PAPERLESS_CONSUMER_SUBDIRS_AS_TAGS: true
  volumes:
    - /srv-data/paperless/data:/usr/src/paperless/data
    - /srv-data/paperless/media:/usr/src/paperless/media
    - /srv-data/nextcloud/data/mattjh-admin/files/Scans:/usr/src/paperless/consume
```

The magic is in that last volume mount - it watches my Nextcloud "Scans" folder. Drop a PDF there from my phone, and Paperless automatically OCRs it, extracts metadata, and makes it searchable. It even creates tags based on subdirectory names.

## Operations

### Networking and Security

Instead of opening ports and dealing with dynamic DNS, I use Cloudflare Tunnels:

```yaml
cloudflared:
  image: cloudflare/cloudflared:2025.8.1
  container_name: cloudflared
  restart: unless-stopped
  command: tunnel run --token ${CLOUDFLARE_TUNNEL}
  environment:
    - TUNNEL_METRICS=0.0.0.0:2000
```

All services bind to `127.0.0.1` - they're only accessible locally or through the tunnel. No open ports, no port forwarding, no security nightmares. Cloudflare handles SSL termination and DDoS protection.

### Monitoring Obsession

Once you have this many services, you need to know what's happening:

```yaml
prometheus:
  image: prom/prometheus:v2.55.1
  container_name: prometheus
  restart: unless-stopped
  volumes:
    - /srv/docker/prometheus:/prometheus
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana-oss:12.1.1
  container_name: grafana
  restart: unless-stopped
  environment:
    - GF_SERVER_ROOT_URL=https://grafana.mattjh.sh
```

Plus exporters for everything - `node-exporter` for system metrics, `redis-exporter`, `postgres-exporter`. Even a custom `backup-validator` that exposes metrics about backup health.

Now I can see CPU usage, memory consumption, disk space, database query performance - everything you need to know if your home lab is happy or about to explode.

### Cron Job Solution

One thing that catches people off-guard with containerized Nextcloud is that you need a separate container for background tasks:

```yaml
cron:
  image: nextcloud:31.0.8
  container_name: nextcloud-cron
  restart: unless-stopped
  depends_on:
    - nextcloud
  entrypoint: ["/bin/bash", "-c"]
  command:
    - |
      echo "Starting Nextcloud cron..."
      while true; do
        echo "Running cron job at $(date)"
        su -s /bin/bash www-data -c "php /var/www/html/cron.php"
        sleep 300  # Wait 5 minutes
      done
```

This runs Nextcloud's background tasks every 5 minutes. File scanning, cleanup tasks etc. - all the stuff that makes Nextcloud actually work properly.

### Secrets Management

Everything sensitive lives in environment variables:

```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  PAPERLESS_SECRET_KEY: ${PAPERLESS_SECRET_KEY}
  CLOUDFLARE_TUNNEL: ${CLOUDFLARE_TUNNEL}
```

With a `.env` file that stays out of version control:

```bash
POSTGRES_PASSWORD=your_secure_password_here
PAPERLESS_SECRET_KEY=another_secret_here
CLOUDFLARE_TUNNEL=your_tunnel_token_here
```

Simple.

Not every value in my `.env` is _strictly sensitive_ — sometimes I’ll drop in things like service ports, image tags, just so there’s a **single source of truth** for configuration. It keeps everything in one place, easy to update, and makes local and production setups more consistent.

## The Results So Far

This setup handles everything I throw at it. Photos upload to Immich and get AI-tagged overnight, documents dropped in Nextcloud get OCR'd automatically by Paperless, files sync across devices, and the whole household benefits from ad-free browsing through AdGuard.

All 15+ services run comfortably on a single machine, sharing resources efficiently. The monitoring stack tells me exactly what's happening, and Cloudflare Tunnels keep everything secure without the networking headaches.

But of course, once you've got this much running, you start worrying about losing it all. What happens if that NVMe drive dies? How do you restore 15+ services from backups? How do you keep everything updated without breaking the delicate balance?

That's where Part 3 comes in - because running infrastructure is one thing, but making it bulletproof is another challenge entirely.

<!-- **Next up: [Backups, Security, and the Wins That Actually Matter](../home-server-part3)** -->
