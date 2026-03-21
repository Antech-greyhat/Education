import { dataSubmit } from './dataSubmit.js'
import { API_URL } from './config.js';
import { showMessage } from '../msgDisplay.js';

const url = `${API_URL}/auth/contact`;

const firstNameInput = document.querySelector('.js-first-name');
const lastNameInput = document.querySelector('.js-last-name');
const emailInput = document.querySelector('.js-email');
const subjectInput = document.querySelector('.js-subject');
const messageInput = document.querySelector('.js-message');
const contactSubmitButton = document.querySelector('.js-contact-button');

const displayElement = document.querySelector('.js-feedback-display');
const contactForm = document.querySelector('.js-contact-form');;

// Button submit
contactSubmitButton.addEventListener('click', () => {
  contactSubmitInfo();
});

// keydown sumbit
contactForm.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    contactSubmitInfo();
  }
});

// submit function
const contactSubmitInfo = async ()=>{
  
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const email = emailInput.value;
  const subject = subjectInput.value;
  const message = messageInput.value;
  showMessage(displayElement,'');
  
  if (!firstName || !lastName || !email || !subject || !message) {
    showMessage(displayElement, 'All fields are required!', true);
    return;
  }
  
  if (!email.includes('@') || !email.includes('.')) {
    showMessage(displayElement, 'Enter a valid email', true);
    return;
  }

  const originalContent = contactSubmitButton.innerHTML;
  
  contactSubmitButton.disabled = true;
  contactSubmitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
  
  const details = { firstName, lastName, email, subject, message };
  
  try {
    const data = await dataSubmit(details, url);
    showMessage(displayElement, data.msg , false);
    
    // CLEAR THE INPUTS
    
    firstNameInput.value = '';
    lastNameInput.value = '';
    emailInput.value = '';
    subjectInput.value = '';
    messageInput.value = '';
    
    
  } catch(error) {
    showMessage(displayElement, error.message , true);
  } finally {
    contactSubmitButton.disabled = false;
    contactSubmitButton.innerHTML = originalContent;
  }
  
};