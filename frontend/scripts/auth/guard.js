import { API_URL } from './config.js';
import { refreshAccessToken } from './refreshToken.js';

export async function checkAuth(token, messageDisplay) {
  if (!token) {
    return { valid: false, redirect: 'login.html' };
  }

  try {
    const res = await fetch(`${API_URL}/auth/protected`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Handle 500 with expired token
    if (res.status === 500) {
      const errorText = await res.text();
      if (errorText.includes('Signature has expired')) {
        const refreshToken = localStorage.getItem("admin_refresh_token") || localStorage.getItem("refresh_token");
        
        if (!messageDisplay) {
          messageDisplay = document.body;
        }
        
        const newToken = await refreshAccessToken(messageDisplay, refreshToken);
        
        if (newToken) {
          if (localStorage.getItem('admin_token')) {
            localStorage.setItem('admin_token', newToken);
          } else {
            localStorage.setItem('access_token', newToken);
          }
          return { valid: true, newToken };
        }
      }
      return { valid: false, redirect: 'login.html' };
    }

    if (res.status === 429) {
      return { valid: true, status: 429 };
    }

    if (res.status === 401) {
      const refreshToken = localStorage.getItem("admin_refresh_token") || localStorage.getItem("refresh_token");
      
      if (!messageDisplay) {
        messageDisplay = document.body;
      }
      
      const newToken = await refreshAccessToken(messageDisplay, refreshToken);
      
      if (newToken) {
        if (localStorage.getItem('admin_token')) {
          localStorage.setItem('admin_token', newToken);
        } else {
          localStorage.setItem('access_token', newToken);
        }
        return { valid: true, newToken };
      }
      return { valid: false, redirect: 'login.html' };
    }

    if (!res.ok) {
      return { valid: false, redirect: 'login.html' };
    }

    return { valid: true };

  } catch (error) {
    console.error('Auth error:', error);
    return { valid: false, redirect: 'login.html' };
  }
}