import { API_URL } from './config.js';
import { dataSubmit } from './dataSubmit.js';

const url = `${API_URL}/auth/tinnymce`;

async function getTinymceToken() {
  try {
    const data = await dataSubmit({}, url, localStorage.getItem('access_token'));
    return data.tinnymce_token;
  } catch (error) {
    console.error('Error fetching TinyMCE token:', error);
    throw error;
  }
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
});
