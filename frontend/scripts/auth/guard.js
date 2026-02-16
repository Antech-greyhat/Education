import { API_URL } from './config.js';

async function protectPage() {
  const token = localStorage.getItem('access_token');

  // No token at all → instant logout
  if (!token) {
    logout();
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/protected`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    console.log("Authenticated as user:", data.user_id);

  } catch {
    logout();
  }
}

function logout() {
  localStorage.removeItem('access_token');
  window.location.href = 'login.html';
}

protectPage();