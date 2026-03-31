---
lang: pt-br
layout: post
title: "Recuperando dados da Sessão nos eventos do Global.asax"
date: 2012-10-02
categories: [coding]
tags: [log, sessão]
permalink: /coding/2012/10/02/retrieving-session-data-in-globalasax-events/
---

É muito útil utilizar o evento `Application_Error` do `Global.asax` para gravar logs das exceções inesperadas que temos em nossa aplicação. Isso pode ser feito reescrevendo o método `Application_Error` como o código a seguir:

```csharp
void Application_Error(object sender, EventArgs e)
{
  // Get the exception object
  Exception exc = Server.GetLastError();

  // For other kinds of errors give the user some information
  // but stay on the default page
  Response.Write("<h2>Global Page Error</h2>\n");
  Response.Write("<p>" + exc.Message + "</p>\n");
  Response.Write("Return to the <a href='Default.aspx'>" + "Default Page</a>\n");

  // Log the exception and notify system operators
  ExceptionUtility.LogException(exc, "DefaultPage");
  ExceptionUtility.NotifySystemOps(exc);

  // Clear the error from the server
  Server.ClearError();
}
```

Porém em algumas situações é interessante recuperarmos dados da `Session` para apresentar mais detalhes sobre, por exemplo, o usuário autenticado. Se simplesmente chamarmos a sessão a partir desse método (`Application_Error`) podemos, em algumas ocasiões, ter a seguinte exceção:

![Erro de estado de sessão](/assets/images/retrieving-session-data-in-globalasax-events/image_thumb1.png)

> "Estado da Sessão não está disponível neste contexto"

Isso acontece pois o tipo de requisição HTTP atual não está relacionado ao estado da sessão, ou seja, você não consegue acesso a ela dentro do contexto da requisição.

Para resolver isso podemos "envolver" o acesso à sessão com o seguinte código:

```csharp
if (Context.Handler is IRequiresSessionState || Context.Handler is IReadOnlySessionState) {….}
```

Dessa forma ao recuperarmos os dados da sessão teremos certeza que o "estado da sessão" estará disponível.

**Referências:**

- [MSDN – HttpContext.Handler](http://msdn.microsoft.com/en-us/library/w16865z6(v=vs.100).aspx)
- [Session State Unavailable in Global.asax](http://blog.aggregatedintelligence.com/2009/12/session-state-unavailable-in-globalasax.html)
