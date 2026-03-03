document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin = await getAuthStatus();
  if (!isAdmin) { window.location.href = '/login.html'; return; }
  renderNav(isAdmin);

  const res     = await fetch('/api/articles');
  const articles = await res.json();
  const section = document.getElementById('article-table');
  const tbody   = document.getElementById('article-tbody');

  if (articles.length === 0) {
    section.innerHTML = '<p class="empty-state">No articles yet. <a href="new.html">Create your first one!</a></p>';
    return;
  }

  tbody.innerHTML = articles.map(a => `
    <tr>
      <td><a href="../article.html?id=${a.id}" target="_blank">${escHtml(a.title)}</a></td>
      <td><time datetime="${a.publishedAt}">${formatDate(a.publishedAt)}</time></td>
      <td class="actions">
        <a href="edit.html?id=${a.id}" class="btn btn-sm btn-secondary">Edit</a>
        <button class="btn btn-sm btn-danger"
          data-id="${a.id}"
          data-title="${escHtml(a.title)}">Delete</button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm(`Delete "${btn.dataset.title}"? This cannot be undone.`)) return;
      const r = await fetch(`/api/articles/${btn.dataset.id}`, { method: 'DELETE' });
      if (r.ok) {
        btn.closest('tr').remove();
        if (!tbody.rows.length) {
          section.innerHTML = '<p class="empty-state">No articles yet. <a href="new.html">Create your first one!</a></p>';
        }
      }
    });
  });
});
