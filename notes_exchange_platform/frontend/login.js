// login.js - Updated for backend integration
const API_BASE_URL = 'http://localhost:8088/api';

// Add CORS headers to requests
const defaultOptions = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
};


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validation
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        await loginUser(email, password);
    });

    // Input validation styling
    const inputs = [emailInput, passwordInput];
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
});

async function loginUser(email, password) {
    const loginBtn = document.querySelector('.btn-primary');
    const originalText = loginBtn.innerHTML;
    
    // Show loading state
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            ...defaultOptions,
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify(result.data));
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage(result.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}

// Keep other utility functions the same...
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateField(field) {
    if (field.type === 'email' && field.value.trim() !== '') {
        if (!validateEmail(field.value)) {
            field.style.borderColor = 'var(--danger)';
        } else {
            field.style.borderColor = 'var(--success)';
        }
    } else if (field.value.trim() === '') {
        field.style.borderColor = 'var(--danger)';
    } else {
        field.style.borderColor = 'var(--success)';
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.querySelector('.form');
    form.insertBefore(messageDiv, form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}