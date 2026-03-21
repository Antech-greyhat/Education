let messageTimeout;

export function showMessage(messageDisplay, msg, isError = true) {
  if (messageTimeout) clearTimeout(messageTimeout);

  messageDisplay.textContent = msg;
  messageDisplay.style.color = isError ? '#dc3545' : '#28a745';
  messageDisplay.style.display = 'block';

  messageTimeout = setTimeout(() => {
    messageDisplay.textContent = '';
    messageDisplay.style.display = 'none';
  }, 5000);
}
