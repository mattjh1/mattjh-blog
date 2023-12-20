---
title: "Enhancing Productivity with Custom Tmux Session Management"
date: 2023-11-25
draft: false
---

In the realm of terminal-based productivity, managing multiple projects efficiently can be a challenge. Enter the Tmux Session Chooser Script, a custom solution designed to streamline project switching and enhance your workflow.

<!--more-->

This article explores the motivations, functionalities, and benefits of this script, illustrating how it has become an indispensable tool for effortlessly navigating between different tasks.

## The Need for Efficient Project Switching

Imagine you're working on multiple projects simultaneously, each with its own set of terminal sessions and configurations. Switching between these projects can quickly become cumbersome, leading to a loss of focus and productivity. The Tmux Session Chooser Script addresses this challenge by providing a user-friendly interface to select or create Tmux sessions, enabling seamless transitions between projects.

## Key Features

### 1. **Session Selection Menu**

Upon startup, the script presents a menu displaying existing Tmux sessions. This allows users to choose the project they want to work on by simply selecting the corresponding session.

### 2. **New Session Creation**

For situations where a new project or task requires a dedicated environment, the script offers the option to create a fresh Tmux session. Users can provide a session name, and a new workspace is set up, ready for action.

### 3. **Graceful Exit**

The script is designed with user experience in mind. Pressing Ctrl-C during session selection gracefully exits the script, preventing accidental interruptions.

## Integration with Alacritty

To seamlessly integrate the Tmux Session Chooser Script with Alacritty, follow these steps:

1. Open your Alacritty configuration file. This is usually located at `~/.config/alacritty/alacritty.yml` or `~/.alacritty.yml`.

2. Add the following lines to the configuration file, replacing `<path_to_script>` with the actual path to your Tmux Session Chooser Script:

   ```yaml
   # This script will prompt to select tmux session or create a new one on startup
   shell:
     program: /path/to/tmux_chooser_script
   ```

   For example:

   ```yaml
   # This script will prompt to select tmux session or create a new one on startup
   shell:
     program: /Users/mattjh/.local/bin/tmux_chooser
   ```

3. Save the configuration file.

Now, every time you launch Alacritty, the Tmux Session Chooser Script will run automatically, providing a seamless way to manage your projects.

## Seamless Workflow Integration

One of the strengths of the Tmux Session Chooser Script is its integration into the terminal configuration. By incorporating the script into the Alacritty terminal configuration file, the script is automatically executed on startup. This means that every time you open a terminal, you're presented with the session selection menu, enabling swift transitions between projects without additional manual steps.

## Personal Experience and Benefits

As a developer, I've found immense value in using this script as part of my daily workflow. Here are some notable benefits:

- **Effortless Project Switching:** Jumping between projects is as simple as selecting the desired session from the menu.

- **Focused Work Sessions:** Each Tmux session encapsulates the environment for a specific project, allowing me to maintain focus without distractions from other ongoing tasks.

- **Project Context Preservation:** With each session corresponding to a specific project, I can easily pick up where I left off, even after a break.

## Script

Before diving into using the Tmux Session Chooser Script, it's essential to note that the script is configured with assumptions about the user's environment. The current version assumes a macOS environment with Tmux installed using Homebrew.

If your setup differs—for example, if you're using a different operating system or if Tmux is installed using a method other than Homebrew—feel free to modify the script to suit your environment. The script is designed to be adaptable, ensuring compatibility with various configurations.
The reason for opting to go for a full path to the installation is because of how I execute this script, it is the first thing introduced to my terminal emulator (Alacritty). So running `which tmux` will not work in this case albeit that would be a more elegant solution.

Here's a quick overview of the assumptions made by the script:

- **Operating System:** macOS
- **Tmux Installation:** Homebrew

```bash
#!/bin/sh

# Confirm exit with Y/N
function confirm_exit() {
    read -rp "Do you really want to exit? (y/n): " choice
    case "$choice" in
        [Yy])
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Resuming..."
            ;;
    esac
}

# Trap Ctrl-C and call the confirmation function
function ctrl_c() {
    confirm_exit
}

trap ctrl_c SIGINT

no_of_terminals=$(/opt/homebrew/bin/tmux list-sessions | wc -l)
IFS=$'\n'
output=($(/opt/homebrew/bin/tmux list-sessions))
output_names=($(/opt/homebrew/bin/tmux list-sessions -F\#S))
k=1
echo "Choose the terminal to attach: "
for i in "${output[@]}"; do
	echo "$k - $i"
	((k++))
done
echo
echo "Create a new session by entering a name for it"
read -r input
if [[ $input == "" ]]; then
	/opt/homebrew/bin/tmux new-session
elif [[ $input == 'nil' ]]; then
	exit 1
elif [[ $input =~ ^[0-9]+$ ]] && [[ $input -le $no_of_terminals ]]; then
    terminal_name="${output_names[input]}"
	/opt/homebrew/bin/tmux attach -t "$terminal_name"
else
	/opt/homebrew/bin/tmux new-session -s "$input"
fi
ext 0
```

## Conclusion

The Tmux Session Chooser Script has proven to be a valuable asset in my toolkit, enhancing my ability to manage multiple projects effectively. Its simplicity, coupled with powerful session management capabilities, makes it a versatile solution for anyone seeking to optimize their terminal-based workflow.
