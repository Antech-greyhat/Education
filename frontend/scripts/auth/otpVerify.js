import { API_URL } from './config.js'
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';

const url = `${API_URL}/auth/verify`;

const boxes = document.querySelectorAll('.otp-box');
const displayMessage = document.querySelector('.js-otp-message');

boxes.forEach((box, index) => {
    box.addEventListener('input', () => {
        if (box.value && index < boxes.length - 1) {
            boxes[index + 1].focus();
        }
    });

    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && index > 0) {
            boxes[index - 1].focus();
        }
    });
});

function getOtp() {
    return [...boxes].map(box => box.value).join('');
}

const verifyButton = document.querySelector('.js-verify-otp-btn');

verifyButton.addEventListener('click', async ()=>{
  
  const otp = getOtp();
  const otp_id = localStorage.getItem('otp_id');
  
  if (!otp || !otp_id) {
    showMessage(displayMessage, 'Invalid credential.', true);
    return;
  }
  
  const details = {otp_id, otp};
  
  const originalContent = verifyButton.innerHTML;
  verifyButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
  verifyButton.disabled = true;
  
  try {
    const data = await dataSubmit(details, url);
    showMessage(displayMessage, data.msg, false);
    
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.removeItem('otp_id');
      
      setTimeout(() => {
          window.location.href = 'languages.html';
      }, 2000);
    }
    
  } catch (err) {
    
    showMessage(displayMessage, 'Verification failed, try again.', true);
    console.error('Error:', err);
    
  } finally {
    verifyButton.innerHTML = originalContent;
    verifyButton.disabled = false;
  }
});