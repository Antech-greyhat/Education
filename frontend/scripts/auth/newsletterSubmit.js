import { API_URL } from './config.js';
import { showMessage } from '../msgDisplay.js';

const newsletterForm = document.getElementById('newsletterForm');
const newsletterSubject = document.getElementById('newsletterSubject');
const newsletterContent = document.getElementById('newsletterContent');
const sendButton = newsletterForm?.querySelector('button[type="submit"]');

let messageDisplay = document.querySelector('.js-admin-message');
if (!messageDisplay) {
  messageDisplay = document.createElement('div');
  messageDisplay.className = 'js-admin-message admin-message';
  document.querySelector('.admin-section')?.prepend(messageDisplay);
}

async function sendNewsletter(event) {
  event.preventDefault();

  const subject = newsletterSubject.value.trim();
  const body = newsletterContent.value.trim();

  if (!subject) {
    showMessage(messageDisplay, 'Subject is required.', true);
    return;
  }

  if (!body) {
    showMessage(messageDisplay, 'Message body is required.', true);
    return;
  }

  const token = localStorage.getItem('admin_token');

  if (!token) {
    showMessage(messageDisplay, 'Unauthorized. Please log in again.', true);
    return;
  }

  const originalContent = sendButton.innerHTML;
  sendButton.disabled = true;
  sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

  try {
    // Step 1 — Create the update
    const createRes = await fetch(`${API_URL}/admin/updates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ subject, body })
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      showMessage(messageDisplay, createData.message || 'Failed to create newsletter.', true);
      return;
    }

    const updateId = createData.update?.id;

    if (!updateId) {
      showMessage(messageDisplay, 'Failed to create newsletter. Try again.', true);
      return;
    }

    sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Step 2 — Send the update to all subscribers
    const sendRes = await fetch(`${API_URL}/admin/updates/${updateId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const sendData = await sendRes.json();

    if (!sendRes.ok) {
      showMessage(messageDisplay, sendData.message || 'Failed to send newsletter.', true);
      return;
    }

    showMessage(
      messageDisplay,
      `Newsletter sent to ${sendData.recipient_count} subscriber(s) successfully!`,
      false
    );

    newsletterSubject.value = '';
    newsletterContent.value = '';

  } catch (error) {
    console.error('Newsletter error:', error);
    showMessage(messageDisplay, 'An error occurred. Please try again.', true);

  } finally {
    sendButton.disabled = false;
    sendButton.innerHTML = originalContent;
  }
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', sendNewsletter);
}
