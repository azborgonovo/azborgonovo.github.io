---
lang: en
layout: post
title: "[TFS – Command-line] – Removing a Team Project"
date: 2013-05-03
categories: [coding]
tags: [command-line, TFS]
---

Hello everyone!

A while back, when I first started using TFService (back then it was still called TFSPreview), I ran into the following question: "How do I remove a Team Project in the cloud?" For those who don't know, Team Foundation Service does not yet have a UI button to delete a team project, so we have to turn to the command line.

The image below shows the parameters for the `TFSDeleteProject` command. To see this help output, simply type `TFSDeleteProject.exe`:

![TFSDeleteProject parameters](/assets/images/tfs-command-line-removing-team-project/informacoes.png)

And here is the command executed to delete the team project:

![Running TFSDeleteProject](/assets/images/tfs-command-line-removing-team-project/comando1.png)

```
TFSDeleteProject /q /force /collection:TeamProjectCollection/ TeamProject
```

Simple, right?!

For more information, check the Microsoft library: [http://bit.ly/TFSDeleteProject](http://bit.ly/TFSDeleteProject)

Cheers!
