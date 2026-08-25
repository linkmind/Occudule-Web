# Articles

Drop a Markdown file in this folder to publish it at `/articles`. Newest dated articles appear first.

## Quick start

1. Copy `_template.md` and rename it, preferably as `YYYY-MM-DD-url-slug.md`.
2. Fill in the frontmatter (`title`, `description`, `date`, `author`).
3. Write the article in Markdown below the `---` block.
4. Set `draft: false` (or delete the `draft` line) when it is ready.
5. Refresh locally (`npm run dev`) or deploy to publish.

Files named `README.md` and files that start with `_` are not published.

## Frontmatter

```yaml
---
title: "Your article title"
description: "One or two sentences for search results and the article list."
date: 2026-08-24
author: Occudule
tags: parenting, email
draft: false
---
```

| Field | Required | Notes |
|-------|----------|--------|
| `title` | Recommended | Falls back to the first `# heading` or the file name. |
| `description` | Recommended | Used for SEO, the article list, and RSS. Falls back to the first paragraph. |
| `date` | Recommended | `YYYY-MM-DD`. Can also come from a `YYYY-MM-DD-` file-name prefix. |
| `author` | Optional | Shown in the byline. |
| `tags` | Optional | Comma-separated. |
| `draft` | Optional | `true` keeps the article off the site. |
| `slug` | Optional | Overrides the URL slug from the file name. |

## File names

Preferred: `2026-08-24-how-to-tame-school-email.md` → `/articles/how-to-tame-school-email`

You can also use a descriptive name such as `How to Tame School Email.md`. Spaces are converted into a URL slug.

## Images

Put images in `public/images/articles/`, then reference them from Markdown:

```md
![Classroom backpacks by the door](/images/articles/backpacks.jpg)
```

## Exporting from Google Docs or Word

Export or copy as **Markdown** (`.md`). Paste the body under the frontmatter. Avoid `.docx` or `.gdoc` files in this folder — they will not publish.
