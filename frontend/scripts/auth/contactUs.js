import { dataSubmit } from './dataSubmit.js'
import { API_URL } from './config.js';

const url = `${API_URL}/auth/contact`;

const firstNameInput = document.querySelector('.js-first-name');
const lastNameInput = document.querySelector('.js-last-name');
const emailInput = document.querySelector('.js-email');
const subjectInput = document.querySelector('.js-subject');
const messageInput = document.querySelector('.js-message');
const contactSubmitButton = document.querySelector('.js-contact-button');

const displayElement = document.querySelector('.js-feedback-display');


contactSubmitButton.addEventListener('click', async ()=>{
  
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const email = emailInput.value;
  const subject = subjectInput.value;
  const message = messageInput.value;
  showMessage('');
  
  if (!firstName || !lastName || !email || !subject || !message) {
    showMessage('All fields are required!', true);
    return;
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    showMessage('Enter a valid email', true);
    return;
  }

  const originalContent = contactSubmitButton.innerHTML;
  
  contactSubmitButton.disabled = true;
  contactSubmitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
  
  const details = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    subject: subject,
    message: message
  };
  
  try {
    const data = await dataSubmit(details, url);
    showMessage('Your message have been submitted successfully and will be reviewed soon by our team.', false);
    
    // CLEAR THE INPUTS
    
    firstNameInput.value = '';
    lastNameInput.value = '';
    emailInput.value = '';
    subjectInput.value = '';
    messageInput.value = '';
    messageInput.value = '';
    
    
  } catch(error) {
    showMessage(error || 'An error occured please try again later!', true);
  } finally {
    contactSubmitButton.disabled = false;
    contactSubmitButton.innerHTML = originalContent;
  }
});

let messageTimeout;

function showMessage(msg, isError = true) {
  if (messageTimeout) clearTimeout(messageTimeout);

  displayElement.textContent = msg;
  displayElement.style.color = isError ? '#dc3545' : '#28a745';
  displayElement.style.display = 'block';

  messageTimeout = setTimeout(() => {
    displayElement.textContent = '';
    displayElement.style.display = 'none';
  }, 5000);
}