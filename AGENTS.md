# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Repository Overview

This is a personal Jekyll website hosted on GitHub Pages at [azborgonovo.github.io](https://azborgonovo.github.io). It is bilingual (English and Portuguese BR) using [jekyll-polyglot](https://github.com/untra/polyglot).

## Project Structure

```
.
├── _config.yml              # Site configuration and polyglot settings
├── _includes/
│   ├── header.html          # Sticky header with language toggle
│   └── footer.html          # Footer with social links
├── _layouts/
│   ├── default.html         # Base HTML document shell
│   ├── home.html            # Home page layout (hero + grid + sidebar)
│   ├── page.html            # Generic content page layout
│   └── post.html            # Blog post layout
├── _posts/                  # All blog posts (EN and PT-BR)
├── assets/css/style.scss    # All styles (GitHub dark theme)
├── index.md                 # English home page
├── posts.md                 # English blog listing
└── pt-br/
    ├── index.md             # Portuguese home page
    └── posts.md             # Portuguese blog listing
```

## Key Conventions

### Bilingual Setup (jekyll-polyglot)

- `parallel_localization: false` is **required** — parallel forks share the memoized `@url` on `Jekyll::Page` before `site.active_lang` is injected into the Liquid payload, causing incorrect language detection.
- Both `index.md` and `pt-br/index.md` must carry `permalink: /` — this gives them the same `page_id` so polyglot correctly excludes the EN fallback during the PT-BR build pass.
- All posts (EN and PT-BR) live in the root `_posts/` directory with a `lang:` front matter key (`en` or `pt-br`). Do **not** put posts in `pt-br/_posts/` — that would produce double-prefix URLs like `/pt-br/pt-br/geral/…`.
- Use `{% if site.active_lang == 'pt-br' %}` in layouts/includes to switch text between languages.
- Post listings filter by `post.lang` to show only the relevant language's posts.

### Front Matter Requirements

**Posts** must include:
```yaml
---
lang: en          # or pt-br
layout: post
title: "Your Post Title"
date: YYYY-MM-DD
categories: [category]
tags: [tag1, tag2]
---
```

**PT-BR pages** in `pt-br/` must include `lang: pt-br` and `permalink:` matching their EN counterpart.

### Styles

All CSS lives in `assets/css/style.scss`. The colour palette uses Jekyll/SCSS variables defined at the top of the file. Add new styles there; avoid inline styles except for minor one-off overrides in page content.

## Build & Test

```bash
# Install dependencies
bundle install

# Build the site
bundle exec jekyll build

# Serve locally (rebuilds on change)
bundle exec jekyll serve

# View at http://localhost:4000
```

No automated test suite exists. Validate changes by running a local build and checking that:
1. `_site/index.html` — EN home renders correctly.
2. `_site/pt-br/index.html` — PT-BR home renders in Portuguese.
3. `_site/posts/index.html` — EN posts list shows only EN posts.
4. `_site/pt-br/posts/index.html` — PT-BR posts list shows only PT-BR posts.
5. Language toggle in the header links to the correct counterpart page.

## Adding Content

### New English blog post

Create `_posts/YYYY-MM-DD-slug.md` with `lang: en`.

### New Portuguese blog post

Create `_posts/YYYY-MM-DD-slug-pt-br.md` with `lang: pt-br` (same date, different slug convention).

### New page

- English: create `page-name.md` at the root with `lang: en`.
- Portuguese: create `pt-br/page-name.md` with `lang: pt-br` and the same `permalink:` value as the English counterpart (without the `/pt-br/` prefix — polyglot handles prefixing for non-default languages).
- Add the new page link to `_includes/header.html` under both the `pt-br` and `else` nav sections.
