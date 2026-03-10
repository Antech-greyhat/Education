import { coursesData } from './courseData.js';
import { checkAuth } from '../auth/guard.js';

export class CourseRenderer {
  constructor(containerId, filterContainerId) {
    this.container = document.getElementById(containerId);
    this.filterContainer = document.getElementById(filterContainerId);
    this.courses = [];
    this.activeCategory = 'all';
    this.messageDisplay = this.createMessageDisplay();
    this.init();
  }

  createMessageDisplay() {
    let msgDiv = document.querySelector('.js-courses-message');
    if (!msgDiv) {
      msgDiv = document.createElement('div');
      msgDiv.className = 'js-courses-message courses-message';
      msgDiv.style.display = 'none';
      document.querySelector('.courses-page')?.prepend(msgDiv);
    }
    return msgDiv;
  }

  async init() {
    const spinner = document.getElementById('spinner-container');
    const content = document.getElementById('page-content');

    const token = localStorage.getItem('access_token');
    const auth = await checkAuth(token, this.messageDisplay);

    if (!auth.valid) {
      window.location.href = auth.redirect || 'login.html';
      return;
    }

    this.courses = coursesData;

    if (spinner && content) {
      spinner.style.opacity = '0';
      setTimeout(() => {
        spinner.style.display = 'none';
        content.style.display = 'block';
        this.renderFilters();
        this.renderCourses(this.courses);
        this.setupSearch();
      }, 500);
    } else {
      this.renderFilters();
      this.renderCourses(this.courses);
      this.setupSearch();
    }
  }

  renderFilters() {
    if (!this.filterContainer) return;
    this.filterContainer.innerHTML = '';

    const allBtn = this.createFilterButton('all', 'All Courses');
    this.filterContainer.appendChild(allBtn);

    const uniqueCategories = [...new Set(this.courses.map(course => course.category))];
    uniqueCategories.forEach(category => {
      const btn = this.createFilterButton(category, category);
      this.filterContainer.appendChild(btn);
    });

    this.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeCategory = e.target.dataset.category;
        this.updateActiveFilter();
        this.filterCourses();
      });
    });
  }

  createFilterButton(category, text) {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${category === 'all' ? 'active' : ''}`;
    btn.dataset.category = category;
    btn.textContent = text;
    return btn;
  }

  updateActiveFilter() {
    this.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === this.activeCategory) {
        btn.classList.add('active');
      }
    });
  }

  filterCourses() {
    if (this.activeCategory === 'all') {
      this.renderCourses(this.courses);
    } else {
      const filtered = this.courses.filter(course => course.category === this.activeCategory);
      this.renderCourses(filtered);
    }
  }

  setupSearch() {
    const searchInput = document.getElementById('mainSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = this.courses.filter(course =>
          course.courseName.toLowerCase().includes(searchTerm) ||
          course.tutor.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm)
        );
        this.renderCourses(filtered);
      });
    }
  }

  renderCourses(courses) {
    const grid = document.getElementById('languages-grid');
    if (!grid) return;

    if (courses.length === 0) {
      grid.innerHTML = `
        <div class="no-courses">
          <i class="fas fa-search"></i>
          <h3>No courses found</h3>
          <p>Try adjusting your search or filter</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = courses.map(course => this.createCourseCard(course)).join('');
  }

  createCourseCard(course) {
    const paidBadge = course.paid
      ? `<span class="course-badge paid">Paid</span>`
      : `<span class="course-badge free">Free</span>`;

    return `
      <div class="language-card" data-category="${course.category}">
        <div class="card-video">
          <iframe
            src="${course.embedUrl}"
            title="${course.courseName}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            loading="lazy">
          </iframe>
        </div>
        <div class="card-body">
          <div class="card-header">
            <h3 class="card-title">${course.courseName}</h3>
            ${paidBadge}
          </div>
          <p class="card-description">${course.description}</p>
          <div class="card-details">
            <p><i class="fas fa-chalkboard-teacher"></i> <strong>Tutor:</strong> ${course.tutor}</p>
            <p><i class="fas fa-clock"></i> <strong>Duration:</strong> ${course.duration}</p>
            <p><i class="fas fa-layer-group"></i> <strong>Level:</strong> ${course.level}</p>
            <p><i class="fas fa-star"></i> <strong>Rating:</strong> ${course.rating} ⭐ (${course.students})</p>
          </div>
          <div class="card-actions">
            <a href="${course.externalUrl}" class="card-link external" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-external-link-alt"></i> Open Externally
            </a>
            <button class="card-btn download" disabled title="Download coming soon">
              <i class="fas fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getIconForCategory(category) {
    const icons = {
      'HTML & CSS': 'html5',
      'JavaScript': 'js',
      'TypeScript': 'js',
      'Python': 'python',
      'React': 'react',
      'Vue.js': 'vuejs',
      'Angular': 'angular',
      'Node.js': 'node',
      'Express.js': 'node',
      'Next.js': 'react',
      'Flask': 'python',
      'Django': 'python',
      'FastAPI': 'python',
      'Full Stack': 'code',
      'Databases': 'database',
      'MongoDB': 'leaf',
      'SQL': 'database',
      'Git & Version Control': 'git-alt',
      'Docker & Kubernetes': 'docker',
      'AWS & Cloud': 'aws',
      'Go Language': 'code',
      'Rust': 'code',
      'Java': 'java',
      'Swift/iOS': 'swift',
      'Kotlin/Android': 'android',
      'Flutter': 'code',
      'React Native': 'react'
    };
    return icons[category] || 'code';
  }
}
