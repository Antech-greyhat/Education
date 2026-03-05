import { API_URL } from './auth/config.js';
import { dataSubmit } from './auth/dataSubmit.js';
import { showMessage } from './msgDisplay.js';

const url = `${API_URL}/news/newsletter`;
const emailElement = document.querySelector('.js-newsletter-input');
const emailButton = document.querySelector('.js-news-button');
const messageDisplay = document.querySelector('.js-message-display');
const newsletterForm = document.querySelector('.js-news-form');

emailButton.addEventListener('click', (event) => {
  emailSubmitInfo();
});

newsletterForm.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission if inside a form
    emailSubmitInfo();
  }
});

const emailSubmitInfo = async () => {
  
  const email = emailElement.value.trim();
  
  // Validation
  if (!email) {
    showMessage(messageDisplay, 'Please enter an email address', true);
    return;
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    showMessage(messageDisplay, 'Please enter a valid email address', true);
    return;
  }

  // Loading state
  emailButton.disabled = true;
  const originalText = emailButton.textContent;
  emailButton.textContent = 'Please wait...';

  const details = { email };
  
  try {
    await dataSubmit(details, url);
    showMessage(messageDisplay, 'Thank you for subscribing!', false);
    emailElement.value = ''; // clear input
    
  } catch (error) {
    console.log('Error details:', error); // For debugging
    
    // Error toast with server message
    let errorMessage = 'Subscription failed. Please try again.';
    
    // Check if error has status property
    if (error.status) {
      if (error.status === 409) {
        // Handle conflict error (already subscribed)
        errorMessage = error.data?.message || 'This email is already subscribed';
      } else if (error.status === 400) {
        errorMessage = error.data?.message || 'Invalid email format';
      } else if (error.status === 429) {
        errorMessage = 'Too many attempts. Please wait.';
      }
    } 
    // Check if error is a Response object (if dataSubmit doesn't parse it)
    else if (error instanceof Response) {
      try {
        const errorData = await error.json();
        if (error.status === 409) {
          errorMessage = errorData.message || 'This email is already subscribed';
        } else if (error.status === 400) {
          errorMessage = errorData.message || 'Invalid request';
        } else {
          errorMessage = errorData.message || `Error: ${error.status}`;
        }
      } catch (e) {
        errorMessage = `Error: ${error.status}`;
      }
    }
    // If error has message property
    else if (error.message) {
      errorMessage = error.message;
    }
    
    showMessage(messageDisplay, errorMessage, true);
    
  } finally {
    emailButton.disabled = false;
    emailButton.textContent = originalText;
  }
};