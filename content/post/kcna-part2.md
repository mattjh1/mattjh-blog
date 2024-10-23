---
title: "Learning k8s, KCNA preparation (Part 2)"
date: 2024-10-22
description: "Understanding Kubernetes Architecture – My KCNA Journey (Part 1)"
tags:
  - KCNA
  - k8s
  - certification
  - architecture
categories:
  - k8s
  - cloud-native
draft: true
---

In this second part of this series we're diving into some fundamental aspects of **Cloud Native Applications** and **Kubernetes architecture**. By the end, you'll have a clearer understanding of how cloud-native principles, architectures, and practices differ from traditional approaches and how they enhance **R**esilience, **A**gility, **O**perability, and **O**bservability.

<!--more-->

---

## Cloud Native Fundamentals

Cloud Native Applications harness the power of cloud infrastructure to enhance **resilience**, **agility**, **operability**, and **observability**. A memorable way to recall these key pillars is **Racoons Are Often Observant**:

- **R**esilience
- **A**gility
- **O**perability
- **O**bservability

These traits are foundational for building applications that thrive in dynamic environments like public, private, or hybrid clouds.

The CNCF plays a pivotal role in promoting cloud-native technologies. Its mission is to help organizations develop and run scalable, resilient applications in modern environments, such as cloud platforms, by leveraging key techniques such as:

- **Containers**
- **Service meshes**
- **Microservices**
- **Immutable infrastructure**
- **Declarative APIs**

These techniques work together to create **loosely coupled systems** that are **resilient**, **manageable**, and **observable**. With automation, they allow teams to deliver impactful changes with minimal downtime and reduced effort.

## Comparing Cloud Native with Monolithic Architecture

When comparing **monolithic architectures** to **cloud-native (microservices)**, the differences are striking. Let’s break it down:

### Monolithic Architecture:

```mermaid

graph TD
Client[Client] --> MonolithicApp[Monolithic Application]

    subgraph MonolithicApp[Monolithic Application]
        UI[User Interface] --> BusinessLogic[Business Logic]
        BusinessLogic --> DataAccess[Data Access Layer]
        DataAccess --> Database[(Database)]
    end
```

In traditional monolithic architectures, components like the **user interface**, **business logic**, and **data interfaces** are tightly coupled, running on the same server and sharing the same system resources. This tight coupling often leads to:

- **Fragility**: Changes in one part can break others.
- **Dependency Conflicts**: Adding or updating one application can cause version conflicts, affecting the whole system.
- **Scalability Issues**: Scaling the system usually requires scaling the whole application, making it resource-intensive.

In essence, monolithic systems are harder to update and scale quickly.

### Microservices Architecture:

```mermaid
graph TD
    Client[Client] --> IngressController[Ingress Controller]

    IngressController --> NGINX[NGINX Service]
    IngressController --> BusinessLogic[Business Logic Service]

    NGINX --> UI[User Interface]
    BusinessLogic --> BL[Business Logic]

    subgraph Databases
        Redis[Redis Cache]
        Postgres[PostgreSQL Database]
    end

    UI --> Redis
    BL --> Postgres

```

Cloud-native microservices decouple the components of the application into independent services, allowing each to scale and operate separately. For example, the **user interface** could be served by its own `NGINX` microservice, while the **business logic** might be powered by a separate `Java` service, with each component routing traffic through **Ingress Controllers**. This architecture provides:

- **Loose Coupling**: Easier to update or replace individual components without disrupting others.
- **Independent Scalability**: Each service can scale based on its specific demand, avoiding unnecessary resource consumption.
- **Improved Maintainability**: Teams can independently develop, test, and deploy services, fostering faster delivery.

## Cloud Native Practices

To fully embrace cloud-native architectures, there are several best practices to follow:

### 1. Microservices Architecture

This approach breaks down the application into **loosely coupled** components that can be independently deployed and managed. Each microservice focuses on a single responsibility, enhancing **agility** and **scalability**.

### 2. Containerization

By packaging applications and their dependencies into containers, developers ensure that these containers can run consistently across different environments. This approach enhances **isolation**, **efficiency**, and simplifies **management**.

### 3. DevOps

DevOps emphasizes collaboration between software development and IT operations teams, with a focus on **automation**, **monitoring**, and **collaboration**. This methodology speeds up the software development lifecycle and improves the quality of releases.

### 4. Continuous Delivery (CD)

CD is all about automating the build, test, and deployment processes, ensuring that code is always in a **releasable state**. This reduces the risk of introducing bugs and shortens the release cycle, enabling frequent, reliable updates.

## Kubernetes Self-Healing

One of the key cloud-native features Kubernetes offers is **self-healing**. Here’s how it works:

- **Deployments**: A declarative specification of the desired state of an application, defining how many replicas should run and how to handle updates.
- **ReplicaSet**: Managed by **deployments**, it ensures that the desired number of **Pods** are always up and running.
- **Pods**: The smallest deployable unit in Kubernetes, a Pod can contain one or more containers. Kubernetes ensures Pods stay running, restarting them if necessary.

## Application Automation

Automation is at the heart of cloud-native practices. Tools like **Ansible** and **Terraform** are commonly used:

- **Ansible**: Automates cloud-native environments by managing containers, deploying infrastructure, and configuring tasks.
- **Terraform**: Focuses on **Infrastructure as Code (IaC)**, enabling teams to deploy cloud infrastructure in a consistent, reproducible manner.

## CI/CD (Continuous Integration / Continuous Delivery)

```mermaid
graph LR
    subgraph CI [Continuous Integration]
        A[Code] --> B[Build]
        B --> C[Test]
    end

    subgraph CD [Continuous Delivery]
        C --> D[Release]
        D --> E[Deploy]
        E --> F[Monitor]
        F -->|Feedback| A
    end
```

CI/CD pipelines are critical to cloud-native applications. These pipelines automatically build, test, and deploy code, ensuring seamless integration and delivery. Here's a breakdown:

- **CI (Continuous Integration)**: This part of the pipeline runs automated tests, linting, and builds, ensuring code is ready for deployment once it passes.
- **CD (Continuous Delivery)**: Automatically prepares code for production, ensuring it’s always in a **releasable state**, even if not immediately deployed.
- **Continuous Deployment** is a more advanced practice that takes this further by automatically deploying every successful change to production. This is less common due to the operational complexities it introduces.

## Autoscaling in Kubernetes

Kubernetes offers several autoscaling options:

1. **Cluster Autoscaler**: Adjusts the size of a Kubernetes cluster based on pod resource needs.
2. **Horizontal Pod Autoscaler (HPA)**: Scales the number of pod replicas based on metrics like CPU or memory usage.
3. **Vertical Pod Autoscaler (VPA)**: Adjusts the CPU and memory requests/limits of individual pods.
4. **KEDA (Kubernetes Event Driven Autoscaling)**: Uses events and triggers to scale resources, including scaling to zero, which is excellent for cost savings.

There are also different scaling strategies:

- **Reactive Autoscaling**: Triggers based on metrics like CPU usage.
- **Scheduled Autoscaling**: Plans for predictable loads (e.g., end-of-month batch jobs).
- **Predictive Autoscaling**: Uses AI/ML to anticipate scaling needs.

## Community and Governance

The **Cloud Native Computing Foundation (CNCF)** is built around an open community that fosters collaboration and innovation in cloud-native technologies, with projects like Kubernetes, Envoy, and Prometheus. CNCF’s mission is to make cloud computing ubiquitous, and it does so by guiding projects through different maturity phases: **Sandbox**, **Incubating**, and **Graduated**. These stages reflect the project’s growth and adoption within the community.

- **Sandbox**: Early stage projects for experimentation.
- **Incubating**: More developed projects with growing adoption.
- **Graduated**: Mature projects with broad adoption, meeting rigorous requirements such as security, performance, and reliability.

A project’s transition from one phase to another is influenced by its adoption, security, functional maturity, and meeting user needs. The journey from incubating to graduated involves proving the project’s ability to serve pragmatic users and early adopters. The final stage sees it adopted by late majority users and laggards, marking broad success.

### CNCF Maturity Model

```mermaid
graph TD
    A[CNCF Maturity Model] --> B[Sandbox]
    A --> C[Incubating]
    A --> D[Graduated]

    B -->|Projects| E[Virtual Kubelet]
    B -->|Projects| F[ContainerSSH]

    C -->|Projects| G[Knative]
    C -->|Projects| H[OpenTelemetry]

    D -->|Projects| I[Kubernetes]
    D -->|Projects| J[Prometheus]
```

CNCF uses its maturity model to signal a project's reliability and sustainability to enterprises. Key factors include:

- Broad adoption across multiple organizations.
- A healthy rate of contributions and changes.
- Compliance with the CNCF Code of Conduct.
- Maintenance of the Core Infrastructure Initiative’s Best Practices Badge.

### Conflict Resolution and Voting

When there is a disagreement within the CNCF community, discussions and debates help refine proposals. If consensus cannot be reached, the CNCF uses elections and voting as a conflict resolution mechanism. This democratic process helps resolve differences and advance the community's goals.

## Serverless

```mermaid

graph TD
    Client[Client] -->|Trigger Event| Event[Event]

    subgraph Serverless Architecture
        Event --> FaaS[AWS Lambda / Knative / OpenFaaS / ...]

        FaaS --> Function[Function Code]
        Function -->|Accesses| DB[(Database)]

        FaaS --> API[API Gateway]
        API -->|Triggers| OtherServices[Other Services]
    end
```

Despite its name, **serverless** still involves servers, but the infrastructure management is handled by the cloud provider, shifting the responsibility away from users. Serverless architecture is event-driven, meaning that code is executed in response to events, and billing follows usage—potentially scaling up to meet demand or scaling down to zero when idle.

**Function as a Service (FaaS)**, such as **AWS Lambda**, is a typical example. In the cloud-native world, Kubernetes-based serverless solutions like **Knative** and **OpenFaaS** provide similar scalability and flexibility, automatically adjusting resources as needed.

### CloudEvents Specification

CNCF also hosts **CloudEvents**, which standardizes how event data is described and transferred across systems. It provides SDKs for various languages and specifications for protocols like HTTP, Kafka, and NATS.

## Personas in Cloud-Native Ecosystem

Cloud-native best practices and processes rely on a variety of professional roles, each specializing in different areas. These roles are essential for implementing, maintaining, and securing cloud-native architectures:

- **DevOps Engineer**: Combines development and operational skills, driving automation, infrastructure management, and cloud-native best practices.
- **Site Reliability Engineer (SRE)**: Focuses on availability, scalability, and robustness, ensuring systems meet **Service Level Agreements (SLA)**, **Objectives (SLO)**, and **Indicators (SLI)**.
- **CloudOps Engineer**: More focused on deploying and managing cloud services compared to DevOps.
- **Security Engineer**: Specialized in IT security, ensuring protection against external threats.
- **DevSecOps Engineer**: Merges security expertise with DevOps to incorporate security into every stage of the development lifecycle.
- **Full-Stack Developer**: Develops both frontend and backend systems, a generalist across technologies.
- **Cloud Architect**: Designs cloud-native applications, making decisions on platforms, tools, and interoperability.
- **Data Engineer**: Builds and maintains data processing systems, ensuring scalability and compliance.

## Open Standards

Open standards are foundational in cloud-native environments, promoting interoperability and innovation. CNCF supports several important open standards:

- **Open Container Initiative (OCI)**: Establishes open standards for container runtimes and images. Tools like Docker, BuildKit, and Podman comply with these specifications, ensuring compatibility across different environments.
- **Container Network Interface (CNI)**: Standard for managing container networking.
- **Container Storage Interface (CSI)**: Provides a standard for interacting with storage solutions.
- **Container Runtime Interface (CRI)**: Allows Kubernetes to interface with various container runtimes, such as **containerd** and **CRI-O**.
- **Service Mesh Interface (SMI)**: Standardizes service mesh implementations, providing consistent interfaces across different tools.

## CNCF Terminology

- **TOC**: Technical Oversight Committee that provides governance over CNCF projects.
- **SIG**: Special Interest Groups focus on specific areas of cloud-native technology.
- **TAG**: Technical Advisory Groups provide expertise in areas like storage, security, and observability, helping projects progress from Sandbox to Graduation.

These roles, processes, and standards ensure the CNCF ecosystem continues to evolve and adapt, driving cloud-native innovation across a broad range of technologies and industries.
