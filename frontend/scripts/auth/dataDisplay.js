// scripts/auth/dataDisplay.js

const totalMessages   = document.querySelector('.js-total-messages');
const totalUsers      = document.querySelector('.js-total-users');
const totalNewsletter = document.querySelector('.js-total-subscribers');
const totalAdmins     = document.querySelector('.js-total-admins');

let paginationState = {
  messages:    { current: 1, itemsPerPage: 10 },
  users:       { current: 1, itemsPerPage: 10 },
  subscribers: { current: 1, itemsPerPage: 10 },
  admins:      { current: 1, itemsPerPage: 10 }
};

let allData = {};

export const dataDisplay = (data) => {
  allData = data;

  animateNumber(totalMessages,   data.messages.length);
  animateNumber(totalUsers,      data.users.length);
  animateNumber(totalNewsletter, data.subscribers.length);
  animateNumber(totalAdmins,     data.admins.length);

  displayMessagesTable();
  displayUsersTable();
  displaySubscribersTable();
  displayAdminsTable();

  setupPaginationListeners();
};

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

// ── MESSAGES ──

function displayMessagesTable() {
  const tbody = document.querySelector('#messagesTable tbody');
  if (!tbody || !allData.messages) return;

  const { current, itemsPerPage } = paginationState.messages;
  const start    = (current - 1) * itemsPerPage;
  const pageData = allData.messages.slice(start, start + itemsPerPage);

  if (pageData.length === 0) {
    tbody.innerHTML = emptyState('fa-inbox', 'No messages found');
    return;
  }

  tbody.innerHTML = pageData.map(msg => `
    <tr>
      <td><span class="badge-id">#${msg.id}</span></td>
      <td><strong>${msg.first_name} ${msg.last_name}</strong></td>
      <td><a href="mailto:${msg.email}" class="email-link">${msg.email}</a></td>
      <td>${msg.subject || '—'}</td>
      <td class="message-preview">${msg.message.substring(0, 50)}${msg.message.length > 50 ? '...' : ''}</td>
      <td><span class="date-badge"><i class="far fa-calendar"></i> ${formatDate(msg.sent_at)}</span></td>
      <td>
        <span class="status-badge ${!msg.read ? 'status-unread' : 'status-read'}">
          <i class="fas ${!msg.read ? 'fa-circle' : 'fa-check-circle'}"></i>
          ${!msg.read ? 'Unread' : 'Read'}
        </span>
      </td>
      <td>
        <div class="actions-cell">
          <button class="action-btn view-btn" onclick="viewMessage(${msg.id})" title="View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn delete-btn" onclick="deleteMessage(${msg.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updatePaginationControls('messages');
}

// ── USERS ──

function displayUsersTable() {
  const tbody = document.querySelector('#usersTable tbody');
  if (!tbody || !allData.users) return;

  const { current, itemsPerPage } = paginationState.users;
  const start    = (current - 1) * itemsPerPage;
  const pageData = allData.users.slice(start, start + itemsPerPage);

  if (pageData.length === 0) {
    tbody.innerHTML = emptyState('fa-users-slash', 'No users found');
    return;
  }

  tbody.innerHTML = pageData.map(user => `
    <tr>
      <td><span class="badge-id">#${user.id}</span></td>
      <td>${user.full_name}</td>
      <td><a href="mailto:${user.email}" class="email-link">${user.email}</a></td>
      <td><span class="date-badge"><i class="far fa-calendar"></i> ${formatDate(user.created_at)}</span></td>
      <td><span class="status-badge status-read"><i class="fas fa-check-circle"></i> Active</span></td>
      <td>
        <div class="actions-cell">
          <button class="action-btn view-btn" title="View user">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn delete-btn" title="Delete user">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updatePaginationControls('users');
}

// ── SUBSCRIBERS ──

function displaySubscribersTable() {
  const tbody = document.querySelector('#subscribersTable tbody');
  if (!tbody || !allData.subscribers) return;

  const { current, itemsPerPage } = paginationState.subscribers;
  const start    = (current - 1) * itemsPerPage;
  const pageData = allData.subscribers.slice(start, start + itemsPerPage);

  if (pageData.length === 0) {
    tbody.innerHTML = emptyState('fa-envelope-open', 'No subscribers found');
    return;
  }

  tbody.innerHTML = pageData.map(sub => `
    <tr>
      <td><span class="badge-id">#${sub.id}</span></td>
      <td><a href="mailto:${sub.email}" class="email-link">${sub.email}</a></td>
      <td><span class="date-badge"><i class="far fa-calendar"></i> ${formatDate(sub.subscribed_at)}</span></td>
      <td><span class="status-badge status-read"><i class="fas fa-check-circle"></i> Active</span></td>
      <td>
        <div class="actions-cell">
          <button class="action-btn delete-btn" title="Unsubscribe">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updatePaginationControls('subscribers');
}

// ── ADMINS ──

function displayAdminsTable() {
  const tbody = document.querySelector('#adminsTable tbody');
  if (!tbody || !allData.admins) return;

  const { current, itemsPerPage } = paginationState.admins;
  const start    = (current - 1) * itemsPerPage;
  const pageData = allData.admins.slice(start, start + itemsPerPage);

  if (pageData.length === 0) {
    tbody.innerHTML = emptyState('fa-user-shield', 'No admins found');
    return;
  }

  tbody.innerHTML = pageData.map(admin => `
    <tr>
      <td><span class="badge-id">#${admin.id}</span></td>
      <td><a href="mailto:${admin.email}" class="email-link">${admin.email}</a></td>
      <td><span class="date-badge"><i class="far fa-calendar"></i> ${formatDate(admin.joined_at)}</span></td>
      <td><span class="status-badge status-read"><i class="fas fa-check-circle"></i> Active</span></td>
    </tr>
  `).join('');

  updatePaginationControls('admins');
}

// ── PAGINATION ──

function updatePaginationControls(section) {
  const totalItems  = allData[section]?.length || 0;
  const totalPages  = Math.ceil(totalItems / paginationState[section].itemsPerPage);
  const current     = paginationState[section].current;

  const pageInfo = document.querySelector(`[data-pagination="${section}"]`);
  if (pageInfo) {
    pageInfo.innerHTML = `<i class="fas fa-book-open"></i> Page ${current} of ${totalPages || 1}`;
  }

  const prevBtn = document.querySelector(`[data-action="prev-${section}"]`);
  if (prevBtn) prevBtn.disabled = current === 1;

  const nextBtn = document.querySelector(`[data-action="next-${section}"]`);
  if (nextBtn) nextBtn.disabled = current >= totalPages || totalPages === 0;
}

function setupPaginationListeners() {
  ['messages', 'users', 'subscribers', 'admins'].forEach(section => {
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
        const total = allData[section]?.length || 0;
        const totalPages = Math.ceil(total / paginationState[section].itemsPerPage);
        if (paginationState[section].current < totalPages) {
          paginationState[section].current++;
          refreshTable(section);
        }
      });
    }
  });
}

function refreshTable(section) {
  const fns = {
    messages:    displayMessagesTable,
    users:       displayUsersTable,
    subscribers: displaySubscribersTable,
    admins:      displayAdminsTable,
  };
  fns[section]?.();
}

// ── UTILITIES ──

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

function emptyState(icon, message) {
  return `
    <tr>
      <td colspan="8">
        <div class="empty-state">
          <i class="fas ${icon}"></i>
          <p>${message}</p>
        </div>
      </td>
    </tr>
  `;
}

// ── MESSAGE MODAL ──

window.viewMessage = (messageId) => {
  const msg = allData.messages.find(m => m.id === messageId);
  if (!msg) return;

  const modal   = document.getElementById('messageModal');
  const title   = document.getElementById('modalTitle');
  const body    = document.getElementById('modalBody');

  title.textContent = `${msg.subject || 'Message'} — from ${msg.first_name} ${msg.last_name}`;
  body.innerHTML = `
    <p><strong>From:</strong> ${msg.first_name} ${msg.last_name}</p>
    <p><strong>Email:</strong> <a href="mailto:${msg.email}" class="email-link">${msg.email}</a></p>
    <p><strong>Subject:</strong> ${msg.subject || '—'}</p>
    <p><strong>Sent:</strong> ${formatDate(msg.sent_at)}</p>
    <hr style="border:none;border-top:1px solid var(--border);margin:var(--space-4) 0;">
    <p style="white-space:pre-wrap;">${msg.message}</p>
  `;

  modal.style.display = 'flex';
};

window.closeMessageModal = () => {
  document.getElementById('messageModal').style.display = 'none';
};

window.deleteMessage = (messageId) => {
  if (confirm('Delete this message?')) {
    allData.messages = allData.messages.filter(m => m.id !== messageId);
    displayMessagesTable();
  }
};
