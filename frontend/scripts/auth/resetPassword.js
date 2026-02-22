import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';

const emailElement = document.querySelector('.js-reset-email');
const resetButton = document.querySelector('.js-reset-button');
const messageDisplay = document.querySelector('.js-message-display');

const url = `${API_URL}/auth/forgot_password`;

resetButton.addEventListener('click', async ()=>{
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
  resetButton.dissabled = true;
  resetButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Please wait...`;
  
  try {
    const data = await dataSubmit(details, url);
    showMessage(messageDisplay, 'Password reset link have been sent to your email account.', false);
    
    emailElement.value = '';
    
  } catch (error) {
   showMessage(messageDisplay, error.message, true)
   
  }finally {
    resetButton.dissabled = false;
    resetButton.innerHTML = originalContent;
  }
});
