document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin = await getAuthStatus();
  if (!isAdmin) { window.location.href = '/login.html'; return; }
  renderNav(isAdmin);

  // Read article ID from query string: edit.html?id=some-slug
  const id = new URLSearchParams(location.search).get('id');

  const res = await fetch(`/api/articles/${id}`);
  if (res.status === 404) {
    document.getElementById('article-form').innerHTML =
      '<p class="empty-state">Article not found.</p>';
    return;
  }

  const a = await res.json();
  document.title = `Edit: ${a.title} — My Blog`;
  document.getElementById('title').value       = a.title;
  document.getElementById('publishedAt').value = a.publishedAt;
  document.getElementById('content').value     = a.content;

  document.getElementById('article-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl      = document.getElementById('form-error');
    errorEl.textContent = '';
    errorEl.hidden      = true;

    const r = await fetch(`/api/articles/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        title:       document.getElementById('title').value.trim(),
        content:     document.getElementById('content').value.trim(),
        publishedAt: document.getElementById('publishedAt').value,
      }),
    });

    if (r.ok) {
      window.location.href = 'index.html';
    } else {
      const data         = await r.json();
      errorEl.textContent = data.error || 'Failed to save changes.';
      errorEl.hidden      = false;
    }
  });
});
