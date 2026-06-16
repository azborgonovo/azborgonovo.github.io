---
lang: pt-br
layout: post
title: "Aprendendo Dev Containers"
date: 2026-06-16
categories: [coding]
tags: [devcontainers, docker, desenvolvimento, ferramentas]
permalink: /coding/2026/06/16/learning-dev-containers/
---

Recentemente comecei a trabalhar em um projeto que usa [DevContainers](https://containers.dev/). Para me preparar para o uso e suporte à infraestrutura de desenvolvimento, busquei material de aprendizado online e acabei no canal do YouTube do Visual Studio Code. Compartilho aqui uma breve referência para outros que também estão iniciando uso de DevContainers.

## O que são Development Containers?

Um development container (ou dev container) permite usar um container como um ambiente de desenvolvimento completo. Ele pode ser utilizado para executar uma aplicação, para separar ferramentas, bibliotecas ou runtimes necessários para trabalhar em uma base de código.

A configuração é definida em um arquivo `devcontainer.json` que fica no repositório, então qualquer pessoa que abrir o projeto terá exatamente o mesmo ambiente — versão correta da linguagem, extensões e ferramentas — sem precisar configurar nada manualmente na máquina local.

## Aprendendo com o time do VS Code

Uma [playlist completa sobre DevContainers](https://www.youtube.com/playlist?list=PLj6YeMhvp2S6GjVyDHTPp8tLOR0xLGLYb) está disponível no canal do VS Code.

Os vídeos abaixo, nessa ordem, oferecem uma introdução rápida, atualizada e abrangente aos Dev Containers:

- [Get Started with Dev Containers in VS Code](https://www.youtube.com/watch?v=b1RavPr_878)
- [Different Ways to Run Dev Containers: VS Code vs CLI](https://www.youtube.com/watch?v=Fc6TAahZ1Pk)
- [Customize Dev Containers in VS Code with Dockerfiles and Docker Compose](https://www.youtube.com/watch?v=p9L7YFqHGk4)
- [Working with Multiple Dev Containers in VS Code](https://www.youtube.com/watch?v=bVmczgfeR5Y)
- [Dev Container Features & Lifecycle Hooks](https://www.youtube.com/watch?v=iCopdmuabBM)
- [Run Your AI Coding Agent in Dev Containers - Complete Beginner's Guide](https://www.youtube.com/watch?v=w3kI6XlZXZQ)

## Primeiras impressões

Dev containers resolvem um problema real para desenvolvedores: um ambiente reproduzível e consistente para todos os membros do time, mantendo a máquina local de cada pessoa limpa ao trabalhar em projetos diferentes.

O que mais chamou atenção foi como eles funcionam naturalmente com o [GitHub Codespaces](https://github.com/features/codespaces). Abrir um repositório em um Codespace inicializa o dev container na nuvem com um ambiente de desenvolvimento totalmente configurado, rodando no browser.

Começar com novas ferramentas sempre traz algum atrito, mas quando o valor é concreto, a familiaridade vem com facilidade.
