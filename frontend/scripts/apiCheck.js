import { API_URL } from './auth/config.js';

const url = `${API_URL}/check/health`;

const indicatorElement = document.querySelector('.js-health-indicator');

(() => {
    const ping = async () => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✓ Backend alive:', data.msg || data.status);
                return true;
            }
        } catch {
          // Chillax
        }
        return false;
    };

    setTimeout(ping, 3000);
    setInterval(ping, 300000);
})();