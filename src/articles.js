const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ARTICLES_DIR = path.join(__dirname, '..', 'data', 'articles');

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function readArticleFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function listArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
  const articles = files.map(f => {
    try {
      return readArticleFile(path.join(ARTICLES_DIR, f));
    } catch {
      return null;
    }
  }).filter(Boolean);

  // Sort newest first
  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return articles;
}

function getArticle(id) {
  const filePath = path.join(ARTICLES_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return readArticleFile(filePath);
  } catch {
    return null;
  }
}

function createArticle({ title, content, publishedAt }) {
  const base = slugify(title) || uuidv4();
  let id = base;
  let filePath = path.join(ARTICLES_DIR, `${id}.json`);

  // Avoid collisions
  let counter = 1;
  while (fs.existsSync(filePath)) {
    id = `${base}-${counter++}`;
    filePath = path.join(ARTICLES_DIR, `${id}.json`);
  }

  const article = { id, title, content, publishedAt };
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');
  return article;
}

function updateArticle(id, { title, content, publishedAt }) {
  const filePath = path.join(ARTICLES_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const article = { id, title, content, publishedAt };
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');
  return article;
}

function deleteArticle(id) {
  const filePath = path.join(ARTICLES_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}

module.exports = { listArticles, getArticle, createArticle, updateArticle, deleteArticle };
