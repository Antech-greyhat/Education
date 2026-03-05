import { API_URL } from './config.js'
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';

const url = `${API_URL}/auth/verify`;

const boxes = document.querySelectorAll('.otp-box');
const displayMessage = document.querySelector('.js-otp-message');
const verifyButton = document.querySelector('.js-verify-otp-btn');
const resendOtpButton = document.querySelector('.js-resend-otp');

boxes.forEach((box, index) => {
    box.addEventListener('input', () => {
        if (box.value && index < boxes.length - 1) {
            boxes[index + 1].focus();
        }
        
        if (index === boxes.length - 1 && box.value) {
          verifyOtpInfo();
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

verifyButton.addEventListener('click', (event) => {
  verifyOtpInfo();
});

const verifyOtpInfo = async ()=>{
  
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
  
};

// OTP RESEND 
resendOtpButton.addEventListener('click', (event) => {
  otpResendInfo();
});

// OTP RESEND FUNCTION

const otpResendInfo = async () => {

  const otp_id = localStorage.getItem('otp_id');

  if (!otp_id) {
    showMessage(displayMessage, 'Missing required credentials', true);
    return;
  }

  const details = { otp_id };
  const url = `${API_URL}/auth/otp-resend`;
  const originalContent = resendOtpButton.innerHTML;
  resendOtpButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait';
  resendOtpButton.disabled = true;

  try {
    const data = await dataSubmit(details, url);
    showMessage(displayMessage, data.msg, false);

    if (data.otp_id) {
      localStorage.setItem('otp_id', data.otp_id);
      startCountdown(60 * 15);
    }

    startResendCountdown();

  } catch (err) {
    console.error('Error:', err);
    showMessage(displayMessage, err.message || 'An error occurred.', true);
    resendOtpButton.disabled = false; // re-enable

  } finally {
    resendOtpButton.innerHTML = originalContent;
  }

};

// COUNTDOWN TIMER
const countdownDisplay = document.querySelector('.js-countdown');

function startCountdown(duration) {
    const endTime = Date.now() + duration * 1000;
    localStorage.setItem('otp_expiry_time', endTime);
    runCountdown(endTime);
}

function runCountdown(endTime) {
    const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
        const secs = String(remaining % 60).padStart(2, '0');
        countdownDisplay.textContent = `${mins}:${secs}`;

        if (remaining <= 0) {
            clearInterval(interval);
            countdownDisplay.textContent = '00:00';
            showMessage(displayMessage, 'OTP expired. Please request a new one.', true);
        }
    }, 1000);
}

// Persist across refresh
const savedExpiry = localStorage.getItem('otp_expiry_time');
if (savedExpiry && Date.now() < savedExpiry) {
    runCountdown(Number(savedExpiry));
} else {
    startCountdown(15 * 60); // 15 min
}
