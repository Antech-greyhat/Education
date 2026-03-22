// edu.js

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  if (!icon) return;
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');

  if (navMenu.classList.contains('open')) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      }, { once: true });
    });
  }
}

function setCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setCurrentYear();

  const themeToggle = document.getElementById('themeToggle');
  const hamburger = document.getElementById('hamburger');

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);

  initPasswordToggles();
  initRememberMe();
  initScrollReveal();
  initCountUp();

  document.addEventListener('click', (e) => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });
});

// Password toggle — all .toggle-password buttons on the page
function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.querySelector('i').className = isPassword
        ? 'fas fa-eye-slash'
        : 'fas fa-eye';
    });
  });
}

// Remember me — only runs on login page
function initRememberMe() {
  const emailInput = document.getElementById('loginEmail');
  const rememberMe = document.getElementById('rememberMe');
  const submitBtn = document.querySelector('.js-submit-button');
  if (!emailInput || !rememberMe) return;

  const savedEmail = localStorage.getItem('userRememberEmail');
  const remembered = localStorage.getItem('userRememberMe') === 'true';
  if (remembered && savedEmail) {
    emailInput.value = savedEmail;
    rememberMe.checked = true;
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (rememberMe.checked) {
        localStorage.setItem('userRememberMe', 'true');
        localStorage.setItem('userRememberEmail', emailInput.value);
      } else {
        localStorage.removeItem('userRememberMe');
        localStorage.removeItem('userRememberEmail');
      }
    });
  }
}

// Scroll reveal — Intersection Observer
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Expose globally so JS-rendered elements can be observed
  window.__revealObserver = observer;

  els.forEach(el => observer.observe(el));
}

// Count up animation for stat numbers
function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number, .about-stat__number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const raw = el.textContent.trim();

      // Extract numeric part and suffix (e.g. "5,000+" → 5000, "+")
      const suffix = raw.replace(/[\d,\.]/g, '');
      const numeric = parseFloat(raw.replace(/[^0-9.]/g, ''));
      if (isNaN(numeric)) return;

      const duration = 1800;
      const steps = 60;
      const interval = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += numeric / steps;
        if (current >= numeric) {
          el.textContent = raw; // restore original with suffix
          clearInterval(timer);
        } else {
          const display = numeric >= 1000
            ? Math.floor(current).toLocaleString()
            : Math.floor(current);
          el.textContent = display + suffix;
        }
      }, interval);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}
