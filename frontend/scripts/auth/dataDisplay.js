// Stat card elements
const totalMessages = document.querySelector('.js-total-messages');
const totalUsers = document.querySelector('.js-total-users');
const totalNewsletter = document.querySelector('.js-total-subscribers');
const totalAdmins = document.querySelector('.js-total-admins');

// Pagination state
let paginationState = {
  messages: { current: 1, itemsPerPage: 10 },
  users: { current: 1, itemsPerPage: 10 },
  subscribers: { current: 1, itemsPerPage: 10 },
  admins: { current: 1, itemsPerPage: 10 }
};

// Store data globally
let allData = {};

export const dataDisplay = (data) => {
  allData = data;
  
  // Update stat cards with actual counts
  if (totalMessages) totalMessages.innerHTML = data.messages.length;
  if (totalUsers) totalUsers.innerHTML = data.users.length;
  if (totalNewsletter) totalNewsletter.innerHTML = data.subscribers.length;
  if (totalAdmins) totalAdmins.innerHTML = data.admins.length;
  
  // Render tables
  displayMessagesTable();
  displayUsersTable();
  displaySubscribersTable();
  displayAdminsTable();
  
  // Setup pagination buttons
  setupPaginationListeners();
};

// ========== MESSAGES TABLE ==========
function displayMessagesTable() {
  const tbody = document.querySelector('#messagesTable tbody');
  if (!tbody || !allData.messages) return;
  
  const { current, itemsPerPage } = paginationState.messages;
  const start = (current - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = allData.messages.slice(start, end);
  
  tbody.innerHTML = pageData.map(msg => `
    <tr>
      <td>${msg.id}</td>
      <td>${msg.first_name} ${msg.last_name}</td>
      <td>${msg.email}</td>
      <td>${msg.subject}</td>
      <td style="min-width:300px;">${msg.message}</td>
      <td style="min-width:150px;">${formatDate(msg.sent_at)}</td>
      <td style='display:flex; flex-direction:column; gap:5px;'>
      <button style="border:none; border-radius:5px; background-color:green; min-width:70px; color:white; padding:3px;">Mark read</button>
      
      <button style="border:none; border-radius:5px; background-color:red; min-width:70px; color:white; padding:3px;">Delete</button>
      </td>
      <td class="" style="color:#b1b840;">Unread</td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align: center; padding: 20px;">No messages found</td></tr>';
  
  updatePaginationControls('messages');
}

// ========== USERS TABLE ==========
function displayUsersTable() {
  const tbody = document.querySelector('#usersTable tbody');
  if (!tbody || !allData.users) return;
  
  const { current, itemsPerPage } = paginationState.users;
  const start = (current - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = allData.users.slice(start, end);
  
  tbody.innerHTML = pageData.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.full_name}</td>
      <td>${user.email}</td>
      <td>${formatDate(user.created_at)}</td>
    </tr>
  `).join('') || '<tr><td colspan="4" style="text-align: center; padding: 20px;">No users found</td></tr>';
  
  updatePaginationControls('users');
}

// ========== SUBSCRIBERS TABLE ==========
function displaySubscribersTable() {
  const tbody = document.querySelector('#subscribersTable tbody');
  if (!tbody || !allData.subscribers) return;
  
  const { current, itemsPerPage } = paginationState.subscribers;
  const start = (current - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = allData.subscribers.slice(start, end);
  
  tbody.innerHTML = pageData.map(sub => `
    <tr>
      <td>${sub.id}</td>
      <td>${sub.email}</td>
      <td>${formatDate(sub.subscribed_at)}</td>
    </tr>
  `).join('') || '<tr><td colspan="3" style="text-align: center; padding: 20px;">No subscribers found</td></tr>';
  
  updatePaginationControls('subscribers');
}

// ========== ADMINS TABLE ==========
function displayAdminsTable() {
  const tbody = document.querySelector('#adminsTable tbody');
  if (!tbody || !allData.admins) return;
  
  const { current, itemsPerPage } = paginationState.admins;
  const start = (current - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = allData.admins.slice(start, end);
  
  tbody.innerHTML = pageData.map(admin => `
    <tr>
      <td>${admin.id}</td>
      <td>${admin.email}</td>
      <td>${formatDate(admin.joined_at)}</td>
    </tr>
  `).join('') || '<tr><td colspan="3" style="text-align: center; padding: 20px;">No admins found</td></tr>';
  
  updatePaginationControls('admins');
}

// ========== PAGINATION ==========
function updatePaginationControls(section) {
  const totalItems = allData[section].length;
  const itemsPerPage = paginationState[section].itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const current = paginationState[section].current;
  
  // Update page info
  const pageInfo = document.querySelector(`[data-pagination="${section}"]`);
  if (pageInfo) {
    pageInfo.textContent = `Page ${current} of ${totalPages || 1}`;
  }
  
  // Enable/Disable prev button
  const prevBtn = document.querySelector(`[data-action="prev-${section}"]`);
  if (prevBtn) {
    prevBtn.disabled = current === 1;
  }
  
  // Enable/Disable next button
  const nextBtn = document.querySelector(`[data-action="next-${section}"]`);
  if (nextBtn) {
    nextBtn.disabled = current === totalPages;
  }
}

function setupPaginationListeners() {
  const sections = ['messages', 'users', 'subscribers', 'admins'];
  
  sections.forEach(section => {
    // Previous button
    const prevBtn = document.querySelector(`[data-action="prev-${section}"]`);
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (paginationState[section].current > 1) {
          paginationState[section].current--;
          refreshTable(section);
        }
      });
    }
    
    // Next button
    const nextBtn = document.querySelector(`[data-action="next-${section}"]`);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalItems = allData[section].length;
        const itemsPerPage = paginationState[section].itemsPerPage;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (paginationState[section].current < totalPages) {
          paginationState[section].current++;
          refreshTable(section);
        }
      });
    }
  });
}

function refreshTable(section) {
  const displayFunctions = {
    messages: displayMessagesTable,
    users: displayUsersTable,
    subscribers: displaySubscribersTable,
    admins: displayAdminsTable
  };
  
  if (displayFunctions[section]) {
    displayFunctions[section]();
  }
}

// ========== UTILITIES ==========
function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (err) {
    return dateString;
  }
}