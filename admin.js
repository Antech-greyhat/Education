// Admin Dashboard JavaScript

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Sample data - replace with actual API calls
let subscribers = [];
let messages = [];
let currentPage = {
    subscribers: 1,
    messages: 1
};
const itemsPerPage = 10;

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication first
    const isAuthenticated = checkAdminAuth();
    
    if (!isAuthenticated) {
        // Show login modal and hide dashboard
        showLoginModal();
        return;
    }

    // Initialize theme
    initTheme();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadDashboardData();
    
    // Set current year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Check if user is authenticated as admin
function checkAdminAuth() {
    const isAdmin = localStorage.getItem('isAdmin');
    const adminToken = sessionStorage.getItem('adminToken');
    
    // User is authenticated if either localStorage or sessionStorage has auth
    return isAdmin === 'true' || adminToken === 'authenticated';
}

// Show login modal
function showLoginModal() {
    document.body.classList.add('not-authenticated');
    const loginModal = document.getElementById('adminLoginModal');
    const loginForm = document.getElementById('adminLoginForm');
    
    if (loginModal) {
        loginModal.classList.remove('hidden');
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
}

// Hide login modal
function hideLoginModal() {
    document.body.classList.remove('not-authenticated');
    const loginModal = document.getElementById('adminLoginModal');
    
    if (loginModal) {
        loginModal.classList.add('hidden');
    }
    
    // Initialize dashboard after successful login
    initTheme();
    setupEventListeners();
    loadDashboardData();
    
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const loginError = document.getElementById('loginError');
    
    // Demo credentials (in production, verify with backend API)
    const validCredentials = {
        'admin': 'admin123',
        'administrator': 'admin123',
        'root': 'admin123'
    };
    
    // Validate credentials
    if (validCredentials[username] && validCredentials[username] === password) {
        // Set authentication
        localStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUsername', username);
        
        // Hide error
        loginError.classList.remove('show');
        
        // Show success notification
        showNotification('Login successful! Welcome to Admin Dashboard', 'success');
        
        // Hide login modal and show dashboard
        setTimeout(() => {
            hideLoginModal();
        }, 500);
    } else {
        // Show error
        loginError.textContent = 'Invalid username or password. Please try again.';
        loginError.classList.add('show');
        
        // Shake the form
        const loginContainer = document.querySelector('.admin-login-container');
        if (loginContainer) {
            loginContainer.style.animation = 'none';
            setTimeout(() => {
                loginContainer.style.animation = 'slideDown 0.4s ease-out, shake 0.5s ease-in-out';
            }, 10);
        }
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Tab navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Subscribers section
    document.getElementById('refreshSubscribers')?.addEventListener('click', loadSubscribers);
    document.getElementById('exportSubscribers')?.addEventListener('click', exportSubscribers);
    document.getElementById('subscriberSearch')?.addEventListener('input', filterSubscribers);

    // Newsletter form
    document.getElementById('newsletterForm')?.addEventListener('submit', sendNewsletter);
    document.getElementById('previewNewsletter')?.addEventListener('click', previewNewsletter);
    document.getElementById('newsletterBody')?.addEventListener('input', updateCharCount);

    // Modal close
    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.getElementById('previewModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'previewModal') closeModal();
    });

    // Messages section
    document.getElementById('refreshMessages')?.addEventListener('click', loadMessages);
    document.getElementById('messageFilter')?.addEventListener('change', filterMessages);
    document.getElementById('messageSearch')?.addEventListener('input', searchMessages);
}

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `${tabName}-tab`);
    });

    // Load data for the active tab
    if (tabName === 'subscribers') {
        loadSubscribers();
    } else if (tabName === 'messages') {
        loadMessages();
    }
}

// Load all dashboard data
async function loadDashboardData() {
    await Promise.all([
        loadSubscribers(),
        loadMessages(),
        updateStats()
    ]);
}

// Update dashboard statistics
async function updateStats() {
    try {
        // In production, fetch from API
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        
        // Mock data for demonstration
        const stats = {
            totalSubscribers: subscribers.length || 0,
            totalMessages: messages.length || 0,
            totalSent: 0
        };

        document.getElementById('totalSubscribers').textContent = stats.totalSubscribers;
        document.getElementById('totalMessages').textContent = stats.totalMessages;
        document.getElementById('totalSent').textContent = stats.totalSent;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Load subscribers
async function loadSubscribers() {
    const tableBody = document.getElementById('subscribersTable');
    
    try {
        // Show loading state
        tableBody.innerHTML = '<tr><td colspan="5" class="loading"><i class="fas fa-spinner fa-spin"></i> Loading subscribers...</td></tr>';

        // In production, fetch from API
        // const response = await fetch('/api/admin/subscribers');
        // subscribers = await response.json();
        
        // Mock data for demonstration
        subscribers = generateMockSubscribers();

        if (subscribers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="empty-state"><i class="fas fa-inbox"></i><p>No subscribers yet</p></td></tr>';
            return;
        }

        displaySubscribers();
        updateStats();
    } catch (error) {
        console.error('Error loading subscribers:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="alert alert-error">Error loading subscribers. Please try again.</td></tr>';
    }
}

// Display subscribers in table
function displaySubscribers(filteredData = null) {
    const tableBody = document.getElementById('subscribersTable');
    const data = filteredData || subscribers;
    const startIndex = (currentPage.subscribers - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="empty-state"><p>No subscribers found</p></td></tr>';
        return;
    }

    tableBody.innerHTML = paginatedData.map((sub, index) => `
        <tr>
            <td>${startIndex + index + 1}</td>
            <td>${sub.email}</td>
            <td>${formatDate(sub.subscribedDate)}</td>
            <td><span class="status-badge ${sub.status === 'active' ? 'status-active' : 'status-inactive'}">${sub.status}</span></td>
            <td class="table-actions">
                <button class="btn-icon" onclick="viewSubscriber('${sub.id}')" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteSubscriber('${sub.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    // Update pagination
    updatePagination('subscribers', data.length);
}

// Filter subscribers
function filterSubscribers(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = subscribers.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm)
    );
    currentPage.subscribers = 1;
    displaySubscribers(filtered);
}

// Export subscribers
function exportSubscribers() {
    const csv = ['Email,Status,Subscribed Date\n'];
    subscribers.forEach(sub => {
        csv.push(`${sub.email},${sub.status},${sub.subscribedDate}\n`);
    });
    
    const blob = new Blob(csv, { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showAlert('Subscribers exported successfully!', 'success');
}

// Load contact messages
async function loadMessages() {
    const messagesList = document.getElementById('messagesList');
    
    try {
        // Show loading state
        messagesList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading messages...</div>';

        // In production, fetch from API
        // const response = await fetch('/api/admin/messages');
        // messages = await response.json();
        
        // Mock data for demonstration
        messages = generateMockMessages();

        if (messages.length === 0) {
            messagesList.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No messages yet</p></div>';
            return;
        }

        displayMessages();
        updateStats();
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesList.innerHTML = '<div class="alert alert-error">Error loading messages. Please try again.</div>';
    }
}

// Display messages
function displayMessages(filteredData = null) {
    const messagesList = document.getElementById('messagesList');
    const data = filteredData || messages;
    const startIndex = (currentPage.messages - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        messagesList.innerHTML = '<div class="empty-state"><p>No messages found</p></div>';
        return;
    }

    messagesList.innerHTML = paginatedData.map(msg => `
        <div class="message-item ${msg.status === 'unread' ? 'unread' : ''}" onclick="toggleMessage('${msg.id}')">
            <div class="message-header">
                <div class="message-sender">
                    <div class="message-name">${msg.firstName} ${msg.lastName}</div>
                    <div class="message-email">${msg.email}</div>
                </div>
                <div class="message-meta">
                    <div class="message-date">${formatDate(msg.date)}</div>
                    ${msg.status === 'unread' ? '<span class="status-badge status-active">New</span>' : ''}
                </div>
            </div>
            <div class="message-subject"><strong>Subject:</strong> ${msg.subject}</div>
            <div class="message-preview">${msg.message.substring(0, 100)}...</div>
            <div class="message-body">
                <strong>Full Message:</strong><br><br>
                ${msg.message}
            </div>
            <div class="message-actions">
                <button class="btn btn-secondary" onclick="markAsRead(event, '${msg.id}')">
                    <i class="fas fa-check"></i> Mark as Read
                </button>
                <button class="btn btn-primary" onclick="replyToMessage(event, '${msg.email}')">
                    <i class="fas fa-reply"></i> Reply
                </button>
                <button class="btn btn-danger" onclick="deleteMessage(event, '${msg.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');

    // Update pagination
    updatePagination('messages', data.length);
}

// Toggle message expansion
function toggleMessage(messageId) {
    const messageElement = event.currentTarget;
    messageElement.classList.toggle('expanded');
}

// Filter messages
function filterMessages() {
    const filter = document.getElementById('messageFilter').value;
    let filtered = messages;
    
    if (filter !== 'all') {
        filtered = messages.filter(msg => msg.status === filter);
    }
    
    currentPage.messages = 1;
    displayMessages(filtered);
}

// Search messages
function searchMessages(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = messages.filter(msg => 
        msg.firstName.toLowerCase().includes(searchTerm) ||
        msg.lastName.toLowerCase().includes(searchTerm) ||
        msg.email.toLowerCase().includes(searchTerm) ||
        msg.subject.toLowerCase().includes(searchTerm) ||
        msg.message.toLowerCase().includes(searchTerm)
    );
    currentPage.messages = 1;
    displayMessages(filtered);
}

// Mark message as read
function markAsRead(event, messageId) {
    event.stopPropagation();
    
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
        messages[messageIndex].status = 'read';
        // In production, update on server
        // await fetch(`/api/admin/messages/${messageId}`, { method: 'PATCH', body: JSON.stringify({ status: 'read' }) });
        
        loadMessages();
        showAlert('Message marked as read', 'success');
    }
}

// Reply to message
function replyToMessage(event, email) {
    event.stopPropagation();
    window.location.href = `mailto:${email}`;
}

// Delete message
function deleteMessage(event, messageId) {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this message?')) {
        const messageIndex = messages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
            messages.splice(messageIndex, 1);
            // In production, delete on server
            // await fetch(`/api/admin/messages/${messageId}`, { method: 'DELETE' });
            
            loadMessages();
            showAlert('Message deleted successfully', 'success');
        }
    }
}

// View subscriber details
function viewSubscriber(subscriberId) {
    const subscriber = subscribers.find(s => s.id === subscriberId);
    if (subscriber) {
        alert(`Subscriber Details:\n\nEmail: ${subscriber.email}\nStatus: ${subscriber.status}\nSubscribed: ${formatDate(subscriber.subscribedDate)}`);
    }
}

// Delete subscriber
function deleteSubscriber(subscriberId) {
    if (confirm('Are you sure you want to remove this subscriber?')) {
        const index = subscribers.findIndex(s => s.id === subscriberId);
        if (index !== -1) {
            subscribers.splice(index, 1);
            // In production, delete on server
            // await fetch(`/api/admin/subscribers/${subscriberId}`, { method: 'DELETE' });
            
            loadSubscribers();
            showAlert('Subscriber removed successfully', 'success');
        }
    }
}

// Send newsletter
async function sendNewsletter(e) {
    e.preventDefault();
    
    const recipients = document.getElementById('newsletterRecipients').value;
    const topic = document.getElementById('newsletterTopic').value;
    const body = document.getElementById('newsletterBody').value;
    const sendNow = document.getElementById('sendNowCheck').checked;

    if (!topic || !body) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
        // In production, send to API
        // const response = await fetch('/api/admin/newsletter', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ recipients, topic, body, sendNow })
        // });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update sent count
        const totalSentElement = document.getElementById('totalSent');
        const currentSent = parseInt(totalSentElement.textContent);
        totalSentElement.textContent = currentSent + 1;

        showAlert(`Newsletter "${topic}" sent successfully to ${recipients} subscribers!`, 'success');
        
        // Reset form
        document.getElementById('newsletterForm').reset();
        updateCharCount();
    } catch (error) {
        console.error('Error sending newsletter:', error);
        showAlert('Error sending newsletter. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Preview newsletter
function previewNewsletter() {
    const topic = document.getElementById('newsletterTopic').value;
    const body = document.getElementById('newsletterBody').value;

    if (!topic || !body) {
        showAlert('Please fill in topic and body before previewing', 'error');
        return;
    }

    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h2 style="color: #4361ee; border-bottom: 3px solid #4361ee; padding-bottom: 10px;">${topic}</h2>
            <div style="margin-top: 20px; line-height: 1.8; color: #333;">
                ${body.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 0.9em;">
                <p>© ${new Date().getFullYear()} AntechLearn. All rights reserved.</p>
                <p>You received this email because you subscribed to our newsletter.</p>
            </div>
        </div>
    `;

    document.getElementById('previewModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('previewModal').classList.remove('active');
}

// Update character count
function updateCharCount() {
    const body = document.getElementById('newsletterBody').value;
    document.getElementById('charCount').textContent = body.length;
}

// Update pagination
function updatePagination(type, totalItems) {
    const paginationContainer = document.getElementById(`${type}Pagination`);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage('${type}', ${currentPage[type] - 1})" 
                ${currentPage[type] === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage[type] - 1 && i <= currentPage[type] + 1)) {
            paginationHTML += `
                <button onclick="changePage('${type}', ${i})" 
                        class="${i === currentPage[type] ? 'active' : ''}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage[type] - 2 || i === currentPage[type] + 2) {
            paginationHTML += '<button disabled>...</button>';
        }
    }

    // Next button
    paginationHTML += `
        <button onclick="changePage('${type}', ${currentPage[type] + 1})" 
                ${currentPage[type] === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(type, page) {
    currentPage[type] = page;
    if (type === 'subscribers') {
        displaySubscribers();
    } else if (type === 'messages') {
        displayMessages();
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear authentication
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminUsername');
        sessionStorage.removeItem('adminToken');
        
        // Show notification
        showNotification('Logged out successfully', 'success');
        
        // Reload page to show login
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    const container = document.querySelector('.admin-section .container');
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.style.transition = 'opacity 0.3s ease';
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
}

// Generate mock subscribers (for demonstration)
function generateMockSubscribers() {
    return [
        { id: '1', email: 'john.doe@example.com', status: 'active', subscribedDate: '2026-02-01' },
        { id: '2', email: 'jane.smith@example.com', status: 'active', subscribedDate: '2026-02-03' },
        { id: '3', email: 'bob.wilson@example.com', status: 'active', subscribedDate: '2026-02-05' },
        { id: '4', email: 'alice.brown@example.com', status: 'active', subscribedDate: '2026-02-06' },
        { id: '5', email: 'charlie.davis@example.com', status: 'inactive', subscribedDate: '2026-01-28' }
    ];
}

// Generate mock messages (for demonstration)
function generateMockMessages() {
    return [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            subject: 'Question about Python tutorial',
            message: 'Hi, I have a question about the Python functions tutorial. Could you please clarify how decorators work? I\'m having trouble understanding the concept. Thank you!',
            status: 'unread',
            date: '2026-02-08'
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            subject: 'Great content!',
            message: 'I just wanted to say thank you for creating such amazing programming tutorials. They have helped me learn so much. Keep up the great work!',
            status: 'read',
            date: '2026-02-07'
        },
        {
            id: '3',
            firstName: 'Bob',
            lastName: 'Wilson',
            email: 'bob.wilson@example.com',
            subject: 'Suggestion for new tutorial',
            message: 'Would it be possible to add a tutorial on async/await in JavaScript? I think many beginners would find it helpful. Thanks!',
            status: 'unread',
            date: '2026-02-06'
        }
    ];
}
