import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';

const url = `${API_URL}/auth/admin`;
const emailElement = document.querySelector('.js-email-input');
const passwordElement = document.querySelector('.js-password-input');
const submitButton = document.querySelector('.js-submit-button');
const messageDisplay = document.querySelector('.js-message-display');

submitButton.addEventListener('click', async () => {
  if (submitButton.disabled) return;

  const email = emailElement.value.trim();
  const password = passwordElement.value.trim();

  if (!email || !password) {
    showMessage('All fields are required!', true);
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    showMessage('Enter a valid email', true);
    return;
  }

  const originalContent = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Please wait...`;

  const details = { email, password };

  try {
    const data = await dataSubmit(details, url);

    // store token
    localStorage.setItem('admin_token', data.access_token);

    showMessage('Logged in successfully. Redirecting...', false);

    setTimeout(() => {
      window.location.href = 'admin_dashboard.html';
    }, 800);

  } catch (error) {
    showMessage(error || 'Invalid credentials!', true);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalContent;
  }
});

let messageTimeout;

function showMessage(msg, isError = true) {
  if (messageTimeout) clearTimeout(messageTimeout);

  messageDisplay.textContent = msg;
  messageDisplay.style.color = isError ? '#dc3545' : '#28a745';
  messageDisplay.style.display = 'block';

  messageTimeout = setTimeout(() => {
    messageDisplay.textContent = '';
    messageDisplay.style.display = 'none';
  }, 5000);
}