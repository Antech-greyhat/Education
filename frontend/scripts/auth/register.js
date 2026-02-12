import { API_URL } from './config.js'

const nameElement = document.querySelector('.js-full-name')
const emailElement = document.querySelector('.js-email')
const passwordElement1 = document.querySelector('.js-password1')
const passwordElement2 = document.querySelector('.js-password2')
const registerButton = document.querySelector('.js-register-button')
const termsCheckbox = document.querySelector('.js-terms-conditions');
const messageDisplay = document.querySelector('.js-register-message')

let messageTimeout;

function showMessage(msg, isError = true) {
  // clear previous timeout
  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }

  messageDisplay.textContent = msg;
  messageDisplay.style.color = isError ? '#dc3545' : '#28a745';
  messageDisplay.style.display = 'block';

  // auto hide after 5 seconds
  messageTimeout = setTimeout(() => {
    messageDisplay.textContent = '';
    messageDisplay.style.display = 'none';
  }, 5000);
}

registerButton.addEventListener('click', async () => {
  const name = nameElement.value.trim()
  const email = emailElement.value.trim()
  const password = passwordElement1.value
  const password2 = passwordElement2.value

  // Validation
  if (!name || !email || !password || !password2) {
    showMessage('All fields are required.')
    return
  }

  if (!email.includes('@') || !email.includes('.')) {
    showMessage('Invalid email format.')
    return
  }

  if (password !== password2) {
    showMessage('Password does not match.')
    return
  }

  if (password.length < 8) {
    showMessage('Password should be greater than 8 characters.')
    return
  }
  
  if (!termsCheckbox.checked) {
    showMessage('You must agree to the terms and conditions.', true);
    return;
  }

  // Loading state
  registerButton.disabled = true
  const originalText = registerButton.textContent
  registerButton.textContent = 'Creating account...'
  showMessage('');

  try {
    await fetchData(name, email, password)
    showMessage('Account created successfully.', false)

    // Optional: clear form
    nameElement.value = ''
    emailElement.value = ''
    passwordElement1.value = ''
    passwordElement2.value = ''
    

  } catch (error) {
    showMessage(error.message || 'Registration failed.')
  } finally {
    registerButton.disabled = false
    registerButton.textContent = originalText
  }
})

async function fetchData(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.msg)
  }
  
  const access_token = data.access_token;
    
    localStorage.setItem('access_token', `Barear ${access_token}`);
    
    setTimeout(() => {
      window.location.href = 'languages.html'
    }, 4000);
  
  return data;
}