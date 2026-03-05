import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';

const emailElement = document.querySelector('.js-reset-email');
const resetButton = document.querySelector('.js-reset-button');
const newPasswordSec = document.querySelector('.js-new-pass-section');
const messageDisplay = document.querySelector('.js-message-display');
const emailResetForm = document.querySelector('.js-email-submit');;

const newPasswordElement = document.querySelector('.js-new-password')
const newPassButton = document.querySelector('.js-new-pass-submit');

const urlParams = new URLSearchParams(window.location.search);

const reset_token_id = urlParams.get('reset_token_id');
const reset_token = urlParams.get('reset_token');

if ( reset_token && reset_token_id ) {
  newPasswordSec.style.display = 'block';
  emailElement.parentElement.style.display = 'none';
  resetButton.style.display = 'none';
}

// SEND RESET LINK

resetButton.addEventListener('click', (event) => {
  sendResetInfo();
});

emailResetForm.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendResetInfo();
  }
});

// NEW PASSWORD RESET

newPassButton.addEventListener('click', (event) => {
  newPasswordInfo();
});

newPasswordSec.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    newPasswordInfo()
  }
});

// Reset link function

const sendResetInfo = async () =>{
  
  const url = `${API_URL}/auth/forgot_password`;
  const email = emailElement.value;
  
  if (!email) {
    showMessage(messageDisplay, 'Email is required.', true)
    return;
  };
  
  if (!email.includes('@') ||   !email.includes('.')) {
    showMessage(messageDisplay, 'Enter a valid email.', true)
    return;
  }
  
  const details = { email };
  
  const originalContent = resetButton.innerHTML;
  resetButton.disabled = true;
  resetButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Please wait...`;
  
  try {
    const data = await dataSubmit(details, url);
    showMessage(messageDisplay, data.msg , false);
    
    emailElement.value = '';
    
  } catch (error) {
   showMessage(messageDisplay, error.message, true)
   
  }finally {
    resetButton.disabled = false;
    resetButton.innerHTML = originalContent;
  }
  
};

// New password function
const newPasswordInfo = async () =>{
  
  const url = `${API_URL}/auth/reset_password`;
  const password = newPasswordElement.value;
  
  if (!password) {
    showMessage(messageDisplay, 'Password is required.', true);
    return;
  }
  
  if (password.length < 8) {
    showMessage(messageDisplay, 'Password must me greater than 8 characters', true);
    return;
  }
  
  const details = { reset_token, reset_token_id,  password };
  
  const originalContent = newPassButton.innerHTML;
  newPassButton.disabled = true;
  newPassButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Please wait...`; 
  
  try {
    const data = await dataSubmit(details, url);
    
    showMessage(messageDisplay, data.msg, false);
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 3000);
    
  } catch (error) {
    showMessage(messageDisplay, error.message, true);
    
  } finally {
    newPassButton.innerHTML = originalContent;
    newPassButton.disabled = false;
  }
  
};

const passe = value;