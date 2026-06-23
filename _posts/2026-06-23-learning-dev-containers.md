---
lang: en
layout: post
title: "Learning Dev Containers"
date: 2026-06-23
categories: [coding]
tags: [devcontainers, docker, development, tooling]
---

I recently started working on a project that uses [DevContainers](https://containers.dev/). To get myself ready to use and support the development infrastructure, I searched for some learning material online and ended up on the Visual Studio Code YouTube channel. I'm sharing it here as a brief reference for others who are also just getting started with Dev Containers.

## What are Development Containers?

A development container (or dev container for short) allows you to use a container as a full-featured development environment. It can be used to run an application, to separate tools, libraries, or runtimes needed for working with a codebase.

The setup is defined in a `devcontainer.json` file that lives in the repository, so anyone who opens the project gets the exact same environment — right language version, extensions, and tooling — without manual configuration on their local machine.

## Learning with the VS Code team

A comprehensive [playlist about DevContainers](https://www.youtube.com/playlist?list=PLj6YeMhvp2S6GjVyDHTPp8tLOR0xLGLYb) is available on the VS Code channel.

I found that the following videos, in order, offer a quick, up-to-date, and thorough introduction to Dev Containers:

- [Get Started with Dev Containers in VS Code](https://www.youtube.com/watch?v=b1RavPr_878)
- [Different Ways to Run Dev Containers: VS Code vs CLI](https://www.youtube.com/watch?v=Fc6TAahZ1Pk)
- [Customize Dev Containers in VS Code with Dockerfiles and Docker Compose](https://www.youtube.com/watch?v=p9L7YFqHGk4)
- [Working with Multiple Dev Containers in VS Code](https://www.youtube.com/watch?v=bVmczgfeR5Y)
- [Dev Container Features & Lifecycle Hooks](https://www.youtube.com/watch?v=iCopdmuabBM)
- [Run Your AI Coding Agent in Dev Containers - Complete Beginner’s Guide](https://www.youtube.com/watch?v=w3kI6XlZXZQ)

## My first impressions

Dev containers solve a real problem for developers: a reproducible and consistent environment for every team member, while keeping each person’s local machine clean when working across diverse projects.

One thing that stood out was how naturally they work with [GitHub Codespaces](https://github.com/features/codespaces). Opening a repository in a Codespace spins up the dev container in the cloud with a fully configured development environment running in the browser.

Starting with new dev tools always introduces some friction, but when the value is concrete, familiarity comes easily.