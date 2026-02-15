// FOOTER CONTENTS

const newsletterContainer = document.querySelector('.js-footer-information'); 

newsletterContainer.innerHTML = ''
const footerContent = ()=>{
  newsletterContainer.innerHTML = `
  
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <a href="index.html" class="logo">
                <i class="fas fa-code"></i>
                <span>AntechLearn</span>
            </a>
            <p class="footer-tagline">Empowering the next generation of developers through accessible, high-quality programming education.</p>
            <div class="social-links">
              <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
              <a href="https://github.com/Antech-greyhat" aria-label="GitHub"><i class="fab fa-github" target="_blank"></i></a>
              <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
              
          <div class="footer-links">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="languages.html">Languages</a></li>
                <li><a href="guide.html">Learning Guide</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          
          <div class="footer-links">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Code Examples</a></li>
              <li><a href="#">Practice Exercises</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
          
          <div class="footer-newsletter">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for new tutorials and updates.</p>
            
            <!-- CHANGED FROM FORM TAG TO DIV TO AVOID PAGE RELOAD -->
            <p class="message-display js-message-display">
                <!-- FOR RESPONSE -->
                </p>
            <div class="newsletter-form">
                <input type="email" placeholder="Your email address" required class="js-newsletter-input">
                <button type="button" class="js-news-button">Subscribe</button>
              </div>
          </div>
        </div>
          
        <div class="footer-bottom">
          <p>&copy; <span id="currentYear"></span> AntechLearn. All rights reserved. Made with <i class="fas fa-heart"></i> for aspiring developers.</p>
        </div>
      </div>
  
  ` 
};

footerContent();
