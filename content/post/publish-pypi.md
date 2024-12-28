---
title: "How I Published My First Python Package to PyPI"
date: "2024-12-28"
description: ""
tags:
  - Python
  - PyPI
  - CLI Tools
  - Open Source
  - Software Development
categories:
  - tools
  - python
---

Publishing a Python package to PyPI was one of those “someday” goals for me. It wasn’t something I actively planned to do, but once I did, I realized how straightforward and satisfying the process can be. This post walks through how I published my first package, trello-csv, and some lessons I picked up along the way.

<!--more-->

Okay so, I have this project that had been collecting dust for awhile and there is even a post about it [here](../trello-csv-export). Once upon a time I worked on this little side project CLI to generate excel docs from trello boards. Using the trello API, parsing it and yadda yadda. Point is, its a handy little program to have around at times.

Until recently, the README for the project basically took a developer's approach to it—you pretty much had to run it as a developer would. I did not have any official release or even plan to. And it just struck me as a thing to do: streamline the install flow and even get it published so you can install it as simple as:

```python
pip install trello-csv

```

## Why Publish to PyPI?

{{< image src="python-logo.svg" alt="python logo" center=true >}}

Publishing a package to PyPI might seem like an obvious thing for some developers, but for me, it wasn’t really on my radar at first. This project—`trello-csv`—had been sitting in my repository for quite some time. It was functional, but I hadn’t really thought about making it “user-friendly” or putting it out there for others to use.
The thing is, having explained how to set it up a few times, the more I realized how annoying it was to explain the whole “clone the repo, set up your environment, run it like this” process to anyone who might benefit from it. Wouldn’t it be so much better if I could just tell someone:

```bash
pip install trello-csv
trello-csv --output-dir ./my-csv-folder
```

That was the moment it clicked. Publishing to PyPI wouldn’t just streamline the process for others—it would also challenge me to improve my project. A public package needs to have good documentation, be easy to install, and (ideally) just work out of the box. It felt like a fun milestone to hit, and let’s be honest: being able to Google your own project and find it on PyPI? That’s a flex.

So, with that goal in mind, I started researching how to publish a package to PyPI. Spoiler alert: it’s not _that_ hard, but there are a few things I wish I’d known before diving in. In this post, I’ll walk you through the steps I took, what I learned, and how you can avoid some of the pitfalls I ran into.

## Setting the Foundation

Before diving into the actual publishing process, I needed to make sure my project was ready for the world. Here’s what that looked like:

1. **Streamlining the CLI**: I updated the tool to be more intuitive, adding features like default output directories and optional arguments.
2. **Dependencies**: I double-checked `requirements.txt` and moved the necessary dependencies into `setup.py`.
3. **Testing**: I ran the tool on multiple platforms (macOS, Linux, and Windows) to catch any compatibility issues.

I also updated the README to make it user-focused. Instead of a developer’s guide, it now explained how to install and use the tool as an end-user.

## Building the Package

The next step was turning my project into a distributable Python package. I used `setuptools` and `wheel`, which made this process surprisingly straightforward. Here’s a quick breakdown:

1. **Adding a `setup.py` File**:  
   My `setup.py` file defined the package name, version, author, dependencies, and entry points. The entry points were key for turning my Python script into a CLI command:

   ```python
   entry_points={
       "console_scripts": [
           "trello-csv=trello_csv.__main__:main",
       ],
   }
   ```

2. **Including Resources**:  
   I wanted the package to include the Excel template file it relies on. Adding `package_data` and adjusting how the script accesses this file ensured it would work both locally and after installation.

3. **Makefile for Automation**:  
   I created a `Makefile` to simplify common tasks like building, installing, and cleaning up artifacts. For example:

   ```makefile
   install:
       python3 -m pip install --upgrade pip setuptools build
       python3 -m build
       python3 -m pip install dist/*.whl
   ```

   This wasn’t strictly necessary, but it made the process smoother for me.

## Publishing to PyPI

With the package ready, it was time to publish. Here’s the process I followed:

1. **Installing Twine**:  
   Twine is the tool you use to securely upload your package to PyPI. I installed it with:

   ```bash
    python -m pip install twine
   ```

2. **Building the Distribution Files**:  
    Thanks to the handy `Makefile` all that is needed is:

   ```bash
   make install
   ```

3. **Uploading to PyPI**:  
    Finally, I used Twine to upload the package:

   ```bash
   twine upload dist/*
   ```

   PyPI prompts for credentials, and just like that, my package was live.
   Even better, if you want to avoid reaching for your credentials each every upload, then simply create a file `~/.pypirc` and populate it with:

   ```toml
   [pypi]
   username = __token__
   password = YOUR_API_KEY
   ```

   And Twine will immediately recognize it.

## Lessons Learned

Here are a few things I picked up during this process:

1. **Dont have runtime dependencies on `setuptools`**:  
   My package broke on environments without `setuptools` installed. To read the excel template inside the package at runtime, I used `pkg_resources` which is apart of `setuptools`. Turns out this is a better solution:

   ```python
    import importlib.resources

    try:
        with importlib.resources.open_binary(
            __package__, "csv/trello_template.xlsx"
        ) as template_file:
            workbook = openpyxl.load_workbook(template_file)

   ```

2. **Test the Installed Package**:  
   After publishing, I tested the package by installing it fresh with `pip install trello-csv`. This caught a few path issues I hadn’t noticed during local testing.

3. **Documentation Matters**:  
   A user-friendly README goes a long way. I included usage examples, command-line options, and even explained defaults like saving files to `~/Downloads`.

## Wrapping Up

Publishing `trello-csv` to PyPI turned out to be a great learning experience. It pushed me to refine my project, improve its usability, and learn more about Python packaging. If you’ve got a project that others might find useful, I highly recommend giving it a shot.

You can check out `trello-csv` on [PyPI](https://pypi.org/project/trello-csv/) or the [GitHub repo](https://github.com/mattjh1/trello-csv-exporter).
