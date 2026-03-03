document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin   = await getAuthStatus();
  renderNav(isAdmin);

  // Read article ID from query string: article.html?id=some-slug
  const id        = new URLSearchParams(location.search).get('id');
  const container = document.getElementById('article-content');

  if (!id) {
    container.innerHTML = `
      <div class="error-section">
        <h1>404</h1>
        <p>No article specified.</p>
        <a href="index.html" class="btn btn-primary">Go Home</a>
      </div>`;
    return;
  }

  const res = await fetch(`/api/articles/${id}`);

  if (res.status === 404) {
    document.title = 'Not Found — My Blog';
    container.innerHTML = `
      <div class="error-section">
        <h1>404</h1>
        <p>Article not found.</p>
        <a href="index.html" class="btn btn-primary">Go Home</a>
      </div>`;
    return;
  }

  const a = await res.json();
  document.title = `${a.title} — My Blog`;

  const paragraphs = a.content
    .split('\n')
    .filter(p => p.trim())
    .map(p => `<p>${escHtml(p)}</p>`)
    .join('');

  container.innerHTML = `
    <article class="article-full">
      <header class="article-full-header">
        <a href="index.html" class="back-link">&larr; Back to all articles</a>
        <h1 class="article-full-title">${escHtml(a.title)}</h1>
        <time class="article-full-date" datetime="${a.publishedAt}">
          Published on ${formatDate(a.publishedAt)}
        </time>
      </header>
      <div class="article-full-body">${paragraphs}</div>
    </article>`;
});
