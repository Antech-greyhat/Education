import { API_URL } from './config.js';

export async function loadAdminDashboard() {
  const token = localStorage.getItem('admin_token');

  // No token
  if (!token) {
    window.location.href = 'index.html';
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
      window.location.href = 'index.html';
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
    window.location.href = 'index.html';
  }
}

loadAdminDashboard();