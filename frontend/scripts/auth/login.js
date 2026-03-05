import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';

const url = `${API_URL}/auth/login`;
const emailElement = document.querySelector('.js-email');
const passwordElement = document.querySelector('.js-password');
const submitButton = document.querySelector('.js-submit-button');
const messageDisplay = document.querySelector('.js-login-message');
const loginForm = document.querySelector('.js-auth-form');

// Button submit
submitButton.addEventListener('click', (event) => {
  loginSubmitInfo();
});

// keydown event
loginForm.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loginSubmitInfo();
  }
});

const loginSubmitInfo = async () => {

  const email = emailElement.value.trim();
  const password = passwordElement.value;

  if (!email || !password) {
    showMessage(messageDisplay, 'All fields are required.', true);
    return;
  }

  const originalContent = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Logging in...`;
  showMessage(messageDisplay, '');

  const details = { email, password };

  try {
    const data = await dataSubmit(details, url);

    // Store JWT
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    showMessage(messageDisplay, data.msg, false);

    setTimeout(() => {
      window.location.href = 'languages.html';
    }, 1000);

  } catch (error) {

    // Unverified account
    if (error.data?.otp_id) {
      localStorage.setItem('otp_id', error.data.otp_id);
      showMessage(messageDisplay, error.data.msg, true);
      setTimeout(() => {
        window.location.href = 'otp_verify.html';
      }, 3000);
      return;
    }

    showMessage(messageDisplay, error.message || 'An error occurred. Please try again.', true);

  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalContent;
  }

};