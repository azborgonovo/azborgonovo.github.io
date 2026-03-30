---
lang: pt-br
layout: post
title: "[TFS – Command-line] – Removendo Team Project"
date: 2013-05-03
categories: [coding]
tags: [command-line, TFS]
---

Olá pessoal!

Há algum tempo, assim que comecei a utilizar o TFService (na época ainda era apenas TFSPreview), me deparei com a seguinte questão: "Como removo um Team Project na nuvem?". Para quem não sabe, o Team Foundation Service ainda não possui um botão para remover um team project, logo temos que apelar para a linha de comando.

Na imagem abaixo algumas informações relacionadas aos parâmetros do comando `TFSDeleteProject`. Para visualizar essas informações basta digitar `TFSDeleteProject.exe`:

![Parâmetros do TFSDeleteProject](/assets/images/tfs-command-line-removing-team-project/informacoes.png)

E aqui temos o comando executado para excluir o team project:

![Executando o TFSDeleteProject](/assets/images/tfs-command-line-removing-team-project/comando1.png)

```
TFSDeleteProject /q /force /collection:TeamProjectCollection/ TeamProject
```

Simples, não?!

Para mais informações acesse a biblioteca da Microsoft: [http://bit.ly/TFSDeleteProject](http://bit.ly/TFSDeleteProject)

Abraço e até breve!
