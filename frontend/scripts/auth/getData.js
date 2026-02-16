import { API_URL } from './config.js';

async function loadAdminDashboard() {
  const token = localStorage.getItem('admin_token');

const unauthenticated = `
<div class='unauthenticated'>
  <div>
  <p class='warn-header'>You are not authorized!</p>
  <p style='text-align:center; margin:5px auto; font-size:52px;'><i class="fas fa-triangle-exclamation" style="color: red;"></i></p>
  <a href='admin_login.html' class='js-relogin'>Go to login page</a>
  </div>
</div>
`;

  // No token
  if (!token) {
    document.querySelector('body').innerHTML = unauthenticated;
    return;
  }

  try {
    // Verify token
    const guardRes = await fetch(`${API_URL}/auth/protected`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!guardRes.ok) {
      localStorage.removeItem('admin_token');
      document.querySelector('body').innerHTML = unauthenticated;
      return;
    }

    // 3. Token valid → now fetch data
    const dataRes = await fetch(`${API_URL}/auth/data`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!dataRes.ok) {
      throw new Error('Failed to load dashboard data');
    }

    const data = await dataRes.json();
    
    // REMOVE THIS LOG IT'S VERY SENSITIVE
    
    console.log(data); // THE DATA FROM THE BACKEND
    return data;  // returned data

  } catch (err) {
    console.error(err);
    document.querySelector('body').innerHTML = unauthenticated;
  }
}

loadAdminDashboard();