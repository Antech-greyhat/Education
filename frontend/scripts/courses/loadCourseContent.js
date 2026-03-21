import { checkAuth } from '../auth/guard.js';
import { CourseRenderer } from './courseRender.js';

async function loadCoursesPage() {
  const token = localStorage.getItem('access_token');

  let messageDisplay = document.querySelector('.js-courses-message');
  if (!messageDisplay) {
    messageDisplay = document.createElement('div');
    messageDisplay.className = 'js-courses-message courses-message';
    document.querySelector('.courses-page')?.prepend(messageDisplay);
  }

  const auth = await checkAuth(token, messageDisplay);

  if (!auth.valid) {
    window.location.href = auth.redirect || 'login.html';
    return;
  }

  new CourseRenderer('languages-grid', 'filterContainer');
}

document.addEventListener('DOMContentLoaded', loadCoursesPage);
