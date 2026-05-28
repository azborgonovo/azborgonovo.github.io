---
lang: en
layout: post
title: "AWS Summit Amsterdam 2026"
date: 2026-05-27
categories: [general]
tags: [aws, cloud, conference, amazon-q, kiro, gameday]
---

Last Wednesday I joined the AWS Summit in Amsterdam and I enjoyed it even more than last time.

## First impressions

The expo floor felt noticeably less crowded than last year. With fewer stands we had more space to walk around and connect with partners. It was also great to see AWS running Diversity & Inclusion and Donation-related initiatives (e.g. attendees could join an "assembly line" to prepare Bluetooth educational kits to teach socially vulnerable kids about electronics).

## Keynote

The AWS General Manager for the Benelux region put the European angle front and center: The Netherlands and Belgium were highlighted as performing well among EU peers, and the expected AI impact on European GDP was highlighted.

On the product side, the keynote spotlighted:
- [Amazon Quick](https://aws.amazon.com/quick/) — an AI assistant for work that brings together tools and knowledge grounding answers in real business data and having agency to act on your behalf
- [AWS Transform custom](https://aws.amazon.com/transform/custom/) — tech modernization through agentic AI that automates custom code transformations
- [Kiro](https://kiro.dev/) — AWS's take on spec-driven development, which got a lot of stage time and many mentions during sessions afterwards
- [AWS Lambda Durable Functions](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html) — build resilient multi-step applications and AI workflows that can execute for up to one year while maintaining reliable progress despite interruptions
- [Amazon Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/) — handles the heavy lifting so you can get agents to market faster and at scale

AWS wants to be "the best place to build" and frames this in three pillars: **Infrastructure, Data, Inference**.

## AWS GameDay: Secret Agentic Unicorns

The GameDay presented participants with the following role-play scenario: you are a new hire at Unicorn.Rentals, the world's largest mythical creature rental company. Your job? Complete a series of AWS challenges to earn points.

I teamed up with Sajad, Yashwanth and Dhananjai. We started lightly, but as soon as we achieved first place in the scoreboard, we didn't want to let it go. Closer to the end a competing team pushed us to second place. Only 2 minutes before the finish line, we regained our position and walked away with first place.

It was a fun way to try out Kiro, practice prompt engineering, operating AgentCore, and of course, play as a team.

![1st Place trophy from AWS GameDay at AWS Summit Amsterdam 2026](/assets/images/aws-summit-amsterdam-2026/gameday-trophy.jpg)

## Intelligently Automating Cloud Operations

The afternoon workshop brought things back to best practices in Cloud operations. The session walked through connecting multiple AWS data sources via S3 buckets and creating a space in Amazon Quick and enabling an interactive chat agent to query real business data on the fly.

Topics covered included [AWS Health](https://docs.aws.amazon.com/health/), [Trusted Advisor](https://aws.amazon.com/premiumsupport/technology/trusted-advisor/), [Amazon EventBridge](https://aws.amazon.com/eventbridge/), [AWS Lambda](https://aws.amazon.com/pm/lambda/), and GenAI/ML for cloud ops automation.

While trying those tools I learned that Amazon Quick uses [GraphRAG](https://aws.amazon.com/blogs/machine-learning/build-graphrag-applications-using-amazon-bedrock-knowledge-bases/) under the hood. It looked like a promising technique worth keeping an eye on for anyone building AI-powered user experiences.

## Recommendation forward

Let me take the chance to share a colleague's recommendation that was definitely useful to me: **prioritize hands-on sessions**. The GameDay and the workshop gave me far more than the sessions where I was just watching. Participating in events like these always fires up my engineering core. Looking forward to the next one! 
