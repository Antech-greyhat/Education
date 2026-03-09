/**
 * Initialize tab switching functionality
 * @param {string} tabsContainerSelector - Selector for the tabs container
 * @param {string} contentContainerSelector - Selector for the tab content container
 * @param {Object} options - Optional configuration
 */
function initTabs(tabsContainerSelector, contentContainerSelector, options = {}) {
    const defaultOptions = {
        activeTabClass: 'active',
        activePaneClass: 'active',
        tabButtonSelector: '[data-tab]',
        tabPaneSelector: '.tab-pane',
        onTabChange: null // Callback function(tabId, tabButton, tabPane)
    };

    const config = { ...defaultOptions, ...options };
    
    const tabsContainer = document.querySelector(tabsContainerSelector);
    const contentContainer = document.querySelector(contentContainerSelector);

    if (!tabsContainer || !contentContainer) {
        console.error('Tabs or content container not found');
        return;
    }

    const tabButtons = tabsContainer.querySelectorAll(config.tabButtonSelector);
    const tabPanes = contentContainer.querySelectorAll(config.tabPaneSelector);

    function switchTab(targetTab) {
        // Remove active class from all tabs and panes
        tabButtons.forEach(btn => btn.classList.remove(config.activeTabClass));
        tabPanes.forEach(pane => pane.classList.remove(config.activePaneClass));

        // Find and activate the target tab button
        const activeButton = tabsContainer.querySelector(`[data-tab="${targetTab}"]`);
        if (activeButton) {
            activeButton.classList.add(config.activeTabClass);
        }

        // Find and activate the target tab pane
        const activePane = contentContainer.querySelector(`#${targetTab}-tab`);
        if (activePane) {
            activePane.classList.add(config.activePaneClass);
            
            // Trigger custom event
            activePane.dispatchEvent(new CustomEvent('tab:shown', { 
                detail: { tabId: targetTab } 
            }));
        }

        // Execute callback if provided
        if (typeof config.onTabChange === 'function') {
            config.onTabChange(targetTab, activeButton, activePane);
        }

        // Store active tab in session storage for persistence
        sessionStorage.setItem('activeAdminTab', targetTab);
    }

    // Add click listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Restore active tab from session storage or URL hash
    function restoreActiveTab() {
        const hash = window.location.hash.replace('#', '');
        const storedTab = sessionStorage.getItem('activeAdminTab');
        
        if (hash && document.querySelector(`#${hash}-tab`)) {
            switchTab(hash);
        } else if (storedTab) {
            switchTab(storedTab);
        }
    }

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && document.querySelector(`#${hash}-tab`)) {
            switchTab(hash);
        }
    });

    // Initialize
    restoreActiveTab();

    // Expose public API
    return {
        switchTo: switchTab,
        getActiveTab: () => {
            const activeBtn = tabsContainer.querySelector(`.${config.activeTabClass}`);
            return activeBtn ? activeBtn.getAttribute('data-tab') : null;
        },
        on: (event, callback) => {
            if (event === 'change') {
                const originalCallback = config.onTabChange;
                config.onTabChange = (tabId, btn, pane) => {
                    if (originalCallback) originalCallback(tabId, btn, pane);
                    callback(tabId, btn, pane);
                };
            }
        }
    };
}

// ============================================
// USAGE EXAMPLES
// ============================================

// 1. Basic initialization
document.addEventListener('DOMContentLoaded', () => {
    const adminTabs = initTabs('.admin-tabs', '.tab-content');
});

// 2. With callback for loading data when tab opens
document.addEventListener('DOMContentLoaded', () => {
    const adminTabs = initTabs('.admin-tabs', '.tab-content', {
        onTabChange: (tabId, button, pane) => {
            console.log(`Switched to ${tabId} tab`);
            
            // Load data for specific tabs if needed
            switch(tabId) {
                case 'users':
                    loadUsersData();
                    break;
                case 'messages':
                    loadMessagesData();
                    break;
                case 'newsletter':
                    loadSubscribersData();
                    break;
                case 'admins':
                    loadAdminsData();
                    break;
            }
        }
    });
});

function loadUsersData() {
    // Your existing getData.js logic or fetch call
    console.log('Loading users...');
    // fetchUsers().then(data => renderUsersTable(data));
}

function loadMessagesData() {
    console.log('Loading messages...');
}

function loadSubscribersData() {
    console.log('Loading subscribers...');
}

function loadAdminsData() {
    console.log('Loading admins...');
}
