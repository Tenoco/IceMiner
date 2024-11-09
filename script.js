// Global variables
let username = '';
let walletId = '';
let berkBalance = 0;
const MINING_RATE = 0.000000014;
const MIN_WITHDRAWAL = 100;
const STORAGE_KEY = 'iceminer_data';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('signup-btn').addEventListener('click', handleSignup);
    document.getElementById('login-toggle').addEventListener('click', toggleLoginForm);
    document.getElementById('withdraw-btn').addEventListener('click', handleWithdrawal);
}

// Sign up handler
function handleSignup() {
    const usernameInput = document.getElementById('username').value.trim();
    const walletInput = document.getElementById('bon-wallet').value.trim();

    if (!usernameInput || !walletInput) {
        showAlert('Please fill in all fields');
        return;
    }

    if (!walletInput.startsWith('BON')) {
        showAlert('Invalid BON wallet ID. Must start with "BON"');
        return;
    }

    username = usernameInput;
    walletId = walletInput;
    berkBalance = 0;

    // Save user data
    saveUserData();

    // Update UI
    document.getElementById('display-username').textContent = username;
    document.getElementById('display-wallet').textContent = walletId;
    
    // Switch to home section
    showSection('home');
    
    // Start mining
    startMining();
}

// Mining functionality
function startMining() {
    setInterval(() => {
        berkBalance += MINING_RATE;
        updateBalanceDisplay();
        saveUserData();
    }, 1000);
}

// Update balance display
function updateBalanceDisplay() {
    document.getElementById('berk-balance').textContent = berkBalance.toFixed(9);
}

// Handle withdrawal
function handleWithdrawal() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    
    if (isNaN(amount) || amount < MIN_WITHDRAWAL) {
        showAlert(`Minimum withdrawal amount is ${MIN_WITHDRAWAL} BERKS`);
        return;
    }

    if (amount > berkBalance) {
        showAlert('Insufficient balance');
        return;
    }

    // Create transfer data
    const transferData = {
        recipientName: username,
        recipientId: walletId,
        amount: amount,
        userId: walletId
    };

    // Create transaction code
    const transactionCode = CryptoJS.AES.encrypt(
        JSON.stringify(transferData),
        walletId
    ).toString();

    // Update balance
    berkBalance -= amount;
    updateBalanceDisplay();
    saveUserData();

    // Show transaction code
    const codeContainer = document.getElementById('transaction-code-container');
    const codeTextarea = document.getElementById('transaction-code');
    
    if (codeContainer && codeTextarea) {
        codeTextarea.value = transactionCode;
        codeContainer.classList.remove('hidden');
    }

    showAlert(`Successfully initiated withdrawal of ${amount} BERKS`);
}

// Copy transaction code
function copyTransactionCode() {
    const codeTextarea = document.getElementById('transaction-code');
    if (codeTextarea) {
        codeTextarea.select();
        document.execCommand('copy');
        showAlert('Transaction code copied to clipboard!');
    }
}

// Save user data
function saveUserData() {
    const data = {
        username,
        walletId,
        berkBalance,
        lastUpdate: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Load user data
function loadUserData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        username = data.username;
        walletId = data.walletId;
        berkBalance = data.berkBalance;

        // Update UI
        document.getElementById('display-username').textContent = username;
        document.getElementById('display-wallet').textContent = walletId;
        updateBalanceDisplay();
        
        // Switch to home section and start mining
        showSection('home');
        startMining();
    }
}

// Helper functions
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');
}

function showAlert(message) {
    alert(message); // You can replace this with a custom alert UI
}

function toggleLoginForm() {
    // Implementation for login functionality can be added here
    showAlert('Login functionality coming soon');
}

// Initialize transactionHistory array
const transactionHistory = [];

// Initialize receivedCodes array
const receivedCodes = [];

// Export necessary functions and variables
window.copyTransactionCode = copyTransactionCode;
window.transferBerks = transferBerks;
window.receiveBerks = receiveBerks;