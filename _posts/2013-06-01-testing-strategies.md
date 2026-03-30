---
lang: en
layout: post
title: "Testing Strategies"
date: 2013-06-01
categories: [ALM, Best Practices]
tags: [testing]
---

Today I was browsing through an ALM Rangers guide called [Better Unit Testing with Microsoft Fakes](http://vsartesttoolingguide.codeplex.com/releases/view/102290), which covers the use of Microsoft Fakes for testing in Visual Studio 2012.

On page 10 I found a simple but very interesting table that describes testing strategies and the Visual Studio tools available for each of them.

I decided to do a loose translation of the table to help Brazilian readers, and I'm sharing the translated version here.

| Strategy | Description | Tool |
|---|---|---|
| Exploratory Testing | The tester tries to think of possible scenarios not covered by other tests or testing strategies. Useful when users are involved in testing and are observed in their (expected) use of the system. No predefined tests. | Exploratory testing with Microsoft Test Manager (MTM) |
| Integration Testing | Testing different components of the solution working together as a whole. | Visual Studio Unit Test features |
| Load Testing | Testing a system under load, in a controlled environment. | Visual Studio Load Test Agent |
| Regression Testing | Regression tests ensure the system still has the same quality after changes such as bug fixes. Uses a mix of unit and system tests. | Automated testing with MTM |
| Smoke Testing | Smoke tests are used to test new features or ideas before committing code changes. | — |
| System Testing | Testing the expected functionality and non-functional requirements of the entire system. | Visual Studio Lab Management |
| Unit Testing | A test of the smallest unit of code (method / class, etc.) that can be tested in isolation from other units. | Visual Studio Test Explorer / Unit Test Frameworks |
| User Acceptance Testing | Near the end of each product cycle, users are invited to perform acceptance testing in a production-like scenario, typically based on test cases. | Automated testing with MTM |

Hope it helps. Cheers!
