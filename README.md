# Personal Blog

A personal blog with a public guest section for readers and a protected admin section for managing content. Built with Node.js + Express as a REST API backend and plain HTML/CSS/JS on the frontend.

**Live demo:** https://personal-blog-api-rest.onrender.com

---

## Features

### Guest Section (public)
- **Home Page** — lists all published articles with titles, dates, and excerpts
- **Article Page** — displays the full content of a single article

### Admin Section (login required)
- **Dashboard** — view all articles with options to add, edit, or delete
- **Add Article** — form with title, content, and publication date
- **Edit Article** — pre-filled form to update an existing article

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Frontend**: Static HTML + CSS + Vanilla JS (no framework)
- **Storage**: Filesystem — each article is a JSON file in `data/articles/`
- **Auth**: Session-based login (`express-session`) with credentials in `.env`

---

## Project Structure

```
personal_blog/
├── data/
│   └── articles/          # One .json file per article
├── public/
│   ├── styles.css
│   ├── index.html         # Home page
│   ├── article.html       # Single article page
│   ├── login.html         # Admin login
│   ├── 404.html
│   ├── js/
│   │   ├── utils.js       # Shared helpers (auth, date, nav)
│   │   ├── home.js
│   │   ├── article.js
│   │   ├── login.js
│   │   └── admin/
│   │       ├── dashboard.js
│   │       ├── new.js
│   │       └── edit.js
│   └── admin/
│       ├── index.html     # Dashboard
│       ├── new.html       # New article form
│       └── edit.html      # Edit article form
├── src/
│   ├── routes/
│   │   └── api.js         # REST API routes
│   ├── articles.js        # Article CRUD helpers
│   └── auth.js            # requireAuth middleware
├── server.js
├── package.json
├── .env.example
└── .gitignore
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/tanhoang0803/Personal_blog.git
cd Personal_blog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure credentials
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=yourpassword
SESSION_SECRET=a-long-random-secret-string
PORT=3000
```

### 4. Run the server
```bash
npm start
```

### 5. Open in browser
| Page | URL |
|------|-----|
| Home | `http://localhost:3000/` |
| Article | `http://localhost:3000/article.html?id=<slug>` |
| Login | `http://localhost:3000/login.html` |
| Admin | `http://localhost:3000/admin` |

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/me` | — | Returns `{ isAdmin: true/false }` |
| POST | `/api/login` | — | Login with username + password |
| POST | `/api/logout` | — | Destroy session |
| GET | `/api/articles` | — | List all articles |
| GET | `/api/articles/:id` | — | Get single article |
| POST | `/api/articles` | Admin | Create article |
| PUT | `/api/articles/:id` | Admin | Update article |
| DELETE | `/api/articles/:id` | Admin | Delete article |

---

## Skills Practised

- REST API design with Express
- Session-based authentication
- Filesystem CRUD (JSON files)
- Vanilla JS `fetch()` for client-side data loading
- Static file serving
