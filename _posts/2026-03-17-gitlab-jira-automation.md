---
lang: en
layout: post
title: "GitLab → Jira Automation: Linking Push Events to Issues"
date: 2026-03-17
categories: [general]
tags: [gitlab, jira, automation, devops, webhook]
---

I recently needed to automatically tag Jira issues with the GitLab repository that generated activity on them. The idea is simple: whenever a developer pushes code that references a Jira issue — either in the branch name or a commit message — the corresponding issue should get a label identifying which repository the work came from. One webhook, zero manual linking.

This post documents the approach that is actually running in production, including the edge cases I had to work through.

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

Extract every Jira issue key from `candidateText`. Adjust the project key prefix (`PROJ`) to match your Jira project:

```
{{ candidateText.match("((?:PROJ)-\d+)") }}
```

### Variable: `gitlabProject`

Normalize the repository name into a safe label value — lowercase, hyphens only, no leading or trailing hyphens:

```
{{webhookData.project.name.trim().toLowerCase().replaceAll("[^a-z0-9]+","-").replaceAll("^-+|-+$","")}}
```

For a repository named `My Service API` this produces `my-service-api`. The label stays consistent regardless of how the project name is capitalized in GitLab.

### Second IF: skip when no issue key was found

```
{{issueKeys}} does not equal Empty
```

Everything below this condition only runs when at least one issue key was matched.

Add a **Log** action here while testing — it makes debugging much easier:

```
Project {{gitlabProject}} will be added to {{issueKeys}}
```

![Jira Automation rule showing variable setup and IF conditions](/assets/images/gitlab-jira-automation-1.jpeg)

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

![Jira Automation branch rule with edit work item action](/assets/images/gitlab-jira-automation-2.jpeg)

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

With this setup one webhook handles all push events across repositories. Jira issues automatically accumulate labels showing which GitLab projects have touched them, making it easy to trace cross-repository work in dashboards and JQL queries. The normalization step keeps labels clean regardless of how projects happen to be named in GitLab.
