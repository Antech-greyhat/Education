import { API_URL } from './config.js'
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';

const url = `${API_URL}/auth/register`;

const nameElement = document.querySelector('.js-full-name')
const emailElement = document.querySelector('.js-email')
const passwordElement1 = document.querySelector('.js-password1')
const passwordElement2 = document.querySelector('.js-password2')
const registerButton = document.querySelector('.js-register-button')
const termsCheckbox = document.querySelector('.js-terms-conditions');
const messageDisplay = document.querySelector('.js-register-message')

registerButton.addEventListener('click', async () => {
  const name = nameElement.value.trim()
  const email = emailElement.value.trim()
  const password = passwordElement1.value
  const password2 = passwordElement2.value

  // Validation
  if (!name || !email || !password || !password2) {
    showMessage(messageDisplay, 'All fields are required.', true)
    return
  }

  if (!email.includes('@') || !email.includes('.')) {
    showMessage(messageDisplay, 'Invalid email format.', true)
    return
  }

  if (password !== password2) {
    showMessage(messageDisplay, 'Password does not match.', true)
    return
  }

  if (password.length < 8) {
    showMessage(messageDisplay, 'Password should be greater than 8 characters.', true)
    return
  }
  
  if (!termsCheckbox.checked) {
    showMessage(messageDisplay, 'You must agree to the terms and conditions.', true)
    return;
  }

  // Loading state
  registerButton.disabled = true
  const originalText = registerButton.textContent
  registerButton.innerHTML = 'Creating account...'

  const details = { 
    name, email, password
  }
  
  try {
    const data = await dataSubmit(details, url);

    showMessage(messageDisplay, data.msg, false)

    // store token
    if (data.access_token) {
      localStorage.setItem('access_token', 
       data.access_token);
    }

    // redirect
    setTimeout(() => {
      window.location.href = 'languages.html'
    }, 4000);

    // clear form
    nameElement.value = ''
    emailElement.value = ''
    passwordElement1.value = ''
    passwordElement2.value = ''

  } catch (error) {
    showMessage(messageDisplay, error.message || 'Registration failed.', true)
  } finally {
    registerButton.disabled = false
    registerButton.innerHTML = originalText
  }
});