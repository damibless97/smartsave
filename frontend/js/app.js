// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const appScreens = document.getElementById('app-screens');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const navButtons = document.querySelectorAll('.nav-btn');
    const appScreensList = {
        dashboard: document.getElementById('dashboard-screen'),
        wallet: document.getElementById('wallet-screen'),
        history: document.getElementById('history-screen'),
        support: document.getElementById('support-screen')
    };
    
    // Auth Functions
    function toggleAuthScreens() {
        loginScreen.classList.toggle('hidden');
        signupScreen.classList.toggle('hidden');
    }
    
    showSignup.addEventListener('click', toggleAuthScreens);
    showLogin.addEventListener('click', toggleAuthScreens);
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, you would validate and send to server
        loginScreen.classList.add('hidden');
        appScreens.classList.remove('hidden');
        updateDashboard();
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, you would validate and send to server
        toggleAuthScreens();
    });
    
    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const screen = this.getAttribute('data-screen');
            
            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected screen
            Object.values(appScreensList).forEach(s => s.classList.add('hidden'));
            appScreensList[screen].classList.remove('hidden');
        });
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        appScreens.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });
    
    // Dashboard Functions
    function updateDashboard() {
        const now = new Date();
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('user-greeting').textContent = `Hi David 👋`;
        
        // Load plans from API
        fetch('/api/plans/')
            .then(response => response.json())
            .then(plans => {
                const select = document.getElementById('plan-select');
                select.innerHTML = '<option value="">Select a plan</option>';
                
                plans.forEach(plan => {
                    const option = document.createElement('option');
                    option.value = plan.id;
                    option.textContent = `${plan.name} - $${plan.amount}/day`;
                    select.appendChild(option);
                });
            });
    }
    
    // Plan Selection
    document.getElementById('save-plan').addEventListener('click', function() {
        const selectedPlan = document.getElementById('plan-select').value;
        if (!selectedPlan) {
            alert('Please select a plan');
            return;
        }
        
        alert(`Plan saved: ${selectedPlan}`);
        // In real app, send to server
    });
    
    // Wallet Functions
    document.getElementById('fund-wallet').addEventListener('click', function() {
        alert('Redirect to payment gateway');
    });
    
    document.getElementById('transfer-wallet').addEventListener('click', function() {
        alert('Transfer to daily wallet');
    });
    
    // History Functions
    document.getElementById('view-history').addEventListener('click', function() {
        // Switch to history screen
        navButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.nav-btn[data-screen="history"]').classList.add('active');
        
        Object.values(appScreensList).forEach(s => s.classList.add('hidden'));
        appScreensList.history.classList.remove('hidden');
        
        loadHistory();
    });
    
    function loadHistory() {
        const now = new Date();
        const monthName = now.toLocaleDateString('default', { month: 'long', year: 'numeric' });
        document.getElementById('current-month').textContent = monthName;
        
        fetch('/api/contributions/')
            .then(response => response.json())
            .then(contributions => {
                const historyList = document.getElementById('history-list');
                historyList.innerHTML = '';
                
                let total = 0;
                contributions.forEach(contribution => {
                    total += contribution.amount;
                    
                    const item = document.createElement('div');
                    item.className = 'history-item';
                    item.innerHTML = `
                        <div class="history-date">${contribution.date}</div>
                        <div class="history-amount">$${contribution.amount}</div>
                        <div class="history-status ${contribution.status.toLowerCase()}">${contribution.status}</div>
                    `;
                    historyList.appendChild(item);
                });
                
                document.getElementById('month-total').textContent = `$${total}`;
                document.getElementById('days-contributed').textContent = contributions.length;
            });
    }
    
    // Support Functions
    document.getElementById('whatsapp-support').addEventListener('click', function() {
        window.open('https://wa.me/1234567890', '_blank');
    });
    
    // Initialize
    if (window.location.hash === '#app') {
        loginScreen.classList.add('hidden');
        appScreens.classList.remove('hidden');
        updateDashboard();
    }
});