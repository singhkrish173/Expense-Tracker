/* ============================================
   EXPENSE TRACKER - FRONTEND LOGIC
   ============================================ */

const API_BASE = '/api/transactions';
const AUTH_API = '/api/auth';

// Category definitions
const CATEGORIES = {
    income: ['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Gift', 'Refund', 'Other'],
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Rent', 'Travel', 'Groceries', 'Other']
};

// Category emoji map
const CATEGORY_ICONS = {
    'Salary': '💰', 'Freelance': '💻', 'Business': '📊', 'Investment': '📈',
    'Rental': '🏠', 'Gift': '🎁', 'Refund': '🔄', 'Food': '🍔',
    'Transport': '🚗', 'Shopping': '🛍️', 'Bills': '📄', 'Entertainment': '🎬',
    'Health': '🏥', 'Education': '📚', 'Rent': '🏡', 'Travel': '✈️',
    'Groceries': '🛒', 'Other': '📌'
};

// Bar colors for categories
const BAR_COLORS = [
    '#a855f7', '#c084fc', '#818cf8', '#60a5fa', '#34d399',
    '#fbbf24', '#fb923c', '#f87171', '#e879f9', '#38bdf8', '#4ade80'
];

// ========== DOM ELEMENTS ==========
const elements = {
    // Screens
    authScreen: document.getElementById('authScreen'),
    appScreen: document.getElementById('appScreen'),

    // Auth Screen Elements
    authThemeToggle: document.getElementById('authThemeToggle'),
    authTabSignIn: document.getElementById('authTabSignIn'),
    authTabSignUp: document.getElementById('authTabSignUp'),
    landingSignInForm: document.getElementById('landingSignInForm'),
    landingSignUpForm: document.getElementById('landingSignUpForm'),
    loginUserField: document.getElementById('loginUserField'),
    loginPassField: document.getElementById('loginPassField'),
    landingSignInBtn: document.getElementById('landingSignInBtn'),
    landingDemoBtn: document.getElementById('landingDemoBtn'),
    regFullNameField: document.getElementById('regFullNameField'),
    regUsernameField: document.getElementById('regUsernameField'),
    regEmailField: document.getElementById('regEmailField'),
    regPassField: document.getElementById('regPassField'),
    regConfirmPassField: document.getElementById('regConfirmPassField'),
    landingSignUpBtn: document.getElementById('landingSignUpBtn'),

    // App Screen Elements
    sidebar: document.getElementById('sidebar'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    appThemeToggle: document.getElementById('appThemeToggle'),
    pageTitle: document.getElementById('pageTitle'),
    headerSubtitle: document.getElementById('headerSubtitle'),
    addTransactionBtn: document.getElementById('addTransactionBtn'),
    headerSignOutBtn: document.getElementById('headerSignOutBtn'),

    // User Profile Widget (Sidebar)
    userAvatar: document.getElementById('userAvatar'),
    sidebarUserName: document.getElementById('sidebarUserName'),
    sidebarUserStatus: document.getElementById('sidebarUserStatus'),
    sidebarSignOutBtn: document.getElementById('sidebarSignOutBtn'),

    // Dashboard Elements
    totalBalance: document.getElementById('totalBalance'),
    totalIncome: document.getElementById('totalIncome'),
    totalExpense: document.getElementById('totalExpense'),
    totalCount: document.getElementById('totalCount'),
    summaryMonth: document.getElementById('summaryMonth'),
    summaryYear: document.getElementById('summaryYear'),
    monthlyIncome: document.getElementById('monthlyIncome'),
    monthlyExpense: document.getElementById('monthlyExpense'),
    monthlyNet: document.getElementById('monthlyNet'),
    expenseRatioText: document.getElementById('expenseRatioText'),
    expenseRatioBar: document.getElementById('expenseRatioBar'),
    recentTransactions: document.getElementById('recentTransactions'),
    categoryBars: document.getElementById('categoryBars'),

    // Transactions Page
    searchInput: document.getElementById('searchInput'),
    filterType: document.getElementById('filterType'),
    filterCategory: document.getElementById('filterCategory'),
    filterStartDate: document.getElementById('filterStartDate'),
    filterEndDate: document.getElementById('filterEndDate'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    transactionsBody: document.getElementById('transactionsBody'),

    // Reports Page
    reportMonth: document.getElementById('reportMonth'),
    reportYear: document.getElementById('reportYear'),
    generateReportBtn: document.getElementById('generateReportBtn'),
    reportIncome: document.getElementById('reportIncome'),
    reportExpense: document.getElementById('reportExpense'),
    reportNet: document.getElementById('reportNet'),
    reportCount: document.getElementById('reportCount'),
    reportTransactionsBody: document.getElementById('reportTransactionsBody'),

    // Transaction Modal
    transactionModal: document.getElementById('transactionModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    transactionForm: document.getElementById('transactionForm'),
    transactionId: document.getElementById('transactionId'),
    txnType: document.getElementById('txnType'),
    txnCategory: document.getElementById('txnCategory'),
    txnDescription: document.getElementById('txnDescription'),
    txnAmount: document.getElementById('txnAmount'),
    txnDate: document.getElementById('txnDate'),
    txnNote: document.getElementById('txnNote'),
    cancelFormBtn: document.getElementById('cancelFormBtn'),
    saveFormBtn: document.getElementById('saveFormBtn'),

    toastContainer: document.getElementById('toastContainer')
};

// ========== STATE ==========
let currentUser = null;
let allTransactions = [];
let currentCatType = 'expense';

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initYearSelectors();
    setCurrentMonth();
    bindEvents();
    checkAuthSession();
});

// ========== AUTHENTICATION & SCREEN MANAGEMENT ==========
function checkAuthSession() {
    const saved = localStorage.getItem('expense_tracker_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
        } catch (e) {
            currentUser = null;
        }
    }

    if (currentUser && currentUser.userId) {
        showAppScreen();
    } else {
        showAuthScreen();
    }
}

function showAuthScreen() {
    elements.authScreen.classList.remove('hidden');
    elements.appScreen.classList.add('hidden');
    switchAuthTab('signin');
}

function showAppScreen() {
    elements.authScreen.classList.add('hidden');
    elements.appScreen.classList.remove('hidden');
    updateUserProfileWidget();
    loadDashboard();
}

function updateUserProfileWidget() {
    if (currentUser) {
        const initial = (currentUser.fullName || currentUser.username || 'U').charAt(0).toUpperCase();
        elements.userAvatar.textContent = initial;
        elements.sidebarUserName.textContent = currentUser.fullName || currentUser.username;
        elements.sidebarUserStatus.textContent = `@${currentUser.username}`;
    }
}

function switchAuthTab(tab) {
    if (tab === 'signin') {
        elements.authTabSignIn.classList.add('active');
        elements.authTabSignUp.classList.remove('active');
        elements.landingSignInForm.classList.add('active');
        elements.landingSignUpForm.classList.remove('active');
    } else {
        elements.authTabSignUp.classList.add('active');
        elements.authTabSignIn.classList.remove('active');
        elements.landingSignUpForm.classList.add('active');
        elements.landingSignInForm.classList.remove('active');
    }
}

async function handleSignIn(e) {
    e.preventDefault();
    const username = elements.loginUserField.value.trim();
    const password = elements.loginPassField.value;

    if (!username || !password) {
        showToast('Please enter username and password', 'error');
        return;
    }

    try {
        elements.landingSignInBtn.disabled = true;
        elements.landingSignInBtn.textContent = 'Signing in...';

        const res = await fetch(`${AUTH_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (res.ok && data.success) {
            currentUser = {
                userId: data.userId,
                username: data.username,
                fullName: data.fullName,
                email: data.email
            };
            localStorage.setItem('expense_tracker_user', JSON.stringify(currentUser));
            elements.landingSignInForm.reset();
            showToast(`Welcome back, ${data.fullName || data.username}!`, 'success');
            showAppScreen();
        } else {
            showToast(data.message || 'Invalid username or password', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Server connection error. Please try again.', 'error');
    } finally {
        elements.landingSignInBtn.disabled = false;
        elements.landingSignInBtn.textContent = 'Sign In to Dashboard';
    }
}

async function handleSignUp(e) {
    e.preventDefault();
    const fullName = elements.regFullNameField.value.trim();
    const username = elements.regUsernameField.value.trim();
    const email = elements.regEmailField.value.trim();
    const password = elements.regPassField.value;
    const confirmPassword = elements.regConfirmPassField.value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        elements.landingSignUpBtn.disabled = true;
        elements.landingSignUpBtn.textContent = 'Creating Account...';

        const res = await fetch(`${AUTH_API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, username, email, password })
        });

        const data = await res.json();
        if (res.ok && data.success) {
            currentUser = {
                userId: data.userId,
                username: data.username,
                fullName: data.fullName,
                email: data.email
            };
            localStorage.setItem('expense_tracker_user', JSON.stringify(currentUser));
            elements.landingSignUpForm.reset();
            showToast('Account created successfully! Welcome to ExpenseTracker.', 'success');
            showAppScreen();
        } else {
            showToast(data.message || 'Registration failed.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Error registering account. Please try again.', 'error');
    } finally {
        elements.landingSignUpBtn.disabled = false;
        elements.landingSignUpBtn.textContent = 'Create Account & Start Tracking';
    }
}

async function handleDemoLogin() {
    const demoUser = {
        fullName: 'Demo User',
        username: 'demouser',
        email: 'demo@expensetracker.com',
        password: 'demopassword123'
    };

    try {
        elements.landingDemoBtn.disabled = true;
        elements.landingDemoBtn.textContent = 'Logging in demo...';

        let res = await fetch(`${AUTH_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: demoUser.username, password: demoUser.password })
        });

        let data = await res.json();
        if (!res.ok || !data.success) {
            res = await fetch(`${AUTH_API}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(demoUser)
            });
            data = await res.json();
        }

        if (data.userId) {
            currentUser = {
                userId: data.userId,
                username: data.username || demoUser.username,
                fullName: data.fullName || demoUser.fullName,
                email: data.email || demoUser.email
            };
            localStorage.setItem('expense_tracker_user', JSON.stringify(currentUser));
            showToast('Logged in as Demo User!', 'success');
            showAppScreen();
        } else {
            showToast('Could not start demo session', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Demo login error', 'error');
    } finally {
        elements.landingDemoBtn.disabled = false;
        elements.landingDemoBtn.textContent = '⚡ Quick Demo Login (1-Click Access)';
    }
}

function handleSignOut() {
    if (confirm('Are you sure you want to sign out?')) {
        currentUser = null;
        localStorage.removeItem('expense_tracker_user');
        showToast('Signed out successfully.', 'info');
        showAuthScreen();
    }
}

function getAuthHeaders(customHeaders = {}) {
    const headers = { ...customHeaders };
    if (currentUser && currentUser.userId) {
        headers['X-User-Id'] = currentUser.userId;
    }
    return headers;
}

function refreshAllViews() {
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pageId = activePage.id;
        if (pageId === 'dashboardPage') {
            loadDashboard();
        } else if (pageId === 'transactionsPage') {
            loadTransactions();
        } else if (pageId === 'reportsPage') {
            generateReport();
        }
    }
}

// ========== THEME MANAGEMENT ==========
function initTheme() {
    const savedTheme = localStorage.getItem('expense_tracker_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const isLight = savedTheme === 'light';
    if (elements.authThemeToggle) elements.authThemeToggle.checked = isLight;
    if (elements.appThemeToggle) elements.appThemeToggle.checked = isLight;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('expense_tracker_theme', newTheme);
    const isLight = newTheme === 'light';
    if (elements.authThemeToggle) elements.authThemeToggle.checked = isLight;
    if (elements.appThemeToggle) elements.appThemeToggle.checked = isLight;
}

// ========== YEAR & MONTH HELPERS ==========
function initYearSelectors() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear - 3; y <= currentYear + 2; y++) {
        years.push(y);
    }

    [elements.summaryYear, elements.reportYear].forEach(select => {
        if (select) {
            select.innerHTML = '';
            years.forEach(y => {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                if (y === currentYear) opt.selected = true;
                select.appendChild(opt);
            });
        }
    });
}

function setCurrentMonth() {
    const now = new Date();
    const month = now.getMonth() + 1;
    if (elements.summaryMonth) elements.summaryMonth.value = month;
    if (elements.reportMonth) elements.reportMonth.value = month;
}

// ========== EVENT BINDINGS ==========
function bindEvents() {
    // Theme toggles
    if (elements.authThemeToggle) elements.authThemeToggle.addEventListener('change', toggleTheme);
    if (elements.appThemeToggle) elements.appThemeToggle.addEventListener('change', toggleTheme);

    // Auth Screen Events
    if (elements.authTabSignIn) elements.authTabSignIn.addEventListener('click', () => switchAuthTab('signin'));
    if (elements.authTabSignUp) elements.authTabSignUp.addEventListener('click', () => switchAuthTab('signup'));
    if (elements.landingSignInForm) elements.landingSignInForm.addEventListener('submit', handleSignIn);
    if (elements.landingSignUpForm) elements.landingSignUpForm.addEventListener('submit', handleSignUp);
    if (elements.landingDemoBtn) elements.landingDemoBtn.addEventListener('click', handleDemoLogin);

    // Sign Out Buttons
    if (elements.sidebarSignOutBtn) elements.sidebarSignOutBtn.addEventListener('click', handleSignOut);
    if (elements.headerSignOutBtn) elements.headerSignOutBtn.addEventListener('click', handleSignOut);

    // Mobile menu
    if (elements.mobileMenuBtn) {
        elements.mobileMenuBtn.addEventListener('click', function () {
            elements.sidebar.classList.toggle('open');
        });
    }

    // Navigation
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateTo(targetPage);
            if (window.innerWidth <= 768) {
                elements.sidebar.classList.remove('open');
            }
        });
    });

    // View all link on dashboard
    document.querySelectorAll('.view-all-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navigateTo(targetPage);
        });
    });

    // Modal controls for Transaction
    if (elements.addTransactionBtn) {
        elements.addTransactionBtn.addEventListener('click', () => openTransactionModal());
    }
    if (elements.modalCloseBtn) {
        elements.modalCloseBtn.addEventListener('click', closeTransactionModal);
    }
    if (elements.cancelFormBtn) {
        elements.cancelFormBtn.addEventListener('click', closeTransactionModal);
    }

    // Close modal on overlay click
    if (elements.transactionModal) {
        elements.transactionModal.addEventListener('click', function (e) {
            if (e.target === elements.transactionModal) closeTransactionModal();
        });
    }

    // Form category populate on type change
    if (elements.txnType) {
        elements.txnType.addEventListener('change', function () {
            populateCategories(this.value, elements.txnCategory);
        });
    }

    // Form submit
    if (elements.transactionForm) {
        elements.transactionForm.addEventListener('submit', handleFormSubmit);
    }

    // Dashboard month/year change
    if (elements.summaryMonth) {
        elements.summaryMonth.addEventListener('change', loadMonthlyOverview);
    }
    if (elements.summaryYear) {
        elements.summaryYear.addEventListener('change', loadMonthlyOverview);
    }

    // Category breakdown toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCatType = this.getAttribute('data-cat-type');
            renderCategoryBreakdown();
        });
    });

    // Transactions filters
    if (elements.searchInput) {
        let debounceTimer;
        elements.searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(filterTransactionsList, 300);
        });
    }
    if (elements.filterType) {
        elements.filterType.addEventListener('change', function () {
            populateFilterCategories(this.value);
            filterTransactionsList();
        });
    }
    if (elements.filterCategory) {
        elements.filterCategory.addEventListener('change', filterTransactionsList);
    }
    if (elements.filterStartDate) {
        elements.filterStartDate.addEventListener('change', filterTransactionsList);
    }
    if (elements.filterEndDate) {
        elements.filterEndDate.addEventListener('change', filterTransactionsList);
    }
    if (elements.clearFiltersBtn) {
        elements.clearFiltersBtn.addEventListener('click', clearFilters);
    }

    // Reports page
    if (elements.generateReportBtn) {
        elements.generateReportBtn.addEventListener('click', generateReport);
    }
}

// ========== NAVIGATION ==========
function navigateTo(pageName) {
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const targetSection = document.getElementById(`${pageName}Page`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update Header
    const titles = {
        dashboard: { title: 'Dashboard', subtitle: 'Overview of your financial activity' },
        transactions: { title: 'Transactions', subtitle: 'Manage, search, and filter your records' },
        reports: { title: 'Reports & Analytics', subtitle: 'Monthly breakdowns and savings insights' },
        about: { title: 'About ExpenseTracker', subtitle: 'Architecture, features, and engineering stack' }
    };

    if (titles[pageName]) {
        elements.pageTitle.textContent = titles[pageName].title;
        elements.headerSubtitle.textContent = titles[pageName].subtitle;
    }

    // Load data for specific pages
    if (pageName === 'dashboard') {
        loadDashboard();
    } else if (pageName === 'transactions') {
        populateFilterCategories('');
        loadTransactions();
    } else if (pageName === 'reports') {
        generateReport();
    }
}

// ========== FORMATTING UTILS ==========
function formatCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '₹ 0.00';
    return '₹ ' + Number(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return dateStr;
}

// ========== DASHBOARD LOGIC ==========
async function loadDashboard() {
    await Promise.all([
        loadDashboardSummary(),
        loadMonthlyOverview(),
        loadRecentTransactions()
    ]);
}

async function loadDashboardSummary() {
    try {
        const res = await fetch(`${API_BASE}/summary`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to load summary');
        const data = await res.json();

        elements.totalBalance.textContent = formatCurrency(data.balance);
        elements.totalIncome.textContent = formatCurrency(data.totalIncome);
        elements.totalExpense.textContent = formatCurrency(data.totalExpense);
        elements.totalCount.textContent = data.transactionCount || 0;
    } catch (err) {
        console.error('Error loading dashboard summary:', err);
    }
}

async function loadMonthlyOverview() {
    const month = elements.summaryMonth.value;
    const year = elements.summaryYear.value;

    try {
        const res = await fetch(`${API_BASE}/summary/monthly?month=${month}&year=${year}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to load monthly summary');
        const data = await res.json();

        elements.monthlyIncome.textContent = formatCurrency(data.monthlyIncome);
        elements.monthlyExpense.textContent = formatCurrency(data.monthlyExpense);
        elements.monthlyNet.textContent = formatCurrency(data.monthlyBalance);

        // Expense ratio
        const income = data.monthlyIncome || 0;
        const expense = data.monthlyExpense || 0;
        let ratio = 0;
        if (income > 0) {
            ratio = Math.min(Math.round((expense / income) * 100), 100);
        } else if (expense > 0) {
            ratio = 100;
        }

        elements.expenseRatioText.textContent = `${ratio}%`;
        elements.expenseRatioBar.style.width = `${ratio}%`;

        // Store for category breakdown
        allTransactions = data.transactions || [];
        renderCategoryBreakdown();
    } catch (err) {
        console.error('Error loading monthly overview:', err);
    }
}

async function loadRecentTransactions() {
    try {
        const res = await fetch(API_BASE, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to load transactions');
        const txns = await res.json();

        const recent = txns.slice(0, 5);
        if (recent.length === 0) {
            elements.recentTransactions.innerHTML = '<div class="empty-state-small">No transactions recorded yet</div>';
            return;
        }

        elements.recentTransactions.innerHTML = recent.map(t => {
            const icon = CATEGORY_ICONS[t.category] || '📌';
            const isIncome = t.type === 'income';
            const sign = isIncome ? '+' : '-';
            const colorClass = isIncome ? 'income-value' : 'expense-value';

            return `
                <div class="recent-item">
                    <div class="recent-item-left">
                        <span class="recent-item-icon">${icon}</span>
                        <div>
                            <div class="recent-item-title">${escapeHtml(t.description)}</div>
                            <div class="recent-item-date">${formatDate(t.date)} &bull; ${escapeHtml(t.category)}</div>
                        </div>
                    </div>
                    <span class="recent-item-amount ${colorClass}">${sign} ${formatCurrency(t.amount)}</span>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Error loading recent transactions:', err);
    }
}

function renderCategoryBreakdown() {
    const filtered = allTransactions.filter(t => t.type === currentCatType);

    if (filtered.length === 0) {
        elements.categoryBars.innerHTML = `<div class="empty-state-small">No ${currentCatType} records for this month</div>`;
        return;
    }

    const totals = {};
    let totalSum = 0;
    filtered.forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
        totalSum += t.amount;
    });

    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

    elements.categoryBars.innerHTML = sorted.map(([cat, amount], index) => {
        const pct = totalSum > 0 ? Math.round((amount / totalSum) * 100) : 0;
        const color = BAR_COLORS[index % BAR_COLORS.length];
        const icon = CATEGORY_ICONS[cat] || '📌';

        return `
            <div class="category-bar-item">
                <div class="category-bar-info">
                    <span>${icon} ${escapeHtml(cat)} (${pct}%)</span>
                    <strong>${formatCurrency(amount)}</strong>
                </div>
                <div class="category-bar-track">
                    <div class="category-bar-fill" style="width: ${pct}%; background-color: ${color}"></div>
                </div>
            </div>
        `;
    }).join('');
}

// ========== TRANSACTIONS PAGE ==========
async function loadTransactions() {
    try {
        const res = await fetch(API_BASE, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to load transactions');
        allTransactions = await res.json();
        renderTransactionsTable(allTransactions);
    } catch (err) {
        console.error('Error loading transactions:', err);
        showToast('Error loading transactions', 'error');
    }
}

function renderTransactionsTable(txns) {
    if (!txns || txns.length === 0) {
        elements.transactionsBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-state-content">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        <p>No transactions found</p>
                        <span>Click "Add Transaction" to create a new entry</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    elements.transactionsBody.innerHTML = txns.map(t => {
        const isIncome = t.type === 'income';
        const badgeClass = isIncome ? 'badge-income' : 'badge-expense';
        const sign = isIncome ? '+' : '-';
        const amountClass = isIncome ? 'income-value' : 'expense-value';
        const icon = CATEGORY_ICONS[t.category] || '📌';

        return `
            <tr>
                <td>${formatDate(t.date)}</td>
                <td>
                    <strong>${escapeHtml(t.description)}</strong>
                    ${t.note ? `<br><small style="color: var(--text-muted); font-size: 0.78rem;">${escapeHtml(t.note)}</small>` : ''}
                </td>
                <td>${icon} ${escapeHtml(t.category)}</td>
                <td><span class="badge ${badgeClass}">${t.type}</span></td>
                <td class="${amountClass}"><strong>${sign} ${formatCurrency(t.amount)}</strong></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon edit-btn" onclick="editTransaction(${t.id})" title="Edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon delete-btn" onclick="deleteTransaction(${t.id})" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterTransactionsList() {
    const search = elements.searchInput.value.toLowerCase().trim();
    const type = elements.filterType.value;
    const category = elements.filterCategory.value;
    const startDate = elements.filterStartDate.value;
    const endDate = elements.filterEndDate.value;

    let filtered = [...allTransactions];

    if (search) {
        filtered = filtered.filter(t =>
            (t.description && t.description.toLowerCase().includes(search)) ||
            (t.category && t.category.toLowerCase().includes(search)) ||
            (t.note && t.note.toLowerCase().includes(search))
        );
    }

    if (type) {
        filtered = filtered.filter(t => t.type === type);
    }

    if (category) {
        filtered = filtered.filter(t => t.category === category);
    }

    if (startDate) {
        filtered = filtered.filter(t => t.date >= startDate);
    }

    if (endDate) {
        filtered = filtered.filter(t => t.date <= endDate);
    }

    renderTransactionsTable(filtered);
}

function clearFilters() {
    elements.searchInput.value = '';
    elements.filterType.value = '';
    elements.filterCategory.value = '';
    elements.filterStartDate.value = '';
    elements.filterEndDate.value = '';
    populateFilterCategories('');
    renderTransactionsTable(allTransactions);
}

function populateFilterCategories(type) {
    elements.filterCategory.innerHTML = '<option value="">All Categories</option>';
    let cats = [];
    if (type === 'income') {
        cats = CATEGORIES.income;
    } else if (type === 'expense') {
        cats = CATEGORIES.expense;
    } else {
        cats = [...new Set([...CATEGORIES.income, ...CATEGORIES.expense])];
    }
    cats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = `${CATEGORY_ICONS[c] || '📌'} ${c}`;
        elements.filterCategory.appendChild(opt);
    });
}

// ========== REPORTS PAGE ==========
async function generateReport() {
    const month = elements.reportMonth.value;
    const year = elements.reportYear.value;

    try {
        const res = await fetch(`${API_BASE}/summary/monthly?month=${month}&year=${year}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to generate report');
        const data = await res.json();

        elements.reportIncome.textContent = formatCurrency(data.monthlyIncome);
        elements.reportExpense.textContent = formatCurrency(data.monthlyExpense);
        elements.reportNet.textContent = formatCurrency(data.monthlyBalance);
        elements.reportCount.textContent = data.transactionCount || 0;

        const txns = data.transactions || [];
        if (txns.length === 0) {
            elements.reportTransactionsBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <div class="empty-state-content">
                            <p>No transactions found for the selected month</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        elements.reportTransactionsBody.innerHTML = txns.map(t => {
            const isIncome = t.type === 'income';
            const badgeClass = isIncome ? 'badge-income' : 'badge-expense';
            const sign = isIncome ? '+' : '-';
            const amountClass = isIncome ? 'income-value' : 'expense-value';
            const icon = CATEGORY_ICONS[t.category] || '📌';

            return `
                <tr>
                    <td>${formatDate(t.date)}</td>
                    <td><strong>${escapeHtml(t.description)}</strong></td>
                    <td>${icon} ${escapeHtml(t.category)}</td>
                    <td><span class="badge ${badgeClass}">${t.type}</span></td>
                    <td class="${amountClass}"><strong>${sign} ${formatCurrency(t.amount)}</strong></td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Error generating report:', err);
        showToast('Error generating report', 'error');
    }
}

// ========== TRANSACTION MODAL & CRUD ==========
function populateCategories(type, selectEl) {
    selectEl.innerHTML = '<option value="">Select category</option>';
    if (type && CATEGORIES[type]) {
        CATEGORIES[type].forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = `${CATEGORY_ICONS[cat] || '📌'} ${cat}`;
            selectEl.appendChild(opt);
        });
    }
}

function openTransactionModal(editData = null) {
    elements.transactionForm.reset();
    elements.transactionId.value = '';

    if (editData) {
        elements.modalTitle.textContent = 'Edit Transaction';
        elements.transactionId.value = editData.id;
        elements.txnType.value = editData.type;
        populateCategories(editData.type, elements.txnCategory);
        elements.txnCategory.value = editData.category;
        elements.txnDescription.value = editData.description;
        elements.txnAmount.value = editData.amount;
        elements.txnDate.value = editData.date;
        elements.txnNote.value = editData.note || '';
        elements.saveFormBtn.textContent = 'Update Transaction';
    } else {
        elements.modalTitle.textContent = 'Add Transaction';
        elements.txnDate.value = new Date().toISOString().split('T')[0];
        elements.saveFormBtn.textContent = 'Save Transaction';
    }

    elements.transactionModal.classList.add('active');
}

function closeTransactionModal() {
    elements.transactionModal.classList.remove('active');
    elements.transactionForm.reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const id = elements.transactionId.value;
    const isEdit = !!id;

    const payload = {
        description: elements.txnDescription.value.trim(),
        amount: parseFloat(elements.txnAmount.value),
        type: elements.txnType.value,
        category: elements.txnCategory.value,
        date: elements.txnDate.value,
        note: elements.txnNote.value.trim() || null
    };

    if (currentUser && currentUser.userId) {
        payload.userId = currentUser.userId;
    }

    const url = isEdit ? `${API_BASE}/${id}` : API_BASE;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        elements.saveFormBtn.disabled = true;
        elements.saveFormBtn.textContent = isEdit ? 'Updating...' : 'Saving...';

        const res = await fetch(url, {
            method: method,
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`Failed to ${isEdit ? 'update' : 'save'} transaction`);
        }

        closeTransactionModal();
        showToast(`Transaction ${isEdit ? 'updated' : 'added'} successfully!`, 'success');

        // Reload views
        refreshAllViews();
    } catch (err) {
        console.error('Error submitting form:', err);
        showToast(`Error ${isEdit ? 'updating' : 'saving'} transaction`, 'error');
    } finally {
        elements.saveFormBtn.disabled = false;
        elements.saveFormBtn.textContent = isEdit ? 'Update Transaction' : 'Save Transaction';
    }
}

async function editTransaction(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Transaction not found');
        const data = await res.json();
        openTransactionModal(data);
    } catch (err) {
        console.error('Error fetching transaction:', err);
        showToast('Error loading transaction details', 'error');
    }
}

async function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete');

        showToast('Transaction deleted successfully', 'info');
        refreshAllViews();
    } catch (err) {
        console.error('Error deleting transaction:', err);
        showToast('Error deleting transaction', 'error');
    }
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// ========== SECURITY HELPER ==========
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
