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

Publishing a Python package to PyPI is one of those “someday” goals. It wasn’t something I actively planned to do, but once I went through the process, I realized how straightforward and satisfying it can be. This post walks through the journey of publishing my first package, `trello-csv`, and some lessons I’ve picked up along the way.

<!--more-->

I have this project that has been collecting dust for a while, and there’s even a post about it [here](../trello-csv-export). Once upon a time, I worked on a little side project CLI to generate Excel docs from Trello boards. Using the Trello API, parsing the data, and yadda yadda—point is, it’s a handy little program to have around at times.

Until recently, the README for the project took a developer's approach to things—you pretty much had to run it as a developer would. There wasn’t an official release or even a plan for one. Then it struck me as something worth doing: streamline the install flow and even get it published so you could install it as simple as:

```bash
pip install trello-csv
```

## Why Publish to PyPI?

{{< image src="python-logo.svg" alt="python logo" center=true >}}

Publishing a package to PyPI might seem like an obvious step for some developers, but for me, it wasn’t really on my radar initially. This project—`trello-csv`—had been sitting in my repository for a while. It was functional, but I hadn’t thought much about making it “user-friendly” or putting it out there for others to use.

The thing is, after explaining how to set it up a few times, I began to realize how annoying it was to go through the whole “clone the repo, set up your environment, run it like this” explanation with anyone who might benefit from it. Wouldn’t it be so much better to just tell someone:

```bash
pip install trello-csv
trello-csv --output-dir ./my-csv-folder
```

That’s when it clicked. Publishing to PyPI doesn’t just streamline the process for others—it also challenges you to improve your project. A public package needs good documentation, should be easy to install, and (ideally) just work out of the box. Hitting that milestone felt like a fun challenge. Let’s be honest: being able to Google your own project and find it on PyPI? That’s a flex.

With that goal in mind, I dove into researching how to publish a package to PyPI. Spoiler alert: it’s not _that_ hard, but there are a few things I wish I’d known beforehand. This post outlines the steps I took, what I learned, and how to avoid some of the pitfalls along the way.

## Setting the Foundation

Before diving into the actual publishing process, I made sure the project was ready for the world. Here’s how I approached it:

1. **Streamlining the CLI**: The tool is updated to be more intuitive, with features like default output directories and optional arguments.
2. **Dependencies**: I double-checked `requirements.txt` and moved the necessary dependencies into `setup.py`.
3. **Testing**: The tool is tested on multiple platforms (macOS, Linux, and Windows) to catch any compatibility issues.

I also revamped the README to focus on end-users. Instead of a developer’s guide, it now explains how to install and use the tool as an end-user.

## Building the Package

The next step is turning the project into a distributable Python package. Using `setuptools` and `wheel`, this process becomes surprisingly straightforward. Here’s the breakdown:

1. **Adding a `setup.py` File**:  
   The `setup.py` file defines the package name, version, author, dependencies, and entry points. The entry points are key for turning the Python script into a CLI command:

   ```python
   entry_points={
       "console_scripts": [
           "trello-csv=trello_csv.__main__:main",
       ],
   }
   ```

2. **Including Resources**:  
   The package includes the Excel template file it relies on by adding `package_data` and adjusting how the script accesses this file to ensure it works both locally and after installation.

3. **Makefile for Automation**:  
   A `Makefile` simplifies common tasks like building, installing, and cleaning up artifacts. For example:

   ```makefile
   install:
       python3 -m pip install --upgrade pip setuptools build
       python3 -m build
       python3 -m pip install dist/*.whl
   ```

   While not strictly necessary, this makes the process smoother.

## Publishing to PyPI

Once the package is ready, the next step is publishing. Here’s how the process looks:

1. **Installing Twine**:  
   Twine is the tool for securely uploading your package to PyPI. Install it with:

   ```bash
   python -m pip install twine
   ```

2. **Building the Distribution Files**:  
   With the `Makefile` in place, this step is a breeze:

   ```bash
   make install
   ```

3. **Uploading to PyPI**:  
   Use Twine to upload the package:

   ```bash
   twine upload dist/*
   ```

   PyPI prompts for credentials, and just like that, the package goes live.
   To avoid manually entering credentials each time, you can create a file `~/.pypirc` and populate it with:

   ```toml
   [pypi]
   username = __token__
   password = YOUR_API_KEY
   ```

   Twine will recognize this file automatically.

## Lessons Learned

Here are some key takeaways from the process:

1. **Avoid Runtime Dependencies on `setuptools`**:  
   The package initially broke on environments without `setuptools` installed. To read the Excel template inside the package, I used `pkg_resources` from `setuptools`. A better solution is:

   ```python
   import importlib.resources

   try:
       with importlib.resources.open_binary(
           __package__, "csv/trello_template.xlsx"
       ) as template_file:
           workbook = openpyxl.load_workbook(template_file)
   ```

2. **Test the Installed Package**:  
   After publishing, I tested the package by installing it fresh with `pip install trello-csv`. This caught path issues that weren’t apparent during local testing.

3. **Documentation Matters**:  
   A user-friendly README makes a huge difference. Usage examples, command-line options, and explaining defaults like saving files to `~/Downloads` are invaluable.

## Wrapping Up

Publishing `trello-csv` to PyPI has been a great learning experience. It encourages refining the project, improving usability, and learning more about Python packaging. If you’ve got a project others might find useful, I highly recommend giving it a shot.

You can check out `trello-csv` on [PyPI](https://pypi.org/project/trello-csv/) or the [GitHub repo](https://github.com/mattjh1/trello-csv-exporter).
