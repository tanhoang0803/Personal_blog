const express  = require('express');
const router   = express.Router();
const { requireAuth } = require('../auth');
const {
  listArticles, getArticle,
  createArticle, updateArticle, deleteArticle,
} = require('../articles');

// ── Auth ──────────────────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
  res.json({ isAdmin: req.session?.isAdmin || false });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'Invalid username or password.' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// ── Articles (public) ─────────────────────────────────────────────────────────
router.get('/articles', (req, res) => {
  res.json(listArticles());
});

router.get('/articles/:id', (req, res) => {
  const article = getArticle(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found.' });
  res.json(article);
});

// ── Articles (admin only) ─────────────────────────────────────────────────────
router.post('/articles', requireAuth, (req, res) => {
  const { title, content, publishedAt } = req.body;
  if (!title || !content || !publishedAt) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const article = createArticle({
    title: title.trim(),
    content: content.trim(),
    publishedAt,
  });
  res.status(201).json(article);
});

router.put('/articles/:id', requireAuth, (req, res) => {
  const { title, content, publishedAt } = req.body;
  if (!getArticle(req.params.id)) {
    return res.status(404).json({ error: 'Article not found.' });
  }
  if (!title || !content || !publishedAt) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const article = updateArticle(req.params.id, {
    title: title.trim(),
    content: content.trim(),
    publishedAt,
  });
  res.json(article);
});

router.delete('/articles/:id', requireAuth, (req, res) => {
  if (!deleteArticle(req.params.id)) {
    return res.status(404).json({ error: 'Article not found.' });
  }
  res.json({ ok: true });
});

module.exports = router;
