import { API_URL } from './config.js';
import { dataDisplay } from './dataDisplay.js';
import { checkAuth } from './guard.js';
import { showMessage } from '../msgDisplay.js';

async function loadAdminDashboard() {
  const spinner = document.getElementById('spinner-container');
  const content = document.getElementById('page-content');
  
  // Create message element if it doesn't exist
  let messageDisplay = document.querySelector('.js-admin-message');
  if (!messageDisplay) {
    messageDisplay = document.createElement('div');
    messageDisplay.className = 'js-admin-message admin-message';
    document.querySelector('.admin-section')?.prepend(messageDisplay);
  }
  
  const token = localStorage.getItem('admin_token');
  const auth = await checkAuth(token, messageDisplay);

  // Handle 429 specifically
  if (auth.status === 429) {
    if (messageDisplay) showMessage(messageDisplay, 'Too many requests. Please wait a moment...', true);
    
    if (spinner) {
      spinner.style.opacity = '0';
      setTimeout(() => {
        spinner.style.display = 'none';
        if (content) content.style.display = 'block';
      }, 500);
    }
    
    // Try to fetch data anyway
    try {
      const dataRes = await fetch(`${API_URL}/auth/data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (dataRes.ok) {
        const data = await dataRes.json();
        dataDisplay(data);
      }
    } catch (err) {
    }
      console.error('Data fetch error:', err);
    return;
  }

  if (!auth.valid) {
    if (spinner) spinner.style.display = 'none';
    document.body.innerHTML = getUnauthorizedHTML();
    return;
  }

  // Token valid - fetch data
  try {
    const dataRes = await fetch(`${API_URL}/auth/data`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (dataRes.status === 429) {
      if (spinner) {
        spinner.style.opacity = '0';
        setTimeout(() => {
          spinner.style.display = 'none';
          if (content) content.style.display = 'block';
        }, 500);
      }
      if (messageDisplay) showMessage(messageDisplay, 'Rate limited. Data may be delayed.', true);
      return;
    }

    if (!dataRes.ok) {
      throw new Error(`Failed to load data: ${dataRes.status}`);
    }

    const data = await dataRes.json();
    
    if (spinner) {
      spinner.style.opacity = '0';
      setTimeout(() => {
        spinner.style.display = 'none';
        if (content) content.style.display = 'block';
      }, 500);
    }
    
    dataDisplay(data);

  } catch (err) {
    console.error('❌ Error:', err);
    
    if (err.message?.includes('429')) {
      if (messageDisplay) showMessage(messageDisplay, 'Rate limit reached. Please wait.', true);
      if (spinner) {
        spinner.style.opacity = '0';
        setTimeout(() => {
          spinner.style.display = 'none';
          if (content) content.style.display = 'block';
        }, 500);
      }
      return;
    }
    
    document.body.innerHTML = getUnauthorizedHTML();
  }
}

function getUnauthorizedHTML() {
  return `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="unauthorized-icon">
          <i class="fas fa-lock"></i>
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access the admin dashboard.</p>
        <div class="unauthorized-actions">
          <a href="admin_login.html" class="btn-admin-login btn-login">
            <i class="fas fa-sign-in-alt"></i> Admin Login
          </a>
          <a href="index.html" class="btn-admin-login btn-home">
            <i class="fas fa-home"></i> Go Home
          </a>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAdminDashboard();

  const refreshBtn = document.querySelector('.js-admin-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      const icon = refreshBtn.querySelector('.refresh');
      icon?.classList.add('fa-spin');
      await loadAdminDashboard();
      icon?.classList.remove('fa-spin');
    });
  }
});