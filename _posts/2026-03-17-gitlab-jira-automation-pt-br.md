---
lang: pt-br
layout: post
title: "GitLab → Jira: Vinculando Repositórios a Work Items"
date: 2026-03-17
categories: [geral]
tags: [gitlab, jira, automacao, devops, webhook]
---

A integração nativa entre Jira e GitLab possibilita accesso à commits, branches e deploys dentro de um work item do Jira. O que ela não oferece é o contrário: *dado um projeto GitLab, quais issues do Jira ele já referenciou?* Este post apresenta uma solução para conectar um webhook do GitLab ao Jira Automation, marcar as issues referenciadas com um label identificando o repositório.

O resultado final é uma JQL como esta:

`project = PROJ AND "GitLab Projects[Labels]" = my-service`

## Visão geral

**GitLab (Push events)** → **Jira Automation (Incoming webhook)**

O fluxo:
1. Um desenvolvedor faz push em qualquer branch do GitLab
2. O GitLab dispara um webhook de Push event para o Jira
3. O Jira Automation extrai o nome do projeto e quaisquer chaves de issue do Jira presentes no evento
4. As issues encontradas recebem um label como `my-service` adicionado ao campo personalizado **GitLab Projects**

## Requisitos

- **Jira Cloud Premium ou superior** — o Jira Automation é necessário (não disponível nos planos Free/Standard)
- **Permissões de admin no Jira** para criar campos personalizados e adicioná-los às telas
- **Papel de Maintainer ou Owner no projeto GitLab** para configurar webhooks

## Passo 1 - Jira: Criar um campo de label personalizado

1. Vá em **Jira settings → Issues → Custom fields**
2. Clique em **Create custom field**
3. Selecione **Labels** (campo multi-valor)
4. Nomeie como **GitLab Projects**
5. Configure o **contexto**: o assistente perguntará a quais projetos e tipos de issue o campo se aplica. Escolha **All projects** para um contexto global, ou selecione projetos específicos para manter o campo com escopo restrito
6. Adicione-o às telas relevantes (Create / Edit / View)

> **Por que labels?** Elas permitem múltiplos projetos por issue, são pesquisáveis e funcionam bem em dashboards e consultas JQL.

## Passo 2 - Jira: Criar a regra de Automation

1. Vá ao seu projeto → **Project settings → Automation**
2. Clique em **Create rule**
3. Trigger: **Incoming webhook**
4. Work items: **No work items from the webhook**

Guarde a **Webhook URL** e o **Secret** gerados pelo Jira para o Passo 4.

## Passo 3 - Jira: Construir a lógica de automação

A automação usa variáveis para extrair a chave da issue e normalizar o nome do projeto antes de alterar qualquer issue.

Para cada variável abaixo, adicione uma ação **Create variable** na regra, defina o nome da variável conforme indicado e cole a expressão como valor.

### Condição de guarda: processar apenas pushes em branches

Adicione uma condição **IF** no início da regra para ignorar pushes de tags e outros eventos que não sejam de branch:

```
{{webhookData.ref}} starts with refs/heads/
```

### Variável: `candidateText`

Combina o ref do branch, a mensagem de nível superior (se houver) e todas as mensagens de commit em uma única string para pesquisa:

```
{{webhookData.ref}} {{webhookData.message}} {{webhookData.commits.message.join(" ")}}
```

### Variável: `issueKeys`

Extrai todas as chaves de issue do Jira presentes em `candidateText`. Ajuste o prefixo do projeto (`PROJ`) para corresponder ao seu projeto no Jira. Você pode incluir projetos adicionais mudando a expressão, por exemplo `PROJ|XYZ`.

```
{{ candidateText.match("((?:PROJ)-\d+)") }}
```

### Variável: `gitlabProject`

Normaliza o nome do projeto em um valor de label seguro. A expressão abaixo transforma o nome em kebab-case.

```
{{webhookData.project.name.trim().toLowerCase().replaceAll("[^a-z0-9]+","-").replaceAll("^-+|-+$","")}}
```

Para um projeto chamado `My Service API`, o resultado é `my-service-api`. O label permanece consistente independentemente de como o nome do projeto está capitalizado no GitLab.

### Segundo IF: ignorar quando nenhuma chave de issue for encontrada

```
{{issueKeys}} does not equal Empty
```

Tudo abaixo dessa condição só é executado quando ao menos uma chave de issue foi encontrada.

Você pode adicionar uma ação **Log** aqui para facilitar troubleshooting:

```
Project {{gitlabProject}} will be added to {{issueKeys}}
```

![Primeira parte da regra de Automation no Jira](/assets/images/gitlab-jira-automation-1.jpeg)

### Branch rule: encontrar as issues correspondentes

Adicione uma **Branch rule** → **Related work items** com a JQL:

```
key in ({{issueKeys}})
```

Dentro do branch, adicione outro **IF** para evitar atualizações redundantes — edite a issue somente quando o label ainda não estiver presente:

```
{{issue.customfield_99999}} does not contain {{gitlabProject}}
```

Substitua `customfield_99999` pelo ID real do seu campo personalizado **GitLab Projects**. Para encontrá-lo: vá em **Jira Settings → Issues → Custom fields**, clique no nome do campo e copie o ID numérico da URL do navegador — ele terá o formato `…customFieldId=99999`.

Em seguida, adicione uma ação **Edit work item** usando o editor JSON **Advanced**:

```json
{
  "update": {
    "GitLab Projects": [
      {
        "add": "{{gitlabProject}}"
      }
    ]
  }
}
```

![Segunda parte da regra de Automation no Jira](/assets/images/gitlab-jira-automation-2.jpeg)

## Passo 4 - GitLab: Configurar o webhook

1. Vá ao seu grupo no GitLab → **Settings → Webhooks**
2. Clique em **Add new webhook**

### Configuração

| Campo | Valor |
|---|---|
| Name | Send push events to Jira |
| URL | A webhook URL do Jira Automation |
| Trigger | ✅ Push events — All branches |
| Custom header name | `X-Automation-Webhook-Token` |
| Custom header value | O secret do Jira Automation |

## Passo 5 - Testar

### Nome do branch contém uma chave de issue

1. Crie e faça push de um branch: `feature/PROJ-123-add-login`
2. Abra a issue `PROJ-123` no Jira
3. O campo **GitLab Projects** deve agora conter o nome normalizado do seu projeto no GitLab

### Mensagem de commit contém uma chave de issue

1. Faça push de um commit com mensagem como `PROJ-456 Fix null pointer on login`
2. Abra a issue `PROJ-456` no Jira e verifique se o label foi adicionado

## Conclusão

A partir deste ponto, cada push no GitLab marca automaticamente as issues referenciadas no Jira com o nome do projeto. O campo de label `GitLab Projects` se torna um índice confiável que você pode usar em JQL, dashboards e relatórios.
