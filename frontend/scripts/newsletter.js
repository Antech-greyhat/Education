import { API_URL } from './auth/config.js';
import { dataSubmit } from './auth/dataSubmit.js';
import { showMessage } from './msgDisplay.js';


const url = `${API_URL}/news/newsletter`;
const emailElement = document.querySelector('.js-newsletter-input');
const emailButton = document.querySelector('.js-news-button');
const messageDisplay = document.querySelector('.js-message-display');


emailButton.addEventListener('click', async () => {
  const email = emailElement.value.trim();
  
  // Validation
  if (!email) {
    showToast(messageDisplay, 'Please enter an email address', true);
    return;
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    showToast(messageDisplay, 'Please enter a valid email address', true);
    return;
  }

  // Loading state
  emailButton.disabled = true;
  const originalText = emailButton.textContent;
  emailButton.textContent = 'Please wait...';
  
  // Clear any existing messages immediately
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
  
  const details = { email };
  
  try {
    
    await dataSubmit(details, url);
    
    // await newsletterSub(email);

    showToast(messageDisplay, 'Thank you for subscribing!', false);
    emailElement.value = ''; // clear input
    
  } catch (error) {
    // Error toast with server message
    let errorMessage = 'Subscription failed. Please try again.';
    
    if (error.status === 409) {
      errorMessage = `${error.data.message}`;
    } else if (error.status === 400) {
      errorMessage = `${error.data?.message || 'Invalid request'}`;
    } else if (error.status === 429) {
      errorMessage = 'Too many attempts. Please wait.';
    } else if (error.message) {
      errorMessage = `${error.message}`;
    }
    
    showToast(messageDisplay, errorMessage, true);
    
  } finally {
    emailButton.disabled = false;
    emailButton.textContent = originalText;
  }
});

emailElement.addEventListener('focus', () => {

});