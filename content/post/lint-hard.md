---
title: "Let the Linter Save You from Being the Git Blame Target"
date: "2025-04-27"
description: ""
tags:
  - code quality
  - linting
  - static typing
  - best practices
categories:
  - coding standards
  - dev tools
toc: false
---

Over time, I’ve come to deeply value languages and tools that **force clarity early**—before things have a chance to go wrong in production. Whether it’s through strong typing, strict linting, or clear data validation, these practices consistently pay off in long-term maintainability and peace of mind.

<!--more-->

**It really clicked for me thanks to a senior colleague who took code quality seriously.**  
He didn’t treat linters as mere suggestions; he treated them like a second pair of eyes — a teaching tool. At first, they’re annoying, but you get better at silencing them over time. What really happens is you become a better coder because of it. His message really resonated with me:

> **"Let the linter hurt you now so you don’t get hurt later."**

Working with **Go** reinforced that even further. You can’t push through half-finished ideas—the compiler and tooling just won't let you. And when you run something like `golangci-lint` with strict settings, it gets even more intense. You're essentially forced to write code the way the language was designed to be written: clean, explicit, and safe.  
At some point, you almost earn the right to say:

> **"If things still go wrong, it’s on the language, not me."**

It’s not always comfortable. Compilers and linters **will** complain. Constantly. But that's their job—and I’d much rather deal with those complaints early than face them in a real code review, or worse, have them sneak past into production.

That same discipline carries over into my **TypeScript** work. I don’t love JS—actually, I hate it—but TypeScript gives me just enough protection to feel comfortable. Even then, it still sometimes feels like duct-taping the mess that is **JavaScript**. Seeing an `any` in production? It’s like someone gave up and told the compiler, "I got this, don't worry," when they clearly don’t.

**Even in Python**, I bring that same mindset. I lean heavily on **Pydantic** and typing annotations because dynamic typing without guardrails in production code is a slow-motion disaster waiting to happen. That said, Python is perfect for prototyping — fast and flexible. But when building something serious, Moving to something like **Go** for stricter typing and tooling makes sense, or doubling down on **Pydantic** to enforce structure.

At the end of the day, it's simple:  
**Lint hard now, or debug harder later.**

The compiler is your first code reviewer. The linter is your safety net.  
Let them be strict. Let them slow you down.

**With the advent of AI tools for code assistance, not following best practices is pitiful.** These tools are smarter than ever, helping catch issues before they become problems. There's no excuse for ignoring the basics when we've got this kind of support at our fingertips. These tools are there to help enforce the standards we know are critical. If you're still cutting corners and not following those guidelines, it's on you — the tools are already doing their part.

The alternative is finding your own name in the git blame history behind some quiet, costly bug you didn’t even remember writing — the kind that gives you sleepless nights and slowly crumbles your reputation.

So, next time you see that linter complaining, don’t silence it—**listen**. It’s not just your code that benefits; it’s your peace of mind, too.
