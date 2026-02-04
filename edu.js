// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.getElementById('searchInput');
const mainSearch = document.getElementById('mainSearch');
const searchBtn = document.getElementById('searchBtn');
const mainSearchBtn = document.getElementById('mainSearchBtn');
const searchTags = document.querySelectorAll('.search-tag');
const languageCards = document.querySelectorAll('.language-card');
const currentYear = document.getElementById('currentYear');

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Close menu when clicking a link
    if (navMenu.classList.contains('active')) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Search Functionality
function performSearch(searchText) {
    if (!searchText.trim()) return;
    
    const searchLower = searchText.toLowerCase();
    
    // Highlight matching language cards
    languageCards.forEach(card => {
        const language = card.getAttribute('data-language');
        const cardTitle = card.querySelector('.card-title').textContent;
        const cardDescription = card.querySelector('.card-description').textContent;
        
        const cardText = (language + ' ' + cardTitle + ' ' + cardDescription).toLowerCase();
        
        if (cardText.includes(searchLower)) {
            card.style.boxShadow = '0 0 0 3px var(--primary-color)';
            card.style.transform = 'scale(1.02)';
            
            // Scroll to the language section
            document.getElementById('languages').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            card.style.boxShadow = '';
            card.style.transform = '';
        }
    });
    
    // Show search feedback
    showSearchFeedback(searchText);
}

function showSearchFeedback(searchText) {
    // Create or update feedback element
    let feedback = document.getElementById('searchFeedback');
    
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'searchFeedback';
        feedback.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(feedback);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    feedback.textContent = `Searching for: "${searchText}"`;
    
    // Remove feedback after 3 seconds
    setTimeout(() => {
        if (feedback) {
            feedback.style.animation = 'slideOut 0.3s ease forwards';
            
            // Add slideOut animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                if (feedback && feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }
    }, 3000);
}

// Filter language cards by search tag
function filterByTag(searchTerm) {
    mainSearch.value = searchTerm;
    performSearch(searchTerm);
}

// Set current year in footer
function setCurrentYear() {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            // Don't interfere with language page links
            if (href.includes('.html')) return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Set current year
    setCurrentYear();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Search functionality
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    mainSearchBtn.addEventListener('click', () => performSearch(mainSearch.value));
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(searchInput.value);
    });
    
    mainSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch(mainSearch.value);
    });
    
    // Search tags
    searchTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchTerm = tag.getAttribute('data-search');
            filterByTag(searchTerm);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Initialize language cards with hover effect
    languageCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s ease';
        });
        
        // Add click effect
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('card-link')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email && email.includes('@')) {
                alert(`Thank you for subscribing with: ${email}\nYou'll receive updates soon!`);
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
    
    // Add active class to current nav link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if (navLink) {
                    document.querySelectorAll('.nav-link.active').forEach(link => {
                        link.classList.remove('active');
                    });
                    navLink.classList.add('active');
                }
            }
        });
    });
});