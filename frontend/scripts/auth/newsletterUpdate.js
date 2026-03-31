import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';

const newsletterButton = document.querySelector('.js-submit-button');
const messageDisplay = document.querySelector('.js-message-display');
const subjectElement = document.querySelector('.js-newsletter-subject');
const messageElement = document.querySelector('.js-newsletter-message');
const newsletterForm = document.querySelector('.js-newsletter-form');

async function newsletterUpdate() {
  const token = localStorage.getItem('admin_token');
  const message = tinymce.get('newsletterContent').getContent();

  // Check authentication
  if (!token) {
    showMessage(messageDisplay, 'You are not authenticated', true);
    window.location.href = 'admin_login.html';
    return;
  }

  // Validate fields
  if (!message) {
    showMessage(messageDisplay, 'Please enter a message.', true);
    return;
  }

  showMessage(messageDisplay, 'Please wait while we process your request...', false);

  const details = { message };
  const url = `${API_URL}/auth/admin_updates`;
  const originalContent = newsletterButton.innerHTML;

  newsletterButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Please wait...`;
  newsletterButton.disabled = true;

  try {
    // Pass token to dataSubmit
    const response = await dataSubmit(details, url, token);
    
    showMessage(messageDisplay, response.msg, false);
    
    //clear all inputs
    subjectElement.value = '';
    messageElement.value = '';
    
  } catch (err) {
    console.error('Error:', err);

    if (err.status === 401) {
      showMessage(messageDisplay, 'Session expired. Please log in again.', true);
      window.location.href = 'admin_login.html';
    } else {
      showMessage(messageDisplifay, err.message || 'Request failed', true);
    }
  } finally {
    newsletterButton.innerHTML = originalContent;
    newsletterButton.disabled = false;
  }
}

// Button event listener
newsletterButton.addEventListener('click', newsletterUpdate);