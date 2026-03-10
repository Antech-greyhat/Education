// scripts/auth/dataDisplay.js

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
  
  // Update stat cards with animation
  animateNumber(totalMessages, data.messages.length);
  animateNumber(totalUsers, data.users.length);
  animateNumber(totalNewsletter, data.subscribers.length);
  animateNumber(totalAdmins, data.admins.length);
  
  // Render tables
  displayMessagesTable();
  displayUsersTable();
  displaySubscribersTable();
  displayAdminsTable();
  
  // Setup pagination buttons
  setupPaginationListeners();
};

// Animate numbers counting up
function animateNumber(element, finalValue) {
  if (!element) return;
  
  let current = 0;
  const increment = finalValue / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= finalValue) {
      element.textContent = finalValue;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 20);
}

// ========== MESSAGES TABLE ==========
function displayMessagesTable() {
  const tbody = document.querySelector('#messagesTable tbody');
  if (!tbody || !allData.messages) return;
  
  const { current, itemsPerPage } = paginationState.messages;
  const start = (current - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = allData.messages.slice(start, end);
  
  if (pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center" style="padding: 40px;">
          <i class="fas fa-inbox" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
          <p>No messages found</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = pageData.map(msg => `
    <tr class="${!msg.read ? 'unread-row' : ''}">
      <td><span class="badge-id">#${msg.id}</span></td>
      <td><strong>${msg.first_name} ${msg.last_name}</strong></td>
      <td><a href="mailto:${msg.email}" class="email-link">${msg.email}</a></td>
      <td>${msg.subject || 'No subject'}</td>
      <td class="message-preview">${msg.message.substring(0, 50)}${msg.message.length > 50 ? '...' : ''}</td>
      <td><span class="date-badge"><i class="far fa-calendar"></i> ${formatDate(msg.sent_at)}</span></td>
      <td>
        <div class="actions-cell">
          <button class="action-btn view-btn" onclick="viewMessage(${msg.id})" title="View message">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn delete-btn" onclick="deleteMessage(${msg.id})" title="Delete message">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
      <td>
        <span class="status-badge ${!msg.read ? 'status-unread' : 'status-read'}">
          <i class="fas ${!msg.read ? 'fa-circle' : 'fa-check-circle'}"></i>
          ${!msg.read ? 'Unread' : 'Read'}
        </span>
      </td>
    </tr>
  `).join('');
  
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
  
  if (pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center" style="padding: 40px;">
          <i class="fas fa-users-slash" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
          <p>No users found</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = pageData.map(user => `
    <tr>
      <td><span class="badge-id">#${user.id}</span></td>
      <td><i class="fas fa-user-circle" style="color: #667eea; margin-right: 5px;"></i> ${user.full_name}</td>
      <td><a href="mailto:${user.email}" class="email-link">${user.email}</a></td>
      <td><span class="date-badge"><i class="far fa-calendar"></i> ${formatDate(user.created_at)}</span></td>
    </tr>
  `).join('');
  
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
  
  if (pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center" style="padding: 40px;">
          <i class="fas fa-envelope-open" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
          <p>No subscribers found</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = pageData.map(sub => `
    <tr>
      <td><span class="badge-id">#${sub.id}</span></td>
      <td><i class="fas fa-envelope" style="color: #667eea; margin-right: 5px;"></i> ${sub.email}</td>
      <td><span class="date-badge"><i class="far fa-calendar"></i> ${formatDate(sub.subscribed_at)}</span></td>
    </tr>
  `).join('');
  
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
  
  if (pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center" style="padding: 40px;">
          <i class="fas fa-user-shield" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
          <p>No admins found</p>
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = pageData.map(admin => `
    <tr>
      <td><span class="badge-id">#${admin.id}</span></td>
      <td><i class="fas fa-user-tie" style="color: #667eea; margin-right: 5px;"></i> ${admin.email}</td>
      <td><span class="date-badge"><i class="far fa-calendar"></i> ${formatDate(admin.joined_at)}</span></td>
    </tr>
  `).join('');
  
  updatePaginationControls('admins');
}

// ========== PAGINATION ==========
function updatePaginationControls(section) {
  const totalItems = allData[section]?.length || 0;
  const itemsPerPage = paginationState[section].itemsPerPage;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const current = paginationState[section].current;
  
  const pageInfo = document.querySelector(`[data-pagination="${section}"]`);
  if (pageInfo) {
    pageInfo.innerHTML = `<i class="fas fa-book-open"></i> Page ${current} of ${totalPages || 1}`;
  }
  
  const prevBtn = document.querySelector(`[data-action="prev-${section}"]`);
  if (prevBtn) prevBtn.disabled = current === 1;
  
  const nextBtn = document.querySelector(`[data-action="next-${section}"]`);
  if (nextBtn) nextBtn.disabled = current === totalPages || totalPages === 0;
}

function setupPaginationListeners() {
  const sections = ['messages', 'users', 'subscribers', 'admins'];
  
  sections.forEach(section => {
    const prevBtn = document.querySelector(`[data-action="prev-${section}"]`);
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (paginationState[section].current > 1) {
          paginationState[section].current--;
          refreshTable(section);
        }
      });
    }
    
    const nextBtn = document.querySelector(`[data-action="next-${section}"]`);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalItems = allData[section]?.length || 0;
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (err) {
    return dateString;
  }
}

// Message action handlers
window.viewMessage = (messageId) => {
  const message = allData.messages.find(m => m.id === messageId);
  if (!message) return;
  
  alert(`Message from ${message.first_name} ${message.last_name}:\n\n${message.message}`);
  // add modal here
};

window.deleteMessage = (messageId) => {
  if (confirm('Are you sure you want to delete this message?')) {
    allData.messages = allData.messages.filter(m => m.id !== messageId);
    displayMessagesTable();
  }
};