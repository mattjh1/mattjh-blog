---
title: "gRAG Introduction"
date: "2024-12-09"
description: ""
tags:
  - gRAG
  - project
  - AI
  - ETL
  - FastAPI
  - Chainlit
  - LangChain
categories:
  - PoC
  - Project
  - OSS
---

A few months ago, I found myself diving into a side project that I called _gRAG_, an attempt at building my own version of a Retrieval-Augmented Generation (RAG) system. What set it apart was my decision to experiment with a graph database, aiming to harness its unique strengths to push RAG systems a bit further. It wasn’t a brand-new idea by any means, but more of a way for me to explore how the power of graphs could complement and enhance the RAG framework.

<!--more-->

The project revolves around building a pipeline to transform unstructured data into a structured format stored in a Neo4j graph database, and, of course, implementing the RAG workflow itself. Everything is designed to explore how graph databases can enhance retrieval in ways that traditional methods can’t.

If you’re curious, the full project is available on my [GitHub](https://github.com/mattjh1/gRAG). It’s all there—ready for you to explore, tweak, and make your own.

## Background: How gRAG Came to Life

The idea for gRAG took root during my work on an internal project at my employer. I was lucky enough to collaborate with a talented team of engineers on a proof of concept for a RAG system designed to make life easier for developers—all while preserving data integrity.

We experimented with:

- **Self-hosted, open-source LLMs**: Exploring lightweight, private setups for developer use cases.
- **Hybrid search techniques**: Combining vector and keyword search to improve retrieval accuracy.
- **Prompt optimization and model fine-tuning**: Tailoring outputs to meet our needs.

The project was a success and even created some buzz within the company. But, like all good things, it eventually wrapped up. While we accomplished a lot, there were still many unexplored areas I was itching to dive into. One of those areas was the use of **graph databases in RAG**—a concept that stuck with me and eventually became the centerpiece of gRAG.

## RAG Basics

To understand what sets gRAG apart, let’s first look at a typical RAG setup.

At its core, a RAG system retrieves relevant information from a dataset and uses it to ground LLM responses, preventing hallucinations and ensuring factual accuracy. Most implementations are built around:

- A **vector store**: Where embeddings are stored.
- A **retrieval mechanism**: For finding relevant embeddings during queries.

This basic setup works well for many scenarios, but it can fall short in more complex use cases. That’s where hybrid search comes in—combining vector search with keyword search to improve results by ranking matches from both methods.

## Why Graph Databases?

Now, let’s talk about the special sauce: using a graph database for RAG.

Graph databases, like Neo4j, offer something unique—they represent relationships between data points explicitly. This makes them a natural fit for RAG setups where context and connections between entities (e.g., documents, topics, authors) are crucial for improving retrieval.

What makes Neo4j particularly powerful is its ability to combine:

1. **Semantic similarity** (via vector embeddings).
2. **Full-text indexing** (traditional keyword search).
3. **Graph-based retrieval** (leveraging relationships).

This triple threat allows us to create a hybrid search retriever and add a layer of relationship-driven context on top—a setup that’s as robust as it is versatile.

If you’re curious about Neo4j’s work in the GenAI space, their [developer blog](https://neo4j.com/developer-blog/) is a goldmine of ideas and inspiration. Their advancements were a huge influence on gRAG’s design.

## Tech Stack Overview

To bring gRAG to life, I orchestrated a set of containers using Docker Compose. Here’s the lineup:

- **Neo4j**: The main database, handling vector storage, full-text indexing, and graph queries.
- **Tika**: A data parser that extracts text from virtually any file format.
- **FastAPI**: The app container, running logic powered by the LangChain framework.
- **Redis**: An optional database for creating a basic vector store during the ingestion process.

I chose not to include a self-hosted LLM container for one reason: performance. While I typically use Ollama for embedding generation (`nomic-embed-text:latest`), its container version doesn’t support Apple Silicon GPU acceleration. For responses and heavy lifting, I opted for OpenRouter, which provides access to a range of high-quality models.

## Whats next?

This post started off with the information here and a bunch more, but it grew into a behemoth. So naturally I decided it was best to refactor it, and it turned into multiple posts. I invite you to read further about the gRAG [ingestion pipeline](../grag-ingestion) and [application](../grag-app).
