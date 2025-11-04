// profile.js
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.email) {
        window.location.href = 'login.html';
        return;
    }

    // Populate profile data
    populateProfileData(currentUser);

    // Form event listeners
    document.getElementById('profileForm').addEventListener('submit', updateProfile);
    document.getElementById('passwordForm').addEventListener('submit', changePassword);
    document.getElementById('cancelEdit').addEventListener('click', resetForm);

    // Profile image upload
    document.querySelector('.edit-avatar-btn').addEventListener('click', triggerImageUpload);
    document.getElementById('profileImage').addEventListener('click', triggerImageUpload);
});

function populateProfileData(user) {
    // Basic info
    document.getElementById('userName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('userRole').textContent = formatUserType(user.userType);
    document.getElementById('userDepartment').textContent = formatDepartment(user.department);
    
    // Stats
    document.getElementById('notesCount').textContent = user.notesShared || 0;
    document.getElementById('downloadsCount').textContent = user.downloads || 0;
    document.getElementById('rating').textContent = user.rating || '0.0';

    // Form fields
    document.getElementById('editFirstName').value = user.firstName || '';
    document.getElementById('editLastName').value = user.lastName || '';
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editUserType').value = user.userType || 'student';
    document.getElementById('editDepartment').value = user.department || 'cse';
    document.getElementById('editBio').value = user.bio || '';

    // Profile image
    if (user.profileImage) {
        document.getElementById('profileImage').src = user.profileImage;
    }
}

function formatUserType(userType) {
    const types = {
        'student': 'Student',
        'senior': 'Senior Student',
        'faculty': 'Faculty'
    };
    return types[userType] || 'Student';
}

function formatDepartment(dept) {
    const departments = {
        'cse': 'Computer Science',
        'ece': 'Electronics & Communication',
        'mech': 'Mechanical Engineering',
        'civil': 'Civil Engineering'
    };
    return departments[dept] || 'Computer Science';
}

function updateProfile(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('editFirstName').value.trim(),
        lastName: document.getElementById('editLastName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        userType: document.getElementById('editUserType').value,
        department: document.getElementById('editDepartment').value,
        bio: document.getElementById('editBio').value.trim()
    };

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    if (!validateEmail(formData.email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Update user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const updatedUser = { ...currentUser, ...formData };
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('user_' + currentUser.email, JSON.stringify(updatedUser));

    // Update displayed data
    populateProfileData(updatedUser);
    
    showMessage('Profile updated successfully!', 'success');
}

function changePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showMessage('Please fill in all password fields', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage('New password must be at least 6 characters long', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match', 'error');
        return;
    }

    // In a real app, you would verify current password with backend
    // For demo purposes, we'll assume it's correct
    
    showMessage('Password updated successfully!', 'success');
    
    // Clear password fields
    document.getElementById('passwordForm').reset();
}

function resetForm() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    populateProfileData(currentUser);
    showMessage('Changes discarded', 'warning');
}

function triggerImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                document.getElementById('profileImage').src = imageUrl;
                
                // Save to local storage
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                currentUser.profileImage = imageUrl;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                showMessage('Profile picture updated!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}