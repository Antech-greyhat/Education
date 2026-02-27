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

    if (!response.ok) throw new Error('Server not OK');

    const data = await response.json();

    if (indicatorElement) {
      indicatorElement.style.display = 'block';
      indicatorElement.classList.remove('offline');
    }

    console.log('✓ Backend alive:', data.msg || data.status);
    return;

  } catch (error) {

    if (indicatorElement) {
      indicatorElement.style.display = 'block';
      indicatorElement.classList.add('offline');
    }

    console.log('✗ Backend offline');
    return;
  }
};
  setTimeout(ping, 3000);
  setInterval(ping, 300000);
})(); 