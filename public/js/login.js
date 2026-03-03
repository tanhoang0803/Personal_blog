document.addEventListener('DOMContentLoaded', async () => {
  // Already logged in → go straight to dashboard
  const isAdmin = await getAuthStatus();
  if (isAdmin) { window.location.href = 'admin/index.html'; return; }

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl      = document.getElementById('login-error');
    errorEl.textContent = '';
    errorEl.hidden      = true;

    const res = await fetch('/api/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
      }),
    });

    if (res.ok) {
      window.location.href = 'admin/index.html';
    } else {
      const data         = await res.json();
      errorEl.textContent = data.error || 'Login failed.';
      errorEl.hidden      = false;
    }
  });
});
