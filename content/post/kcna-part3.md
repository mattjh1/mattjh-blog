---
title: "Learning k8s, KCNA preparation (Part 3)"
date: 2024-10-30
description: "Containers and Kubernetes Fundamentals – My KCNA Journey (Part 3)"
tags:
  - KCNA
  - k8s
  - certification
  - architecture
  - containers
categories:
  - k8s
  - cloud-native
draft: true
---

In this third part of the series, we’ll dive into the fundamentals of **Containers** and **Kubernetes**. You’ll gain insights into how containerization revolutionizes application deployment and management, while Kubernetes provides the orchestration needed for scalability and resilience. Lets explore the power of containers and Kubernetes in modern application development.

<!--more-->

{{< card type="disclaimer" >}}
These notes are a polished version of my personal reflections taken while following along with [this Udemy course](https://www.udemy.com/course/dive-into-cloud-native-containers-kubernetes-and-the-kcna/?couponCode=LETSLEARNNOW). I found that taking meticulous notes while watching the content, combined with discussions with GPT about the topics, greatly enhances my understanding. Thus, some of this content is AI-generated.
{{< /card >}}

---

### Introduction to Containers

Containers technology has fundamentally transformed our approach to application development and architecture. Their ability to enable efficient management of applications at scale has become increasingly important.

### A Brief History of Container Technology

Understanding containers requires a look back at the evolution of virtualisation and isolation technologies over the decades:

- **Mainframe Era**: The seeds of virtualisation were planted in the 1960s and 1970s with mainframe systems like CP/CMS, which enabled time-sharing and virtual machines.

  - **CP/CMS**: This early operating system allowed multiple users to share the mainframe's resources.
  - **Time Sharing**: Enabled simultaneous access for multiple users, significantly enhancing resource utilization.

- **Chroot in Unix**: The introduction of `chroot` allowed processes to run with a changed root directory, isolating them from the rest of the filesystem.

  - While useful, `chroot` has limitations, such as visibility of IP addresses and the requirement for root ownership of directories.

- **FreeBSD Jails**: In 2000, FreeBSD introduced Jails, which provided a way to partition the system into isolated environments with their own user sets, processes, and filesystems. While powerful, Jails proved complex, limiting their widespread adoption.
- **Virtual Machines**: Technologies like VMware and VirtualBox provided software emulation of physical machines. Sun Solaris introduced Zones for virtualisation, while HP-UX offered Virtual Partitions.

- **Namespaces and Cgroups**: The introduction of namespaces in the Linux kernel (2002) allowed isolation of user IDs, processes, network interfaces, and more.

  - **Cgroups**, developed by Google, helped manage resource allocation and monitoring for processes.

- **The Rise of Docker**: Docker combined these namespaces and cgroups, making containerization accessible and user-friendly. Founded in 2010 as dotCloud, Docker's open-source launch in 2013 revolutionized how applications are deployed and managed.

### What is a Container Image?

A container image is a portable, self-contained bundle of software and its dependencies, allowing for consistent execution across various computing environments. The term "container image" is often confused with "Docker image," but it's important to note that "OCI Compliant Container Image" encompasses various container technologies, including Docker.

### The Difference Between a Container Image and a Container

A **container image** serves as the template for creating containers, while a **container** is the running instance of that image. For instance, a single NGINX container image can spawn multiple instances across various projects, each operating as a separate container.

### What Are Container Image Tags?

Container image tags are labels that help distinguish different versions of an image. These tags can specify versions, operating systems, architectures, and more. The "latest" tag does not necessarily indicate the most recent version; it's simply a default tag applied when none is specified.

### Pulling Containers

When you execute a command like `docker pull mattjh1/my-nvim:v1.4.0-arm64`, Docker pulls multiple layers of the image. This process is efficient because it downloads only the necessary chunks of data, based on the contents of the `Dockerfile` used to create the image.

**Layers**: Container images consist of multiple layers, which are combined to form the final image. Each layer remains persistent, while the "write layer" on top is where changes are made. This design enhances storage efficiency; multiple containers can share the same base image without redundancy.

**Digest**: A digest is a unique hash (SHA256) calculated from the image's contents, ensuring integrity during pulls and pushes between registries.

**Image ID**: An image ID is also a checksum but is calculated differently and may not include a digest unless pushed to a container registry. This distinction is crucial for managing local images versus those stored in a registry.

### Running Containers

Once you have your container image, running it is straightforward. Use the command `docker run <image-name>` to start your container.

### Building Containers

When constructing your container, aim for minimalism. Start with a lightweight base image, such as `alpine`, and manually install necessary dependencies. Document your steps and use this history to write an efficient `Dockerfile`. This iterative approach not only builds understanding but also optimizes your final image.

### Hands-On Exercises: Key Takeaways

1. **Keep Containers Small**: Always aim to minimize the size of your images.
2. **Use Base Images Wisely**: Begin with the bare minimum necessary for your application, then build up as needed.
3. **Iterative Development**: Use the shell within a base image to experiment and understand what you need before finalizing your `Dockerfile`.
