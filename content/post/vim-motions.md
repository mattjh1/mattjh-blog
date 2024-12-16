---
title: "Vim Motions"
date: "2024-10-09"
description: "What do i love Vim? Well vim motions of course, want to learn more? Check out this post"
tags:
  - vim-motions
  - IDE-plugins
  - vscode
categories:
  - productivity
---

Vim motions; a skill every developer, sysadmin, or power-user should learn.
As developers we're always looking for ways to optimize our workflows, making us more efficient. One tool that sticks out for me in its unique approach to navigation and text manipulation is Vim.

<!--more-->

{{< image src="vscode.svg" alt="Funny meme about copying in vscode vs Vim" center=true >}}

Before you smirk and stop reading this post, thinking it's just another push to convert everyone to be a full-time Vim user, let me clarify; this is **not** about convincing you to ditch vscode, intellij or whatever.

Instead, lets talk about a specific and in my opinion, the strongest feature of Vim-its motions. Vim motions are a set of commands, when mastered, can transform how you interact with any text. You do not need terminal Vim to take advantage of this, in fact all modern IDEs and editors offer plugins to mimic Vim motions. So you can reap many of the benefits that the fanatic Vim users (which I'm one, more on that [here](../nvim-obsession)) are raving about without making the somewhat daunting editor switch.

## What are Vim motions?

Vim motions refer to how you move around inside a file, navigating, selecting, and performing common operations like editing, cutting, copying, and pasting. While typical navigation involves arrow keys and mouse scrolling. Vim takes it to another level with a combination of keys that move you through text semantically: by word, by paragraph, by sentence, or search for next character on a line.

For example:

- `w` moves you to the beginning of next word
- `e` moves you to the end of the next word
- `b` moves you to the beginning of previous word
- `0` moves you to the beginning of the line
- `$` moves you to the end of the line
- `gg` moves you to the top of the file
- `GG` moves you to the end of the file

These basic motions may seem trivial, but the way vim works by chaining commands together trivial commands become incredibly powerful when combined.

## Why should you learn Vim motions?

1. **Improved text navigation and selection:**
   - Vim motions allow you to move to exactly where you need to be with minimal amount of keypresses and without using the mouse. It is easy to get distracted when coding, this feature alleviates that and makes it easier to focus on your code.
2. **Gain better understanding of text structure:**
   - As you get comfortable with motions like `}` to move to next paragraph, and `f` to search for next occurrence of a character on the line you're currently editing. You begin to view the contents of the text buffer in a structural way, rather than a collection sequential characters. This shift in mindset helps understanding code on a deeper level.

## Discovering the beauty of Vim

Learning Vim was a game-changer for me. Before I mastered the motions, I used Vim sparingly. But once the motions 'clicked', I understood how efficiently I could navigate and edit, it become blazingly obvious that Vim is not just another editor—it is a powerful skill set for those who want to master their craft.

Vim motions did not just make me faster at editing code, they fundamentally changed how I approach coding. As i become more comfortable I started using Vim as my primary editor over vscode with Vim plugin. As part of natural progression and wanting more and more advanced features out of Vim, like Vim macros.

## How to start learning Vim motions

You do not need to commit to using Vim full-time to appreciate its motions, best way is to start slow.

1. **Enable Vim keybindings in your current editor:**
   - Go the plugin section, search for Vim and you are sure to find it. Start by getting used to basic motions `h`,`j`,`k`,`l` for navigation.
2. **One thing at a time:**
   - Add things to your repertoire piece by piece, `w`, `b` for word navigation. Progress with stuff like `gg`. And eventually modifying text, eg., `ciw` to change inside word.
3. **Practice command chaining:**
   - The really neat features of Vim comes by combining these trivial commands, try stuff like `c$` to change until the end of the line. `di)` delete inside parentheses.
4. **Don't get overwhelmed:**
   - Vim is known for a steep learning curve, if you try to take in too much too fast you are more likely to give up on it. Let it sink in, and the simplicity of the basic commands will eventually naturally guide you to the advanced aspects.

## Conclusion

Vim motions are a skill that every developer can benefit from, whether or not they use Vim as their main editor. Mastering them means understanding text as a structured entity, making it easier to navigate and manipulate code with precision. It’s only after mastering motions that I truly appreciated the elegance of Vim, and it naturally became my editor of choice.

But you don’t have to make that leap. Learn the motions. Understand the text. And then, if you find yourself falling for the beauty of Vim, you’ll know exactly why.
