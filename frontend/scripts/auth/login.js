import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';

const url = `${API_URL}/auth/login`;
const emailElement = document.querySelector('.js-email');
const passwordElement = document.querySelector('.js-password');
const submitButton = document.querySelector('.js-submit-button');
const messageDisplay = document.querySelector('.js-login-message');

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

submitButton.addEventListener('click', async () => {
  const email = emailElement.value.trim();
  const password = passwordElement.value;

  if (!email || !password) {
    showMessage('All fields are required.');
    return;
  }

  const originalContent = submitButton.innerHTML;

  submitButton.disabled = true;
  submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Logging in...`;
  showMessage('');

  const details = { email, password };
  
  try {
    const data = await dataSubmit(details, url);

    // Store JWT
    localStorage.setItem('access_token', data.access_token);

    showMessage('Login successful!', false);

    setTimeout(() => {
      window.location.href = 'languages.html';
    }, 1000);

  } catch (error) {
    showMessage(error.message || 'Login failed.');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalContent;
  }
});