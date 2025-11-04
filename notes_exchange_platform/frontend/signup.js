const API_BASE_URL = 'http://localhost:8088/api';

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: passwordInput.value,
            userType: document.getElementById('userType').value,
            department: document.getElementById('department').value
        };

        console.log('Form data:', formData);

        // Validation
        const validation = validateSignupForm(formData);
        if (!validation.isValid) {
            showMessage(validation.message, 'error');
            return;
        }

        await registerUser(formData);
    });

    // Real-time password validation
    passwordInput.addEventListener('input', function() {
        validatePasswordStrength(this.value);
    });

    confirmPasswordInput.addEventListener('input', function() {
        validatePasswordMatch();
    });
});

async function registerUser(formData) {
    const signupBtn = document.querySelector('.btn-primary');
    const originalText = signupBtn.innerHTML;
    
    // Show loading state
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    signupBtn.disabled = true;

    try {
        console.log('Sending request to:', `${API_BASE_URL}/auth/signup`);
        
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Response data:', result);

        if (response.ok && result.success) {
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(result.data));
            showMessage('Account created successfully! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html'; // Change to your actual dashboard
            }, 1500);
        } else {
            showMessage(result.message || 'Registration failed: ' + response.status, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Network error. Please check console and try again.', 'error');
    } finally {
        // Reset button state
        signupBtn.innerHTML = originalText;
        signupBtn.disabled = false;
    }
}

function validateSignupForm(data) {
    if (!data.firstName || !data.lastName) {
        return { isValid: false, message: 'Please enter your first and last name' };
    }
    
    if (!data.email) {
        return { isValid: false, message: 'Please enter your email' };
    }
    
    if (!data.password) {
        return { isValid: false, message: 'Please enter a password' };
    }
    
    if (data.password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (data.password !== confirmPassword) {
        return { isValid: false, message: 'Passwords do not match' };
    }
    
    if (!data.userType) {
        return { isValid: false, message: 'Please select your role' };
    }
    
    if (!data.department) {
        return { isValid: false, message: 'Please select your department' };
    }
    
    if (!document.getElementById('agreeTerms').checked) {
        return { isValid: false, message: 'Please agree to the terms and conditions' };
    }
    
    return { isValid: true, message: '' };
}

function validatePasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    if (!strengthIndicator) return;
    
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    switch(strength) {
        case 0:
        case 1:
            feedback = 'Weak';
            break;
        case 2:
            feedback = 'Medium';
            break;
        case 3:
            feedback = 'Strong';
            break;
        case 4:
            feedback = 'Very Strong';
            break;
    }
    
    strengthIndicator.textContent = feedback;
}

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchIndicator = document.getElementById('passwordMatch');
    
    if (!matchIndicator) return;
    
    if (confirmPassword === '') {
        matchIndicator.textContent = '';
    } else if (password === confirmPassword) {
        matchIndicator.textContent = 'Passwords match';
        matchIndicator.style.color = 'green';
    } else {
        matchIndicator.textContent = 'Passwords do not match';
        matchIndicator.style.color = 'red';
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 500px;
        ${type === 'success' ? 'background: #28a745;' : ''}
        ${type === 'error' ? 'background: #dc3545;' : ''}
    `;
    
    messageEl.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
    `;
    
    document.body.appendChild(messageEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentElement) {
            messageEl.remove();
        }
    }, 5000);
}