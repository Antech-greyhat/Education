import { API_URL } from './config.js';
import { showMessage } from '../msgDisplay.js';

export async function refreshAccessToken(messageDisplay, token) {
    if (!token) {
        showMessage(messageDisplay, 'No refresh token found. Please login again.', true);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}),
            signal: AbortSignal.timeout(60000)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || 'Failed to refresh token');
        }

        showMessage(messageDisplay, 'Token refreshed successfully!', false);
        return data.access_token;

    } catch (error) {
        console.error('Refresh token error:', error);
        showMessage(messageDisplay, error.message || 'Session expired. Please login again.', true);
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        
        return null;
    }
}