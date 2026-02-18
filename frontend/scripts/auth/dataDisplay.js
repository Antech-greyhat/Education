const totalMessages = document.querySelector('.js-total-messages');
const totalUsers = document.querySelector('.js-total-users');
const totalNewsletter = document.querySelector('.js-total-subscribers');


let messagesValue = 0;
let usersValue = 0;
let subscribersValue = 0;

export const dataDisplay = (data) =>{
  
  //  MESSAGE DISPLAY
  data.messages.forEach((message)=>{
    messagesValue++;
    console.log(message.first_name);
  });
  totalMessages.innerHTML = messagesValue;
  
  
  // USERS DISPLAY 
  data.users.forEach((user)=>{
    usersValue++;
  });
  
  totalUsers.innerHTML = usersValue;
  
  
  // NEWSLETTER DISPLAY
  
  data.subscribers.forEach((subscribers)=>{
    subscribersValue++;
    
  });
  
  totalNewsletter.innerHTML = subscribersValue;
  
};