# Personal Blog — Project Guide for Claude

## Project Overview

A server-rendered personal blog with a guest section and a password-protected admin section. Articles are stored as files on the filesystem (JSON or Markdown). No JavaScript required on the frontend; no external database.

## Architecture

- **Backend**: Any server-side language (e.g., Node.js/Express, Python/Flask, Go). Renders HTML directly from the server — not a REST API.
- **Frontend**: Plain HTML + CSS with a templating engine. No client-side JavaScript.
- **Storage**: Filesystem — one file per article in a `/articles` directory.
- **Auth**: Simple session-based login with hardcoded credentials (no database users table needed).

## Pages & Routes

### Guest Section (public)
| Route | Page | Description |
|---|---|---|
| `GET /` | Home | Lists all published articles (title + date) |
| `GET /articles/:id` | Article | Displays full article content and publication date |

### Admin Section (protected — redirect to `/login` if not authenticated)
| Route | Page | Description |
|---|---|---|
| `GET /login` | Login | Login form |
| `POST /login` | — | Validates credentials, creates session, redirects to dashboard |
| `POST /logout` | — | Destroys session, redirects to login |
| `GET /admin` | Dashboard | Lists all articles with Edit / Delete actions |
| `GET /admin/articles/new` | Add Article | Form: title, content, date |
| `POST /admin/articles` | — | Saves new article to filesystem |
| `GET /admin/articles/:id/edit` | Edit Article | Pre-filled form with existing data |
| `POST /admin/articles/:id` | — | Updates article file on filesystem |
| `POST /admin/articles/:id/delete` | — | Deletes article file |

## Article Storage Format

Each article is a single file inside `./data/articles/`. Use either:

**JSON** (`<id>.json`):
```json
{
  "id": "unique-slug-or-uuid",
  "title": "Article Title",
  "content": "Full article body text...",
  "publishedAt": "2026-03-03"
}
```

**Markdown** (`<id>.md` with front-matter):
```markdown
---
id: unique-slug
title: Article Title
publishedAt: 2026-03-03
---
Full article body text...
```

## Authentication

- Hardcode admin username and password in an environment variable or config file (never commit credentials).
- On successful login, create a server-side session cookie.
- All `/admin/*` routes must check for a valid session and redirect to `/login` otherwise.

## Key Conventions

- Keep all article files in `./data/articles/`.
- Use a slug or UUID as the article ID (also the filename).
- Dates are stored as ISO 8601 strings (`YYYY-MM-DD`).
- HTML is rendered server-side — no client-side rendering.
- No JavaScript on the frontend (forms use standard HTML POST).
- Delete and other non-GET actions are triggered via HTML forms with `POST`.

## Out of Scope (for now)

- Comments, categories, tags, search
- Database (use filesystem only)
- REST API (pages render HTML directly)
- Client-side JavaScript
