---
title: "updated dotfiles"
date: "2024-09-08"
description: "Major rework done to create a robust and portable way to manage my dev configuration across platforms"
tags:
  - ansible
  - chezmoi
  - templates
  - lua
  - shell
categories:
  - customization
  - tweakfest
  - automation
  - dotfiles
---

After a significant overhaul of my dotfiles, I'm excited to share my new setup!

<!--more-->

This version moves away from a bare Git repository approach and embraces a more robust solution tailored for managing different environments. Many things in my [old post](./my-dotfiles.md) is still relevant but this just adds to it.

## What's New

This new dotfiles setup utilizes a combination of **Ansible**, **Chezmoi**, **1Password**, and **Go templates**, creating a portable and efficient way to manage configurations across multiple machines. Here’s a breakdown of the key components:

### 1. Ansible

Ansible is at the heart of my new setup. It allows for automated installation of essential packages, system settings, and the configuration of tools. You can find specific roles [here](https://github.com/mattjh1/dotfiles/tree/main/scripts/common/ansible/roles) that detail how each part of the environment is managed.

### 2. Chezmoi

Chezmoi handles the complexity of host-specific configurations using templates, making it easy to maintain consistency across different environments. Key configurations include:

- `zsh`
- `nvim`
- `tmux`
- `alacritty`
- `git`
- `karabiner`
- `vscode`
- `bat`
- `hammerspoon`

### 3. Seamless Installation

The entire setup can be installed with a single command, making it easy to replicate on any machine:

```bash
curl -fsSL https://raw.githubusercontent.com/mattjh1/dotfiles/main/scripts/setup.sh | sh -s -- --all
```

Some of the configurations relies on my 1password vault, for example:

- [ssh config](https://github.com/mattjh1/dotfiles/blob/main/dotfiles/private_dot_ssh/private_config.tmpl)
- [zsh-secrets.tmpl](https://github.com/mattjh1/dotfiles/blob/main/dotfiles/dot_config/zsh/zsh-secrets.tmpl)

The install will still work, but don't expect to get the secret sauce

## Inspiration

[shmileee dotfiles](https://github.com/shmileee/dotfiles)

[Michael Bynens and his awesome macos settings](https://github.com/mathiasbynens/dotfiles/tree/main)

[Jogendra dotfiles](https://github.com/jogendra/dotfiles)

[Jason Rudolph keyboard centric setup](https://github.com/jasonrudolph/keyboard)

## Conclusion

This enhanced dotfiles setup marks a new chapter in my workflow. By leveraging modern tools like Ansible and Chezmoi, I can better manage and deploy my configurations across various environments. Feel free to explore my new dotfiles repository on GitHub and adapt any elements that resonate with you.

Let the journey into efficient and robust configurations begin!
