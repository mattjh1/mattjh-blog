---
title: "My Journey into Effective Note-Taking"
date: "2024-10-16"
tags:
  - markdown
  - notes
  - zettelkasten
  - obsidian
categories:
  - productivity
  - tools
featured_image: git-obsidian-zettelkasten-aigen.png
---

Over the years, my journey into effective note-taking has been anything but linear.
From the chaos of disorganized, barely readable handwritten notes in university to exploring various digital tools, I've discovered what works for me in managing information overload.

<!--more-->

In this post, I’ll share my evolution as a note-taker and how I’ve finally found a system that resonates with my workflow.

---

## My Early Experiences

During my University days, I began developing a habit of note-taking on paper. This practice positively impacted my studies, and I credit much of my academic success to it. The act of writing helped solidify information in my mind, even though I rarely revisited my notes afterward and if I did it rarely helped due to disorganized nature of it. When I first started my job as a software engineer, the overwhelming amount of information I ran into made it clear that I needed an efficient system for capturing and organizing notes.

## Finding the Right Tool...

My first serious attempt at a digital note-taking system was with Notion, and at first, I really enjoyed it. Its user-friendly interface and rich features made it easy to start organizing my thoughts. It felt like everything had its place, and the customization options gave me the freedom to structure my notes in ways that made sense to me. However, despite all of these strengths, I struggled to build a habit around it.

One of the things that ended up turning me off from Notion was the way it locks you into their ecosystem. Notion's proprietary file formats made exporting or moving my notes out of the platform a hassle. This intentional lock-in made me wary of investing too much into it, as I didn't want my data tied to a service where my notes might not be easily accessible in the future. I want flexibility and the freedom to move my data wherever and whenever I need it.

After moving away from Notion, I tried out vimwiki and taskwarrior, looking for something simpler and more integrated with my terminal workflow. I enjoyed the minimalism and efficiency of these tools, but at times it felt like I was forcing myself to use them because they aligned with my ideals rather than my actual needs. I appreciated the terminal-based experience, but no doubt did I miss some of the features tools like Notion provide.

Ultimately, I realized I wanted the best of both worlds—a solution that offered the flexibility and simplicity of a terminal-based tool with the organizational capabilities and aesthetics of something like Notion.

### Discovering Obsidian

{{< youtube zIGJ8NTHF4k >}}

My breakthrough came when I stumbled upon this compelling video by Mischa van den Burg. The concept of using Obsidian for note-taking immediately resonated with me. It offered a fresh approach that combined the benefits of markdown files with powerful organizational features.

In the video, Mischa introduces the _Zettelkasten_ method, which completely changed how I approached note-taking. This method emphasizes creating small, atomic notes that are richly interconnected, forming a web of ideas over time. Obsidian’s internal linking and _Graph View_ bring this to life, allowing me to visualize connections between notes. It has been a game-changer, helping me build a _"second brain"_ where knowledge grows organically and meaningfully.

### Why Obsidian Works for Me

Eight months into using Obsidian, I’ve found it to be the most sustainable note-taking system I've used so far. Here are the features that have made a significant impact on my workflow:

- **Local Vaults**:
  - My notes are stored as simple markdown files in my local file system. There’s no login required, making it easy to access my thoughts anytime.
- **Neovim Integration**:
  - The fantastic Neovim integration through a plugin allows me to leverage my favorite text editor while taking notes.
- **Robust Plugin Ecosystem**:
  - The variety of plugins enhances my note-taking experience, allowing for customization that suits my needs.
- **Diagram Integration**:
  - I can easily integrate **Excalidraw**, my preferred diagram tool, directly into my notes.
- **Graph View**:
  - The graph view of my notes is a visual delight. As my vault grows, the interconnectedness of my thoughts becomes clearer, inspiring reflection and deeper insights.
- **Backup with Git:**
  - The Git plugin automates the backup of my notes to a private GitHub repository, ensuring my thoughts are portable and secure. This level of control over my data is liberating, especially compared to proprietary solutions that limit accessibility.

{{< image src="obsidian-graphview.png" alt="Graph view of my obsidian notes so far" center=true max-width="100%" >}}

My graph view is still modest, i want to look back at and see it sprawling with patterns to see. But already I'm able to draw inspiration from it, and it has made it more clear to me what I'm actually interested in pursuing, and therefore taking the correct path moving forward. It makes it easier to reflect for sure.

{{< image src="gh-notes.png" alt="Private vault repo" center=true max-width="100%" >}}

The **Git** plugin is an absolute game-changer for managing backups of my notes to my private GitHub repository. The best part? It all happens automatically. I no longer have to worry about the tedious tasks of manually adding, committing, and pushing files. This seamless integration is nothing short of amazing, allowing my notes to be portable and accessible from anywhere. Each time I think about it, I'm genuinely blown away by the convenience it offers.

What I appreciate most is the flexibility it provides. While I prefer using GitHub, the option exists to back up my notes to other platforms like S3, Dropbox, Google Cloud, or virtually any storage solution you might choose. This kind of adaptability is incredibly powerful and liberating. I don't feel locked into a proprietary system where the control over my data is out of reach, putting me at the mercy of some corporation—_cough, Notion_.

This level of autonomy is particularly important when it comes to something as personal as my scribbled thoughts and ideas. Managing my own backups strengthens my knowledge vault, ensuring I can maintain my workflow while safeguarding my privacy.

## Conclusion

Reflecting on my note-taking journey, it’s clear that finding the right system is a deeply personal process. From chaotic handwritten notes to exploring various digital tools, I’ve navigated through the complexities of managing information overload. Ultimately, my experience with Obsidian has transformed how I capture and organize my thoughts, allowing me to embrace a more structured approach with the _Zettelkasten_ method.

The features that Obsidian offers—local vaults, Neovim integration, a robust plugin ecosystem, and the invaluable graph view—have not only enhanced my productivity but have also deepened my understanding of my own thought process. The Git plugin further solidifies my confidence in this system by ensuring my notes are secure and portable, free from the constraints of proprietary platforms.

As I continue to refine my note-taking practices, I’m excited about the potential for growth and discovery that Obsidian provides. The journey may have been winding, but each step has brought me closer to a system that not only meets my needs but also empowers my learning process. If you’ve struggled to find your note-taking groove, I encourage you to explore the possibilities that tools like Obsidian offer. You might just find the perfect fit for your own unique workflow.

## Read more

- [Mischa van den Burg zettelkasten blog post](https://mischavandenburg.com/zet/neovim-zettelkasten/)
- [Elizabeth Butler comprehensive Obsidian walk-through](https://elizabethbutlermd.com/obsidian-notes/#Who_is_Obsidian_best_for)
