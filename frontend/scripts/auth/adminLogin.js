import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';

const url = `${API_URL}/auth/admin`;
const emailElement = document.querySelector('.js-email-input');
const passwordElement = document.querySelector('.js-password-input');
const submitButton = document.querySelector('.js-submit-button');
const messageDisplay = document.querySelector('.js-message-display');
const formElement = document.getElementById('adminLoginForm');


submitButton.addEventListener('click', () => {
  loginSubmitInfo();
});


formElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loginSubmitInfo();
  }
});


const loginSubmitInfo = async ()=>{
  
  if (submitButton.disabled) return;

  const email = emailElement.value.trim();
  const password = passwordElement.value.trim();
  
  if (!email || !password) {
    showMessage(messageDisplay, 'All fields are required!', true);
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    showMessage(messageDisplay, 'Enter a valid email', true);
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
    
    localStorage.setItem('admin_refresh_token', data.refresh_token);

    showMessage(messageDisplay, 'Logged in successfully. Redirecting...', false);

    setTimeout(() => {
      window.location.href = 'admin_dashboard.html';
    }, 800);

  } catch (error) {
    showMessage(messageDisplay, error.message , true);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalContent;
  }
  
};