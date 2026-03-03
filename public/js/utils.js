// ── Date formatting ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ── Safe HTML escaping ────────────────────────────────────────────────────────
function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Auth status ───────────────────────────────────────────────────────────────
async function getAuthStatus() {
  try {
    const res = await fetch('/api/me');
    const data = await res.json();
    return data.isAdmin;
  } catch {
    return false;
  }
}

// ── Navigation ────────────────────────────────────────────────────────────────
function renderNav(isAdmin) {
  const el = document.getElementById('nav-auth');
  if (!el) return;
  if (isAdmin) {
    el.innerHTML = `
      <a href="/admin">Dashboard</a>
      <button class="btn-link" id="logout-btn">Logout</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', async () => {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login.html';
    });
  } else {
    el.innerHTML = '<a href="/login.html">Admin</a>';
  }
}

// ── Copyright year ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
});
