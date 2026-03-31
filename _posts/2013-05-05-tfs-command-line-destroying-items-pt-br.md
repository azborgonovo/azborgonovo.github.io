---
lang: pt-br
layout: post
title: "[TFS – Command-line] – Destruindo elementos"
date: 2013-05-05
categories: [coding]
tags: [command-line, tfs]
permalink: /coding/2013/05/05/tfs-command-line-destroying-items.html
---

Olá pessoal!

Essa semana precisei remover um determinado arquivo do meu TFS, infelizmente tive alguns problemas e não consegui executar essa ação através do Source Control Explorer. Para sanar o problema acabei utilizando mais um comando via prompt: `tf destroy`. O objetivo desse comando é remover permanentemente um arquivo ou pasta de seu controle de versão.

Abaixo uma imagem com a execução do comando `tf destroy`:

![Executando tf destroy](/assets/images/tfs-command-line-destroying-items/destroy.png)

Abaixo uma breve explicação sobre cada parâmetro:

![Parâmetros do tf destroy](/assets/images/tfs-command-line-destroying-items/info.png)

Basicamente é isso, espero que tenha entendido!

Para mais informações acesse: [http://bit.ly/TFDestroy](http://bit.ly/TFDestroy)

Abraço e até breve!
