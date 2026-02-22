---
layout: page
title: Publicações
permalink: /posts/
lang: pt-br
---

<section class="section">
  <p class="tagline" style="color: #8b949e;">Artigos, tutoriais e reflexões sobre engenharia de software.</p>
</section>

## Todos os Posts

<ul class="post-list">
{% for post in site.posts %}
  {% if post.lang == 'pt-br' %}
  <li class="card" style="margin-bottom: 1rem;">
    <span class="card-meta">{{ post.date | date: "%d/%m/%Y" }}</span>
    <h4 style="margin: 0.5rem 0;"><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h4>
    {% if post.excerpt %}
    <p style="margin: 0.5rem 0; font-size: 0.9rem; color: #8b949e;">{{ post.excerpt | strip_html | truncate: 160 }}</p>
    {% endif %}
    {% if post.categories.size > 0 %}
    <div style="margin-top: 0.5rem;">
      {% for cat in post.categories %}
      {% unless site.languages contains cat %}
      <span class="badge" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">{{ cat }}</span>
      {% endunless %}
      {% endfor %}
    </div>
    {% endif %}
  </li>
  {% endif %}
{% endfor %}
</ul>
