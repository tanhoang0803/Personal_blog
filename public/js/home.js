document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin = await getAuthStatus();
  renderNav(isAdmin);

  const list = document.getElementById('article-list');
  let articles;
  try {
    const res = await fetch('/api/articles');
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    articles = await res.json();
  } catch (err) {
    list.innerHTML = `<p class="empty-state">Failed to load articles. Make sure the server is running.</p>`;
    return;
  }

  if (articles.length === 0) {
    list.innerHTML = '<p class="empty-state">No articles published yet. Check back soon!</p>';
    return;
  }

  list.innerHTML = articles.map(a => `
    <article class="article-card">
      <div class="article-card-meta">
        <time datetime="${a.publishedAt}">${formatDate(a.publishedAt)}</time>
      </div>
      <h2 class="article-card-title">
        <a href="/article.html?id=${a.id}">${escHtml(a.title)}</a>
      </h2>
      <p class="article-card-excerpt">
        ${escHtml(a.content.length > 200 ? a.content.substring(0, 200) + '…' : a.content)}
      </p>
      <a href="/article.html?id=${a.id}" class="read-more">Read more &rarr;</a>
    </article>
  `).join('');
});
