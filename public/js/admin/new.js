document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin = await getAuthStatus();
  if (!isAdmin) { window.location.href = '/login.html'; return; }
  renderNav(isAdmin);

  document.getElementById('publishedAt').value = new Date().toISOString().split('T')[0];

  document.getElementById('article-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl      = document.getElementById('form-error');
    errorEl.textContent = '';
    errorEl.hidden      = true;

    const res = await fetch('/api/articles', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        title:       document.getElementById('title').value.trim(),
        content:     document.getElementById('content').value.trim(),
        publishedAt: document.getElementById('publishedAt').value,
      }),
    });

    if (res.ok) {
      window.location.href = 'index.html';
    } else {
      const data         = await res.json();
      errorEl.textContent = data.error || 'Failed to create article.';
      errorEl.hidden      = false;
    }
  });
});
