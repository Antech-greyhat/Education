import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';
import { showMessage } from '../msgDisplay.js';
const messagwDisplay = document.querySelector('.js-message-display');

const generateUrl = `${API_URL}/auth/generate`;

async function generateNewsletterContent(promptText) {
  return await dataSubmit(
    { prompt: promptText },
    generateUrl,
    localStorage.getItem('admin_token')
  );
}

document.addEventListener('DOMContentLoaded', () => {
  tinymce.init({
    selector: '#newsletterContent',
    height: 400,
    menubar: true,
    plugins: [
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists',
      'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
    ],
    toolbar:
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
      'link media table | align lineheight | ' +
      'numlist bullist indent outdent | emoticons charmap | removeformat',
    setup(editor) {
      editor.on('init', () => {
        console.log('TinyMCE initialized successfully');
      });
    }
  });

  // AI Generate button
  const aiBtn = document.getElementById('aiGenerateBtn');
  if (aiBtn) {
    aiBtn.addEventListener('click', async () => {
      const promptText = document.getElementById('aiPromptInput').value.trim();
      if (!promptText) {
        showMessage(messagwDisplay, 'Enter a prompt to generate the news letter', true);
        return;
      };

      aiBtn.textContent = '⏳ Generating...';
      aiBtn.disabled = true;

      try {
        const data = await generateNewsletterContent(promptText);
        tinymce.get('newsletterContent').setContent(data.content);
      } catch (err) {
        console.error('AI generation failed:', err);
      } finally {
        aiBtn.textContent = '✨ Generate';
        aiBtn.disabled = false;
      }
    });
  }
});
