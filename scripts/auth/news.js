// Inputs
const emailInput = document.querySelectorAll('.js-newsletter-input');

// button
const emailButton = document.querySelectorAll('.js-news-button')

emailButton.forEach((btn)=>{
  btn.addEventListener('click',()=>{
    emailInput.forEach((email)=>{
      const emailValue = email.velue;
      console.log(emailValue);
    })
  });
});