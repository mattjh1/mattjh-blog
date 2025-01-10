---
title: "Containerize Neovim? But why??"
date: "2025-01-09"
description: ""
tags:
  - Developer Experience (DX)
  - DevOps
  - VDI
  - Neovim
  - CLI Tools
  - X11 Forwarding
categories:
  - productivity
  - Workflows
  - tools
  - hacks
  - Dev Rants
toc: false
---

It’s tough when you find yourself at the mercy of some executive decisions that you know are going to cost more in the long run than they save. But hey, it’s a part of the game, right? Sometimes, execs make decisions based on advice from people who don’t have the full picture—leading to, let’s say, _interesting_ outcomes. Or maybe I’m the one missing the full picture—but hey, that doesn’t make my pain points any less real.

<!--more-->

Let me tell you about one such situation that led me down a quite funny path (in the end). In one assignment at a large tech company, I was introduced to a painful way of working as a developer. It involved connecting to a painfully slow, latency-prone Virtual Desktop Infrastructure (VDI) without `sudo`. From there, SSH into a shared development machine. Great machine… when it’s just me or maybe one or two other people. But with a whole team and `sudo` access? Yeah, let’s just say things could go from smooth sailing to a productivity parking lot real quick.

But let’s kick it up a notch—next up, `devcontainers`. When I first started, all I heard was `vscode`, `vscode`, `VSCODE`, like it’s a given that every damn developer in the world uses it. To access `vscode` graphically in the VDI, it involved `X11 forwarding`. Not exactly a smooth ride, but I guess if you’re feeling patient, it could work. Not my cup of tea though.

{{< rawhtml >}}

<div style="text-align: center;">
    <img src="/images/so_on_on_on.webp" alt="And so on and so on and so on." width="640">
</div>
{{< /rawhtml >}}

Anyway, enough of the complaints, let’s move on to how I actually made this bearable. Getting my [dotfiles](https://github.com/mattjh1/dotfiles) installed was a given, quick and easy thanks to my prior work to make this portable. Next up, `devcontainers`. I hadn’t worked with `devcontainers` before, and I was told over and over that I’d need `vscode` to use them. Turns out, not the case at all—another little surprise in the process!

Looking at the project I was about to start working on and the way the container setup was organized, I found it to be quite elegant and well thought out. It made onboarding and getting people productive really easy. I also discovered the `devcontainer CLI`, which simplifies running the critical setup to get things up and running—without relying on that editor you're all too familiar with by now.

Simple as that, and the related `devcontainer.json` configuration is used to set up the container. Devcontainers, use docker-in-docker or DinD for short. All I can say about that is that I love it.

```bash
devcontainer up --workspace-folder ~/code/<your-project-folder>
```

You will be needing a shell inside the environment, voila!

```bash
devcontainer exec \
  --container-id $(docker ps | grep <unique-container-name> | awk '{print $1}') \
  --workspace-folder ~/code/<your-project-folder> \
  zsh
```

And now, what I'm most proud of: the Neovim container inside the container—a glorious abomination, all thanks to DinD. This Neovim container basically wraps all the goodies I've grown accustomed to.

```bash
devcontainer exec \
  --container-id $(docker ps | grep <unique-container-name> | awk '{print $1}') \
  --workspace-folder ~/code/<your-project-folder> \
  zsh -c 'docker run -it --rm --network host \
  -v /workspace/<your-project-folder>:/workspace \
  -w /workspace mattjh1/my-nvim:v1.4.0-amd64'
```

Put these in your `alias` collection and boom, all set with a great dev environment given the circumstances.

**Moral of the Story**  
Sometimes, you can’t change the system, but you _can_ bend it just enough to make it work for you. Whether it’s fighting through the quirks of VDI, bypassing `X11 forwarding`, or hacking your way to a Neovim-in-a-container masterpiece, the lesson here is simple: Adapt, improvise, and—above all—don’t let the tools dictate your productivity. Remember, even the most ridiculous setup can turn into a playground for creativity with the right mindset (and a healthy dose of aliases).
