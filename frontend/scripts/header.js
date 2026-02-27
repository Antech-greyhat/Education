const headerElementDisplay = document.querySelector('.js-header-display'); 

headerElementDisplay.innerHTML = ''
const headerContents = ()=>{
  headerElementDisplay.innerHTML = `
  
<div class="container">
    <p class="online js-health-indicator offline"></p>
    <nav class="navbar">
        <a href="index.html" class="logo">
            <i class="fas fa-code"></i>
            <span>AntechLearn</span>
        </a>
        
        <ul class="nav-menu">
            <li class="nav-item"><a href="index.html" class="nav-link active">Home</a></li>
            <li class="nav-item"><a href="languages.html" class="nav-link">Languages</a></li>
            <li class="nav-item"><a href="guide.html" class="nav-link">Guide</a></li>
            <li class="nav-item"><a href="about.html" class="nav-link">About</a></li>
            <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
           <!--<li class="nav-item"><a href="admin.html" class="nav-link">Admin</a></li>-->
        </ul>
        
        <div class="nav-controls">
            <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark/light mode">
                <i class="fas fa-moon"></i>
            </button>
            
            <!-- FOR STATE MANAGEMENT -->
            
            <div style='display:flex; gap:3px;' class='js-authentication'>
              
            </div>
            
            <div class="hamburger" id="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>
</div>
  
  `
};
headerContents();

const authDiv = document.querySelector('.js-authentication');

function renderAuthButtons() {
  const token = localStorage.getItem('access_token');

  if (token) {
    // Logged in
    authDiv.innerHTML = `
      <button class="btn btn-secondary nav-btn js-logout-btn">
        Logout
      </button>
    `;

    document.querySelector('.js-logout-btn').addEventListener('click', () => {
      localStorage.removeItem('access_token');
      window.location.href = 'login.html';
    });

  } else {
    // Not logged in
    authDiv.innerHTML = `
      <a href="login.html" class="btn btn-secondary nav-btn">Log In</a>
      <a href="register.html" class="btn btn-primary nav-btn">Register</a>
    `;
  }
}

renderAuthButtons();