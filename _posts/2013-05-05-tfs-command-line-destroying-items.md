---
lang: en
layout: post
title: "[TFS – Command-line] – Destroying Items"
date: 2013-05-05
categories: [coding]
tags: [command-line, tfs]
---

Hello everyone!

This week I needed to remove a specific file from my TFS repository. Unfortunately I ran into some issues and couldn't perform that action through Source Control Explorer. To work around it, I ended up using another command-line tool: `tf destroy`. The purpose of this command is to permanently remove a file or folder from your version control.

Below is an image showing the execution of the `tf destroy` command:

![Running tf destroy](/assets/images/tfs-command-line-destroying-items/destroy.png)

And here is a brief explanation of each parameter:

![tf destroy parameters](/assets/images/tfs-command-line-destroying-items/info.png)

That's basically it — hope it was helpful!

For more information, check: [http://bit.ly/TFDestroy](http://bit.ly/TFDestroy)

Cheers!
