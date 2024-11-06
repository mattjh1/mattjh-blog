---
title: "Useful shell aliases"
date: "2024-11-02"
description: "Useful shell aliases i use on the daily"
tags:
  - shell
  - zsh
  - bash
categories:
  - productivity
  - tools
  - dotfiles
---

Okay so over the past couple of years I've kept adding new aliases to my dotfiles, here Ill share some of the ones that I just couldn't see myself without. From quick navigation shortcuts to powerful one-liners for system monitoring, file manipulation, and Git operations, these aliases save me time and keep my command-line experience efficient.

<!--more-->

---

Aliases in shell environments are shortcuts that allow users to create custom, simplified commands for frequently used or complex command sequences. By defining an alias, you can replace a lengthy command or set of options with a shorter, memorable keyword, improving efficiency and reducing typing errors. For instance, `alias ll='ls -lah'` in a Unix-like shell would make `ll` a shortcut for listing files in detail. Aliases can be temporary (for the current session) or permanent when added to shell configuration files like `.bashrc` or `.zshrc`, enabling a more streamlined and personalized command-line experience.

{{< card type="info" >}}
I use `zsh` as my default shell, but all of these can be applied to `bash` as well. With other shells your mileage way vary.
{{< /card >}}

Without further ado.

## Navigation & Directory Management

Quick directory navigation is essential, and these aliases help you move up directories or create new ones with minimal typing.

```sh
# Navigate up directories quickly
alias ..="cd .."
alias .2="cd ../../"
alias .3="cd ../../../"
alias .4="cd ../../../../"
alias .5="cd ../../../../.."

# Create nested directories with verbose output
alias mkdir='mkdir -pv'

```

These aliases are invaluable for quickly moving up and managing directories without needing long paths.

```bash
# z is for zoxide
alias j='z'
alias f='zi'
```

Taken from the initial section of [zoxide readme](https://github.com/ajeetdsouza/zoxide):

> zoxide is a smarter cd command, inspired by z and autojump.
> It remembers which directories you use most frequently, so you can "jump" to them in just a few keystrokes.
> zoxide works on all major shells.

It is awesome, do yourself a favor and try this one. And these aliases just makes things more comfortable in general.

## System Commands & Utilities

Some core commands, like clearing the terminal, reloading the shell, and printing the PATH, come in handy multiple times a day.

```sh
# Clear the terminal and reload configuration
alias clr="clear"
alias reload="source ~/.config/zsh/.zshrc"

# Show $PATH in a readable format, with each path on a new line
alias path='echo -e ${PATH//:/\\n}'

# Safely prompt before overwriting, moving, or removing files
alias cp="cp -i"
alias mv='mv -i'
alias rm='rm -i'
```

These aliases simplify frequent actions and make them safer by confirming overwrites and deletions.

## Enhanced `ls` Commands

These `ls` aliases improve directory visibility, grouping directories first and making files easier to read with human-friendly sizes. I use [LSD (LSDeluxe)](https://github.com/lsd-rs/lsd) for improved `ls`.

```sh
# Group directories first and use a long, readable format
alias ls="lsd --group-directories-first"
alias ll="ls --long --almost-all --human-readable"
alias lt='ls --tree --total-size'
```

`ll` and `lt` give comprehensive and tree-structured views of directories, which are ideal for development.

## Text Viewing & File Count

Viewing text files and counting items in directories are common tasks. These aliases make those tasks clearer and faster.

```sh
# Enhanced text viewing with color and line numbers using bat
alias cat="bat --style=plain"

# Count files in the current directory
alias count='ls -1 | wc -l'
```

These are perfect for quickly glancing at files or counting contents without complex commands.
{{< card type="info" >}}
[bat is cat on steroids](https://github.com/sharkdp/bat) and it is what i use as a drop-in-replacement for `cat`
{{< /card >}}

## Git

Managing Git repositories is simplified with these aliases. The git aliases found here I actually fetch via a shell plugin, that contains a whole lot more than i actually use (yet).

```sh
# Selection of my most used git aliases
alias g='git'
alias gaa='git add --all'
alias gama='git commit --amend -am' # Add all modified files and change commit message
alias gan='git commit --amend --no-edit' # Keep commit message (optionally 'git add' files)
alias gcam='git commit -am'
alias gco='git checkout'
alias gcob='git checkout -b'
alias gf='git fetch'
alias gfo='git fetch origin'
alias gd='git diff'
alias gds='git diff --staged'
# Fancy 'git log --graph --oneline':
alias glgo='git log --graph --date=format:"%d/%m/%y" --pretty=format:"%C(yellow)%h%Creset   %C(white)%ad%Creset   %C(bold)%s    %C(bold green)%D%Creset%n"'
alias gp='git push'
alias gpl='git pull'

# Git commands using lazygit, an interactive Git UI
alias lg='lazygit'
```

I use these on a regular basis, but more and more often stretch for `lazygit` to handle `git` operations, especially for interactive rebasing and solving conflicts.

## System Monitoring & Resource Management

Keep an eye on system memory and CPU usage with these handy aliases, perfect for spotting resource-heavy processes.

```sh
# Check top processes by memory usage
alias psmem='top -l 1 -n 10 -o rsize | tail -n +12 | awk "{print \$1, \$2, \$3, \$8, \$9, \$10}" | column -t | bat --color=always'

# Check top processes by CPU usage
alias pscpu='ps aux | sort -nk 3,3 | tail -n 5'
```

These are helpful for developers who want to optimize system performance or spot issues quickly.

## Tmux Session Management

These `tmux` aliases simplify creating, attaching, and managing sessions, especially if you work in a multi-window environment.

```sh
# Tmux aliases for session management
alias tm="tmux"
alias tma="tmux attach-session"
alias tmat="tmux attach-session -t"
alias tmkas="tmux kill-session -a"
alias tml="tmux list-sessions"
alias tmn="tmux new-session"
alias tms="tmux new-session -s"
```

These are excellent for frequent `tmux` users who need to manage multiple sessions easily.

## Colorize `grep`

When working with log files or long text output, colorizing the `grep` results can make matching patterns more visible and easier to identify. The following aliases automatically enable color in `grep`, `egrep`, and `fgrep`, highlighting matching patterns within text output.

```bash
# Enable colored output for grep, egrep, and fgrep
alias grep='grep --color=auto'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
```

These aliases will colorize results by default, making it much faster to spot matches.

## Miscellaneous Aliases

Here are some versatile aliases for common tasks, such as load `zsh` config in editor, accessing history, viewing system information, count files in cwd, go to sleep, reboot and power off.

```bash
# Open Zsh configuration for quick edits
alias zshconfig="v ~/.config/zsh"

# Display command history
alias h="history"

# Display system information
alias mycomp='system_profiler SPSoftwareDataType SPHardwareDataType'

# Display a count of files in the current directory
alias count='ls -1 | wc -l'

# Quickly put the display to sleep (macOS-specific)
alias zz='pmset displaysleepnow'

# Reboot and shutdown aliases with sudo permissions
alias reboot='sudo /sbin/reboot'
alias poweroff='sudo /sbin/poweroff'
```

Oh and not to forget this beauty.

```bash
# Original ctrl+z behavior, suspend program
# Repeat action to move suspended program to foreground
_zsh_cli_fg() { fg; }
zle -N _zsh_cli_fg
bindkey '^Z' _zsh_cli_fg
```

Is it too much of an effort needing to press ctrl+z followed by 'fg' to return it to foreground? Then you'll love this suspend toggle!
