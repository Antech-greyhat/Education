import { coursesData } from './courseData.js';

export class CourseRenderer {
  constructor(containerId, filterContainerId) {
    this.container = document.getElementById(containerId);
    this.filterContainer = document.getElementById(filterContainerId);
    this.courses = [];
    this.filteredCourses = [];
    this.activeCategory = 'all';
    this.currentPage = 1;
    this.perPage = 20;
    this.init();
  }

  init() {
    const spinner = document.getElementById('spinner-container');
    const content = document.getElementById('page-content');

    this.courses = coursesData;
    this.filteredCourses = coursesData;

    if (spinner && content) {
      spinner.style.opacity = '0';
      setTimeout(() => {
        spinner.style.display = 'none';
        content.style.display = 'block';
        this.renderFilters();
        this.renderPage();
        this.setupSearch();
        this.injectVideoModal();
      }, 500);
    } else {
      this.renderFilters();
      this.renderPage();
      this.setupSearch();
      this.injectVideoModal();
    }
  }

  // ── VIDEO MODAL ──

  injectVideoModal() {
    if (document.getElementById('videoModal')) return;

    const modal = document.createElement('div');
    modal.id = 'videoModal';
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal__backdrop" onclick="closeVideoModal()"></div>
      <div class="video-modal__card">
        <div class="video-modal__header">
          <h3 class="video-modal__title" id="videoModalTitle"></h3>
          <button class="video-modal__close" onclick="closeVideoModal()">
            <i class="fas fa-xmark"></i>
          </button>
        </div>
        <div class="video-modal__player">
          <iframe
            id="videoModalFrame"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeVideoModal();
    });
  }

  // ── FILTERS ──

  renderFilters() {
    if (!this.filterContainer) return;
    this.filterContainer.innerHTML = '';

    const allBtn = this.createFilterButton('all', 'All Courses');
    this.filterContainer.appendChild(allBtn);

    const uniqueCategories = [...new Set(this.courses.map(c => c.category))];
    uniqueCategories.forEach(category => {
      this.filterContainer.appendChild(this.createFilterButton(category, category));
    });

    this.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeCategory = e.target.dataset.category;
        this.currentPage = 1;
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
      btn.classList.toggle('active', btn.dataset.category === this.activeCategory);
    });
  }

  filterCourses() {
    this.filteredCourses = this.activeCategory === 'all'
      ? this.courses
      : this.courses.filter(c => c.category === this.activeCategory);
    this.renderPage();
  }

  // ── SEARCH ──

  setupSearch() {
    const searchInput = document.getElementById('mainSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      this.currentPage = 1;
      this.filteredCourses = this.courses.filter(c =>
        c.courseName.toLowerCase().includes(term) ||
        c.tutor.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
      );
      this.renderPage();
    });
  }

  // ── PAGINATION ──

  get totalPages() {
    return Math.ceil(this.filteredCourses.length / this.perPage);
  }

  getPageCourses() {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredCourses.slice(start, start + this.perPage);
  }

  renderPage() {
    this.renderCourses(this.getPageCourses());
    this.renderPagination();
  }

  renderPagination() {
    const existing = document.getElementById('pagination');
    if (existing) existing.remove();

    if (this.totalPages <= 1) return;

    const grid = document.getElementById('languages-grid');
    if (!grid) return;

    const nav = document.createElement('div');
    nav.id = 'pagination';
    nav.className = 'pagination';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination__btn';
    prevBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Previous';
    prevBtn.disabled = this.currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    const indicator = document.createElement('span');
    indicator.className = 'pagination__indicator';
    indicator.textContent = `Page ${this.currentPage} of ${this.totalPages}`;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination__btn pagination__btn--next';
    nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    nextBtn.disabled = this.currentPage === this.totalPages;
    nextBtn.addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    nav.appendChild(prevBtn);
    nav.appendChild(indicator);
    nav.appendChild(nextBtn);

    grid.insertAdjacentElement('afterend', nav);
  }

  // ── RENDER COURSES ──

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

    grid.innerHTML = courses.map(c => this.createCourseCard(c)).join('');

    // Trigger reveal on rendered cards
    grid.querySelectorAll('.language-card').forEach((card, i) => {
      card.classList.add('reveal');
      if (i % 4 === 1) card.classList.add('reveal-delay-1');
      if (i % 4 === 2) card.classList.add('reveal-delay-2');
      if (i % 4 === 3) card.classList.add('reveal-delay-3');
      // Re-observe with the global scroll reveal
      if (window.__revealObserver) window.__revealObserver.observe(card);
    });
  }

  createCourseCard(course) {
    const paidBadge = course.paid
      ? `<span class="course-badge paid">Paid</span>`
      : `<span class="course-badge free">Free</span>`;

    return `
      <div class="language-card" data-category="${course.category}">
        <div class="card-thumbnail" onclick="openVideoModal('${course.embedUrl}', '${course.courseName.replace(/'/g, "\'")}')">
          <img
            src="${course.thumbnail}"
            alt="${course.courseName}"
            loading="lazy"
            onerror="this.src='https://img.youtube.com/vi/default/maxresdefault.jpg'">
          <div class="card-thumbnail__play">
            <i class="fas fa-play"></i>
          </div>
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
      'HTML & CSS': 'html5', 'JavaScript': 'js', 'TypeScript': 'js',
      'Python': 'python', 'React': 'react', 'Vue.js': 'vuejs',
      'Angular': 'angular', 'Node.js': 'node', 'Express.js': 'node',
      'Next.js': 'react', 'Flask': 'python', 'Django': 'python',
      'FastAPI': 'python', 'Full Stack': 'code', 'Databases': 'database',
      'MongoDB': 'leaf', 'SQL': 'database', 'Git & Version Control': 'git-alt',
      'Docker & Kubernetes': 'docker', 'AWS & Cloud': 'aws',
      'Go Language': 'code', 'Rust': 'code', 'Java': 'java',
      'Swift/iOS': 'swift', 'Kotlin/Android': 'android',
      'Flutter': 'code', 'React Native': 'react'
    };
    return icons[category] || 'code';
  }
}

// ── GLOBAL MODAL HANDLERS ──

window.openVideoModal = (embedUrl, title) => {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoModalFrame');
  const titleEl = document.getElementById('videoModalTitle');

  if (!modal || !frame) return;

  frame.src = embedUrl + '?autoplay=1&rel=0';
  if (titleEl) titleEl.textContent = title;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeVideoModal = () => {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoModalFrame');

  if (!modal) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Stop video by clearing src
  setTimeout(() => { if (frame) frame.src = ''; }, 300);
};
