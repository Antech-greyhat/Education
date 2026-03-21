// admin.js

// ── TAB SWITCHING ──
function initTabs() {
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(`${target}-tab`);
      if (pane) pane.classList.add('active');
    });
  });
}

// ── LOGOUT ──
function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('admin_token');
    window.location.href = 'admin_login.html';
  });
}

// ── SEARCH ──
function initSearch() {
  // User search
  const userSearch = document.getElementById('userSearch');
  if (userSearch) {
    userSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('#usersTable tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  }

  // Admin search
  const adminSearch = document.getElementById('adminSearch');
  if (adminSearch) {
    adminSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('#adminsTable tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  }
}

// ── MESSAGE FILTER BUTTONS ──
function initMessageFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('#messagesTable tbody tr').forEach(row => {
        if (filter === 'all') {
          row.style.display = '';
        } else if (filter === 'unread') {
          row.style.display = row.querySelector('.status-unread') ? '' : 'none';
        } else if (filter === 'read') {
          row.style.display = row.querySelector('.status-read') ? '' : 'none';
        }
      });
    });
  });
}

// ── NEWSLETTER FORM ──
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('newsletterSubject')?.value;
    const content = document.getElementById('newsletterContent')?.value;
    if (!subject || !content) return;
    // Placeholder — wire to your API when ready
    alert(`Newsletter "${subject}" queued for sending.`);
    form.reset();
  });
}

// ── SETTINGS FORM ──
function initSettingsForm() {
  const form = document.getElementById('settingsForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Placeholder — wire to your API when ready
    alert('Settings saved.');
  });
}

// ── THEME TOGGLE ──
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  btn.querySelector('i').className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.querySelector('i').className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  });
}

// ── HAMBURGER ──
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });
}

// ── CURRENT YEAR ──
function setCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initLogout();
  initSearch();
  initMessageFilters();
  initNewsletterForm();
  initSettingsForm();
  initThemeToggle();
  initHamburger();
  setCurrentYear();
});
