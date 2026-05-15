---
title: "Home Server - Part 6: When the Router Runs the Fallback DNS"
date: "2026-05-15"
description: "AdGuard became load-bearing infrastructure. The fix wasn't a Raspberry Pi — it was a container on the router itself, plus one mount I almost forgot."
tags:
  - homeserver
  - networking
  - mikrotik
  - containers
  - adguard
  - dns
categories:
  - hosting-and-deployment
  - networking
toc: true
---

Part 5 ended on a confession: AdGuard on the home server is now critical infrastructure. If that container goes sideways — a bad update, a `docker compose down` at the wrong moment, the server hanging on a kernel upgrade — every device on the trusted VLANs loses DNS. Internet stops. The household notices in roughly four seconds.

The traditional answer is "buy a Raspberry Pi." I didn't want to, and the router had a better idea anyway.

<!--more-->

_This is Part 6 of my home server journey. [Part 1](../home-server-part1) covered the inspiration, [Part 2](../home-server-part2) the Docker spiral, [Part 3](../home-server-part3) backups and security, [Part 4](../home-server-part4) the network rebuild, [Part 5](../home-server-part5) split DNS and the Caddy ingress that made the server load-bearing in the first place._

## Why Not a Pi

A Raspberry Pi sounds like the obvious fallback right up until you look at it as another box to maintain. SD card eventually corrupts. PSU ages. OS updates need attending to. It's a second always-on appliance whose only job is "be there when the other one isn't" — and it has its own failure modes that aren't correlated with the failure modes of the thing it's backstopping.

What I actually wanted was a fallback that **shared a failure domain with the network itself**. If the router is gone, DNS being gone is irrelevant — the internet is already gone. If the router is up, the fallback should be up too. By that logic the right place to run the backup DNS is the router.

The RB5009 can do this. RouterOS 7.4 added container support — not Docker, just enough Linux to run an OCI image with sane-ish defaults. The official documentation is unusually candid about the security trade-offs, the resource ceiling is modest, and the tooling is barebones. For a single-purpose, always-on resolver, it's exactly the right shape.

## The Hardware Footprint

The container package isn't installed by default. Grab the extra package matching your RouterOS version, drop it on the router, reboot. Then enable the device-mode flag that explicitly opts you into running container workloads — RouterOS makes you acknowledge this before it'll let containers start, which is the right call.

You also need somewhere to store the container's filesystem. Internal flash is explicitly not recommended — wear leveling, limited writes, the works. A USB stick is the official answer. A SanDisk Ultra 32GB I had in a drawer is plenty. Format it (RouterOS will ask), let it mount as `usb1-part1`, and that's the storage tier sorted.

## The Isolated /30 (Don't Skip This One)

The first version of this setup gave the AdGuard container a veth on the SRV subnet — same `192.168.30.0/24` as the home server, easy to reason about, already covered by existing firewall rules. It worked.

Then it didn't, in a way that took an hour to diagnose. Two interfaces on overlapping subnets caused the router's routing table to ECMP between them in ways that made DNS lookups intermittently land on the wrong host. Sometimes the container, sometimes nothing, never deterministically. The kind of bug that makes you question your life choices.

The fix is to give the container its own isolated `/30`. The router gets one address, the container gets the other, and there's nowhere else for traffic to confuse itself with:

```routeros
/interface bridge add name=bridge-agh
/ip address add address=172.31.255.1/30 interface=bridge-agh

/interface veth add name=agh address=172.31.255.2/30 \
  gateway=172.31.255.1
/interface bridge port add bridge=bridge-agh interface=agh
```

Two usable addresses, both accounted for, no overlap with anything else on the network. The router's `192.168.30.x` interface stays exactly where it was. The container is a separate logical L3 hop, reachable from anywhere on the LAN via the router's existing inter-VLAN routing.

A forward rule so trusted VLANs can actually hit it on port 53:

```routeros
/ip firewall filter add chain=forward \
  src-address=192.168.0.0/16 dst-address=172.31.255.2 \
  protocol=udp dst-port=53 action=accept \
  comment="LAN -> AGH-fallback UDP"
# (TCP variant for completeness)
```

## Pulling and Configuring the Container

Two things worth noting before the commands. AdGuard needs **two** persistent mounts — `/opt/adguardhome/conf` and `/opt/adguardhome/work`. Skip `work` and it treats every boot as a first launch. The config file is also case-sensitive: `AdGuardHome.yaml`, not `adguardhome.yaml`.

```routeros
/container mounts add name=agh_conf src=/usb1-part1/conf/agh \
  dst=/opt/adguardhome/conf
/container mounts add name=agh_work src=/usb1-part1/conf/agh/work \
  dst=/opt/adguardhome/work
```

Then pull and add the container:

```routeros
/container config set registry-url=https://registry-1.docker.io \
  tmpdir=usb1-part1/pull
/container add remote-image=adguard/adguardhome:latest \
  interface=agh root-dir=usb1-part1/agh-root \
  mounts=agh_conf,agh_work \
  start-on-boot=yes
```

RouterOS isn't optimised for image fetches and the RB5009's CPU is not exactly an Apple silicon chip. Patience. After it lands, `/container print` shows it stopped. Start it once and confirm the logs don't say `first launch`:

```
/container start [find tag~"adguard"]
/log print where topics~"container"
```

If you see `AdGuard Home is now available, please visit ...` followed by DNS upstream connections, you're done.

## The Fallback Config

The first version of this config had no rewrites. The logic: rewrites point at `192.168.30.10`, and if the server is down, they'd go nowhere anyway. Omitting them seemed like the principled minimal approach.

The problem is that "server is down" isn't the only state where the fallback gets used. Clients don't do a clean failover and stay there — they wander. Timeouts, retry logic, which query happened to land on which server. Without rewrites on the fallback, you get a silent degraded state: some queries return local IPs, some return Cloudflare IPs, and whether `cloud.mattjh.sh` resolves to your server or the public internet depends entirely on DNS lottery. The kind of fault that presents as "huh, Nextcloud is loading slowly sometimes" rather than "Nextcloud is down." Worse to debug than an outage.

With rewrites on both, when the server is down, local services are down. Consistently. You know immediately what happened. Nobody spends twenty minutes checking container logs before realising the problem was DNS.

```yaml
dns:
  bind_hosts:
    - 0.0.0.0
  port: 53
  upstream_dns:
    - 1.1.1.1
    - 8.8.8.8
  bootstrap_dns:
    - 1.1.1.1
    - 8.8.8.8

filtering:
  filtering_enabled: true
  rewrites:
    - domain: cloud.mattjh.sh
      answer: 192.168.30.10
      enabled: true
    - domain: photos.mattjh.sh
      answer: 192.168.30.10
      enabled: true
    - domain: paperless.mattjh.sh
      answer: 192.168.30.10
      enabled: true
    - domain: grafana.mattjh.sh
      answer: 192.168.30.10
      enabled: true
    - domain: adguard.mattjh.sh
      answer: 192.168.30.10
      enabled: true
```

Same blocklists as the primary. No Kids client profile, no per-client rules — the fallback is an appliance, not a second home server.

## DHCP: Advertise Both

For each VLAN that should fall back, the DHCP option list gets the second server appended:

```routeros
/ip dhcp-server network set [find where address="192.168.20.0/24"] \
  dns-server=192.168.30.10,172.31.255.2
/ip dhcp-server network set [find where address="192.168.50.0/24"] \
  dns-server=192.168.30.10,172.31.255.2
/ip dhcp-server network set [find where address="192.168.60.0/24"] \
  dns-server=192.168.30.10,172.31.255.2
```

Clients try the first, time out, try the second. The timeout is short enough that the household experience is "DNS was a bit slow for one query" rather than "the internet is broken." Most resolver implementations remember which server worked recently and reorder accordingly, so once the primary comes back, things drift back to the fast path automatically.

The guest VLAN keeps `1.1.1.1` directly — no AdGuard, no fallback needed.

While I was in the DHCP config, I also added `172.31.255.2` to the host machine's `nmcli` config so the server itself can resolve names if its own AdGuard container is down. That's the same workaround Part 5 mentions for `docker compose down` events, but now pointed at a fallback I actually trust to be there.

## Proof It Works

The test is satisfying because it's so direct. Stop the primary, query something:

```bash
docker stop adguard
nslookup google.com
# still resolves
```

systemd-resolved tries `192.168.30.10`, hits the timeout, falls over to `172.31.255.2`, returns an answer. Internet keeps working. Nobody notices.

Bring the container back up and within the next query cycle the primary takes over again on most clients.

I run this test, deliberately, every couple of months — same way you should test a UPS by yanking the wall plug. A fallback you've never failed over to is not a fallback, it's a rumor.

## What This Didn't Solve

A few honest caveats:

- **When the server is down, local services are down.** The fallback carries the rewrites, so DNS is consistent — but the rewrites still point at `192.168.30.10`, and nothing is answering there if the server is off. That's the correct behaviour. It does mean any LAN-only service without a Cloudflare tunnel path disappears entirely during a server outage. None of mine are in that state, but the day one is I'll need to remember this distinction.
- **The container tooling is barebones.** RouterOS containers don't have Docker's update flow, the resource introspection, or years of community recipes. Updating AdGuard is "pull the new image, swap it in, restart." Treat them as appliances, not as a second Docker host.

## What's Next

Two open items I keep meaning to get to:

**Off-site backups.** Local Borg snapshots are great until the house catches fire. Monthly syncs to cloud storage using Borg's native repo sync would solve it — same encryption, same dedup, just a copy living somewhere that isn't this building. Not hard. Not done.

**Renovate automation.** Right now I review PRs over coffee on Mondays and run `docker compose pull && up` by hand. Wiring that to a systemd job that pulls, deploys, and pings me on failure is straightforward. There's a small irrational part of me that likes pressing the button manually. That part of me is wrong, and I will eventually overrule it.

---

_Six posts in and the network has stopped surprising me. That's either progress or hubris — I expect to find out which._
