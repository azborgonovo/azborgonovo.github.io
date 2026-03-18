---
lang: en
layout: post
title: "GitLab → Jira: Linking Repositories to Work items"
date: 2026-03-17
categories: [general]
tags: [gitlab, jira, automation, devops, webhook]
---

Jira and GitLab have a native automation that allows users to visualize commits, pull request, builds and deployment information directly from the Jira UI. However, the native automation does not offer any means to allow users to query all work items that have been referenced from a given GitLab project/repository.

This article demonstrates how to enable Jira users create JQL queries like the following.

`project = PROJ AND "GitLab Projects[Labels]" = my-service`

## Overview

**GitLab (Push events)** → **Jira Automation (Incoming webhook)**

The flow:
1. A developer pushes to any branch in GitLab
2. GitLab fires a Push event webhook to Jira
3. Jira Automation extracts the repository name and any Jira issue keys from the event
4. The matching issues get a label like `my-service` added to the **GitLab Projects** custom field

## Step 1 - Jira: Create a custom label field

1. Go to **Jira settings → Issues → Custom fields**
2. Click **Create custom field**
3. Select **Labels** (multi-value field)
4. Name it: **GitLab Projects**
5. Add it to the relevant screens (Create / Edit / View)

> **Why labels?** They allow multiple projects per issue, are searchable, and compose well in dashboards and JQL queries.

## Step 2 - Jira: Create the Automation rule

1. Go to your project → **Project settings → Automation**
2. Click **Create rule**
3. Trigger: **Incoming webhook**
4. Work items: **No work items from the webhook**

Jira generates a **Webhook URL** and a **Secret** — keep both handy for Step 4.

## Step 3 - Jira: Build the automation logic

This is where the real work happens. The automation uses variables to extract the issue key and normalize the project name before touching any Jira issues.

### Guard condition: only process branch pushes

Add a first **IF** condition at the top of the rule so that tag pushes and other non-branch events are skipped:

```
{{webhookData.ref}} starts with refs/heads/
```

### Variable: `candidateText`

Combine the branch ref, the top-level message (if any), and all commit messages into one string to search against:

```
{{webhookData.ref}} {{webhookData.message}} {{webhookData.commits.message.join(" ")}}
```

### Variable: `issueKeys`

Extract every Jira issue key from `candidateText`. Adjust the project key prefix (`PROJ`) to match your Jira project. You can add more more target projects by modifying the expression like `PROJ|XYZ`.

```
{{ candidateText.match("((?:PROJ)-\d+)") }}
```

### Variable: `gitlabProject`

Normalize the project name into a safe label value. The following expression transforms it into kebab-case.

```
{{webhookData.project.name.trim().toLowerCase().replaceAll("[^a-z0-9]+","-").replaceAll("^-+|-+$","")}}
```

For a project named `My Service API` this produces `my-service-api`. The label stays consistent regardless of how the project name is capitalized in GitLab.

### Second IF: skip when no issue key was found

```
{{issueKeys}} does not equal Empty
```

Everything below this condition only runs when at least one issue key was matched.

You can add a **Log** action here to facilitate troubleshooting:

```
Project {{gitlabProject}} will be added to {{issueKeys}}
```

![First part of the Jira Automation rule](/assets/images/gitlab-jira-automation-1.jpeg)

### Branch rule: find the matching issues

Add a **Branch rule** → **Related work items** with the JQL:

```
key in ({{issueKeys}})
```

Inside the branch, add another **IF** to avoid redundant updates — only edit the issue when the label isn't already there:

```
{{issue.customfield_99999}} does not contain {{gitlabProject}}
```

Replace `customfield_99999` with the actual field ID of your **GitLab Projects** custom field (find it in Jira → Custom Fields → view the field details URL).

Then add an **Edit work item** action using the **Advanced** JSON editor:

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

![Second part of the Jira Automation rule](/assets/images/gitlab-jira-automation-2.jpeg)

## Step 4 - GitLab: Configure the webhook

1. Go to your GitLab project → **Settings → Webhooks**
2. Click **Add new webhook**

### Configuration

| Field | Value |
|---|---|
| Name | Send push events to Jira |
| URL | The webhook URL from Jira Automation |
| Trigger | ✅ Push events — All branches |
| Custom header name | `X-Automation-Webhook-Token` |
| Custom header value | The secret from Jira Automation |

## Step 5 - Test it

### Branch name contains an issue key

1. Create and push a branch: `feature/PROJ-123-add-login`
2. Open Jira issue `PROJ-123`
3. Check the **GitLab Projects** field — it should now contain your repository's normalized name

### Commit message contains an issue key

1. Push a commit with message: `PROJ-456 Fix null pointer on login`
2. Open Jira issue `PROJ-456` and verify the label was added

## Summary

With this setup one webhook handles all push events across repositories. Jira issues automatically accumulate labels showing which GitLab projects have referenced them, making it easy to trace cross-repository work in dashboards and JQL queries.
