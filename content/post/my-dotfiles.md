---
title: "dotfiles"
date: 2023-11-26T19:00:00+00:00
description: "Welcome to the heart of my computing environment. The core of my daily workflow."
tags:
  - lua
  - shell
categories:
  - productivity
  - dotfiles
---

My dotfiles, are the core of my daily workflow. Carefully configured for productivity and centered around a keyboard-centric approach, these files simplify tasks. While designed for my use, feel free to explore and adopt elements that suit your preferences.

<!--more-->

> **Update:** I've recently revamped my dotfiles to create an even more streamlined and powerful setup. Check out the [new dotfiles configuration](./new-dotfiles.md) `ansible`, `chezmoi`, `Go templates`, `1password`, and enhanced portability across different systems.

My dotfiles hosted on [GitHub](https://github.com/mattjh1/dotfiles.old)

---

## The Essence of Dotfiles

Dotfiles, those hidden configuration files residing in your home directory, are the unsung heroes of a customized computing experience. My dotfiles encapsulate configurations for various tools and applications, including `zsh`, `nvim`, `tmux`, `alacritty`, `kitty`, `git`, `karabiner`, `hammerspoon`, `vscode`, and even `macOS settings`.

## No Symlinks, No Problem

Unlike traditional dotfile setups that rely on symlinks, my approach involves a bare Git repository. The `git-dir` is set to `~/dotfiles`, and the work directory is set to `$HOME`. This unconventional but powerful setup ensures portability and ease of management. [Check out this Atlassian blog post](https://www.atlassian.com/git/tutorials/dotfiles) for a detailed understanding of the bare Git repository technique.

## Components at a Glance

Here's a quick overview of key components in my dotfiles repository:

- **zsh**: Customized configuration for the Zsh shell, enhancing the command-line experience.
- **nvim**: Neovim configurations, harnessing the power of Lua for extensibility and efficiency.
- **tmux**: Tmux settings to facilitate a dynamic and organized terminal environment.
- **alacritty / kitty**: Configurations for lightweight and feature-rich terminal emulators.
- **git**: Fine-tuned Git settings for a streamlined version control workflow.
- **karabiner**: Custom key mappings and shortcuts for a keyboard-centric workflow.
- **hammerspoon**: Automation scripts with Hammerspoon for macOS to enhance system-level interactions.
- **vscode**: Configurations for Visual Studio Code, tailored to my development needs.
- **macOS settings**: Tweaks and adjustments to optimize the macOS environment.

## Seamless Installation with a Script

To bring these dotfiles to your system, I've crafted a convenient installation script. The script, available [here](https://raw.githubusercontent.com/mattjh1/dotfiles.old/main/install.sh), performs the following tasks:

1. **Clones the Repo**: A bare Git repository is cloned to your system.
2. **Configures Git**: Sets up a function specifying the git-dir and work-tree.
3. **Backs Up Conflicts**: Safeguards existing directories/files that might conflict with dotfiles.
4. **Checks Out Dotfiles**: Places the dotfiles in their designated locations.

To install, run the following command in your terminal:

```bash
curl -Lks https://raw.githubusercontent.com/mattjh1/dotfiles.old/main/install.sh | /bin/sh
```

Before executing the script, take a moment to inspect it and ensure compatibility with your system.

## Embracing a Keyboard-Centric Workflow

A significant aspect of my dotfiles philosophy is the emphasis on a keyboard-centric workflow. Navigating through tasks, managing windows, and executing commands – it's all centered around the efficiency and speed that keyboard shortcuts provide.

Stay tuned for deeper dives into specific components, such as my Neovim setup with Lua, Hammerspoon automation scripts, and the reasoning behind specific tweaks in my Git configurations.

Let the journey into the intricacies of dotfiles begin! Your keyboard is your guide.

## Drawing Inspiration

My dotfiles journey has been influenced by various sources. Here are some that have shaped my setup:

- [Atlassian's bare Git repo blog post](https://www.atlassian.com/git/tutorials/dotfiles)
- [Mathias Bynens and his awesome macOS settings](https://github.com/mathiasbynens/dotfiles/tree/main)
- [Jogendra's dotfiles](https://github.com/jogendra/dotfiles)
- [Jason Rudolph's keyboard-centric setup](https://github.com/jasonrudolph/keyboard)
