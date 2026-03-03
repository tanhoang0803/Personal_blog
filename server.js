require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path    = require('path');

const apiRouter = require('./src/routes/api');

const app  = express();
const PORT = process.env.PORT || 3000;
const PUB  = path.join(__dirname, 'public');

// ── Trust Render/Heroku reverse proxy (required for HTTPS sessions) ───────────
app.set('trust proxy', 1);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── /admin → admin/index.html (must be before static to avoid 301 redirect) ──
app.get('/admin', (_, res) => res.sendFile(path.join(PUB, 'admin', 'index.html')));

// ── Static files (HTML, CSS, JS) ──────────────────────────────────────────────
app.use(express.static(PUB));

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).sendFile(path.join(PUB, '404.html')));

app.listen(PORT, () => {
  console.log(`Personal blog running at http://localhost:${PORT}`);
});
