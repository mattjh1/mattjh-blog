---
title: "Deploy Hugo Sites with GitHub Actions and GitHub Pages"
date: "2025-01-05"
description: ""
tags:
  - SSG
  - GitHub Actions
  - Deploy Hugo Site
  - GitHub Pages
  - Static Website Hosting
  - Continuous Deployment
  - CI/CD for Hugo
categories:
  - Web Development
  - DevOps
  - Automation
  - Hosting and Deployment
---

If you're looking for a streamlined way to deploy your Hugo site, GitHub Actions and GitHub Pages make for a powerful combination. In this post, I'll walk you through setting up a workflow to build and deploy your Hugo static site automatically whenever you push changes to your repository.

<!--more-->

## What is Hugo?

Hugo is a blazing-fast static site generator written in Go. Its speed, flexibility, and built-in features like templates and multilingual support make it ideal for building blogs, portfolios, or even complex documentation sites. Hugo generates static HTML files from your content, which makes it perfect for hosting on platforms like GitHub Pages.

## GitHub Actions for Automation

GitHub Actions allows you to automate tasks directly in your repository. With a workflow file, you can define jobs that run on GitHub’s servers whenever an event occurs—like a push to the `main` branch. For deploying a Hugo site, we’ll use GitHub Actions to:

1. Format code with Prettier.
2. Build the Hugo site.
3. Deploy it to GitHub Pages.

Here’s my full workflow file, broken down step-by-step.

## The Workflow File

Below is the workflow file I use to build and deploy my Hugo site. Let’s dissect it.

```yaml
# Sample workflow for building and deploying a Hugo site to GitHub Pages
name: Deploy Hugo site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches:
      - main

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash
```

#### Key Highlights

- **Trigger Events**: The workflow triggers on pushes to the `main` branch and can also be run manually.
- **Permissions**: Grants the necessary permissions for GitHub Pages deployment and managing contents.
- **Concurrency**: Ensures only one deployment runs at a time, preventing conflicts.

### Job: Prettier Auto-Fix

Before building the site, this job ensures that the code is well-formatted using Prettier.

```yaml
jobs:
  prettier-fix:
    if: github.actor != 'github-actions[bot]'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install Prettier and Prettier plugin for Go templates
        run: npm install --save-dev prettier prettier-plugin-go-template

      - name: Run Prettier auto-fix
        run: npx prettier --write .

      - name: Commit changes
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git commit -am "Auto-format code with Prettier on ${{ github.sha }}" || echo "No changes to commit"

      - name: Push changes
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git
          git push
```

This ensures your code stays clean and consistent without manual intervention.

### Job: Build

This job installs Hugo and builds the site.

```yaml
build:
  runs-on: ubuntu-latest
  needs: prettier-fix
  env:
    HUGO_VERSION: 0.136.5
    SASS_VERSION: 1.80.6
  steps:
    - name: Install Hugo CLI
      run: |
        wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
        && sudo dpkg -i ${{ runner.temp }}/hugo.deb

    - name: Download Dart Sass binary
      run: |
        mkdir -p ${{ runner.temp }}/dart-sass
        curl -L -o ${{ runner.temp }}/dart-sass/dart-sass.tar.gz https://github.com/sass/dart-sass/releases/download/${SASS_VERSION}/dart-sass-${SASS_VERSION}-linux-x64.tar.gz
        tar -xzf ${{ runner.temp }}/dart-sass/dart-sass.tar.gz -C ${{ runner.temp }}/dart-sass --strip-components=1
        chmod +x ${{ runner.temp }}/dart-sass/sass

    - name: Checkout
      uses: actions/checkout@v4
      with:
        submodules: recursive
        fetch-depth: 0

    - name: Install Node.js dependencies
      run: "[[ -f package-lock.json || -f npm-shrinkwrap.json ]] && npm ci || true"

    - name: Setup Pages
      id: pages
      uses: actions/configure-pages@v5

    - name: Build with Hugo
      env:
        HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
        DART_SASS_BINARY: ${{ runner.temp }}/dart-sass/sass
        HUGO_ENVIRONMENT: production
        HUGO_ENV: production
        TZ: Europe/Stockholm
      run: |
        hugo \
          --gc \
          --minify \
          --baseURL "${{ steps.pages.outputs.base_url }}/"

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./public
```

#### Key Steps

- **Install Hugo**: Downloads and installs the extended version of Hugo.
- **Build the Site**: Generates the static files with minification and garbage collection enabled.
- **Upload Artifact**: Saves the generated `public` directory as an artifact for deployment.

### Job: Deploy

Finally, the deployment job pushes the built site to GitHub Pages.

```yaml
deploy:
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  runs-on: ubuntu-latest
  needs: build
  steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

This step uses the `deploy-pages` action to publish the built files to GitHub Pages.

## Conclusion

This workflow automates the entire deployment pipeline for your Hugo site—from formatting and building to deploying on GitHub Pages. The combination of Hugo’s speed and GitHub Actions’ flexibility means you can focus on content creation rather than deployment headaches.

To see the workflow file in its entirety, check it out over at [GitHub](https://github.com/mattjh1/mattjh-blog/blob/main/.github/workflows/hugo.yml).
