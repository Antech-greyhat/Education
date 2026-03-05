import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';

const url = `${API_URL}/auth/register`;

const nameElement = document.querySelector('.js-full-name');
const emailElement = document.querySelector('.js-email');
const passwordElement1 = document.querySelector('.js-password1');
const passwordElement2 = document.querySelector('.js-password2');
const registerButton = document.querySelector('.js-register-button');
const termsCheckbox = document.querySelector('.js-terms-conditions');
const messageDisplay = document.querySelector('.js-register-message');
const registerForm = document.querySelector('.js-auth-form');

// button submit
registerButton.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent any default button behavior
  registerSubmitInfo();
});

// keydown event 
registerForm.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission
    registerSubmitInfo();
  }
});

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// register function
const registerSubmitInfo = async () => {
  const name = nameElement.value.trim();
  const email = emailElement.value.trim();
  const password = passwordElement1.value;
  const password2 = passwordElement2.value;

  // Validation
  if (!name || !email || !password || !password2) {
    showMessage(messageDisplay, 'All fields are required.', true);
    return;
  }

  if (!isValidEmail(email)) {
    showMessage(messageDisplay, 'Please enter a valid email address.', true);
    return;
  }

  if (password !== password2) {
    showMessage(messageDisplay, 'Passwords do not match.', true);
    return;
  }

  if (password.length < 8) {
    showMessage(messageDisplay, 'Password must be at least 8 characters long.', true);
    return;
  }

  // Optional: Enable for stronger password requirements
  // if (!isStrongPassword(password)) {
  //   showMessage(messageDisplay, 'Password must contain at least one uppercase letter, one lowercase letter, and one number.', true);
  //   return;
  // }

  if (!termsCheckbox.checked) {
    showMessage(messageDisplay, 'You must agree to the terms and conditions.', true);
    return;
  }

  // Loading state
  registerButton.disabled = true;
  const originalText = registerButton.textContent;
  registerButton.innerHTML = 'Creating account...';

  const details = { 
    name, 
    email, 
    password 
  };
  
  try {
    const data = await dataSubmit(details, url);

    // Show success message
    showMessage(messageDisplay, data.msg || 'Registration successful! Please check your email for verification.', false);

    // Store otp_id if provided
    if (data.otp_id) {
      localStorage.setItem('otp_id', data.otp_id);
    }

    // Store email for OTP verification page (useful for resend)
    if (email) {
      localStorage.setItem('registration_email', email);
    }

    // Clear form
    nameElement.value = '';
    emailElement.value = '';
    passwordElement1.value = '';
    passwordElement2.value = '';
    termsCheckbox.checked = false;

    // Redirect after delay
    setTimeout(() => {
      window.location.href = 'otp_verify.html';
    }, 3000); // Reduced from 4000ms for better UX

  } catch (error) {
    console.error('Registration error:', error); // For debugging
    
    // Handle specific error cases
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.status === 409) {
      errorMessage = error.data?.message || 'Email already registered. Please login instead.';
    } else if (error.status === 400) {
      errorMessage = error.data?.message || 'Invalid registration data.';
    } else if (error.status === 429) {
      errorMessage = 'Too many registration attempts. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showMessage(messageDisplay, errorMessage, true);
    
  } finally {
    registerButton.disabled = false;
    registerButton.innerHTML = originalText;
  }
};

// Optional: Add real-time password match validation for better UX
if (passwordElement2) {
  passwordElement2.addEventListener('input', () => {
    const password = passwordElement1.value;
    const confirmPassword = passwordElement2.value;
    
    if (confirmPassword.length > 0) {
      if (password === confirmPassword) {
        passwordElement2.style.borderColor = '#4caf50';
      } else {
        passwordElement2.style.borderColor = '#f44336';
      }
    } else {
      passwordElement2.style.borderColor = '';
    }
  });
}

// Optional: Clear styling when password changes
if (passwordElement1) {
  passwordElement1.addEventListener('input', () => {
    if (passwordElement2.value.length > 0) {
      if (passwordElement1.value === passwordElement2.value) {
        passwordElement2.style.borderColor = '#4caf50';
      } else {
        passwordElement2.style.borderColor = '#f44336';
      }
    }
  });
}