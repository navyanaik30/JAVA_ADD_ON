// dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.email) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard(currentUser);
});

function initializeDashboard(user) {
    // Update user greeting
    document.getElementById('userGreeting').textContent = user.firstName || 'User';

    // Load and display stats
    loadDashboardStats();

    // Load recent notes
    loadRecentNotes();

    // Set up event listeners
    setupEventListeners();
}

function loadDashboardStats() {
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Calculate stats
    const totalNotes = notes.length;
    const myUploads = notes.filter(note => note.uploader === currentUser.email).length;
    const myDownloads = currentUser.downloads || 0;
    const activeUsers = Object.keys(localStorage)
        .filter(key => key.startsWith('user_'))
        .length;

    // Update DOM
    document.getElementById('totalNotes').textContent = totalNotes;
    document.getElementById('myUploads').textContent = myUploads;
    document.getElementById('myDownloads').textContent = myDownloads;
    document.getElementById('activeUsers').textContent = activeUsers;
}

function loadRecentNotes() {
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    const recentNotesContainer = document.getElementById('recentNotes');
    
    // Sort notes by upload date (newest first) and take latest 6
    const recentNotes = notes
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
        .slice(0, 6);

    if (recentNotes.length === 0) {
        recentNotesContainer.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 40px;">
                <i class="fas fa-inbox" style="font-size: 3rem; color: var(--gray); margin-bottom: 15px;"></i>
                <h3 style="color: var(--gray); margin-bottom: 10px;">No Notes Available</h3>
                <p style="color: var(--gray);">Be the first to share your notes with the community!</p>
                <a href="upload.html" class="btn btn-primary" style="margin-top: 15px;">
                    <i class="fas fa-upload"></i> Upload Notes
                </a>
            </div>
        `;
        return;
    }

    recentNotesContainer.innerHTML = recentNotes.map(note => `
        <div class="note-card">
            <div class="note-header">
                <div>
                    <div class="note-title">${note.title}</div>
                    <div class="note-subject">${formatSubject(note.subject)}</div>
                </div>
                <div class="note-format">${note.isDigital ? 'Digital' : 'Physical'}</div>
            </div>
            <div class="note-meta">
                <span>By ${getUploaderName(note.uploader)}</span>
                <span>${formatDate(note.uploadDate)}</span>
            </div>
            <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">
                ${note.description.length > 100 ? note.description.substring(0, 100) + '...' : note.description}
            </p>
            <div class="note-actions">
                <button class="btn btn-primary btn-small" onclick="downloadNote(${note.id})">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn btn-secondary btn-small" onclick="viewNote(${note.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `).join('');
}

function formatSubject(subject) {
    const subjects = {
        'mathematics': 'Mathematics',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'programming': 'Programming',
        'database': 'Database Management'
    };
    return subjects[subject] || subject;
}

function getUploaderName(email) {
    const userData = localStorage.getItem('user_' + email);
    if (userData) {
        const user = JSON.parse(userData);
        return `${user.firstName} ${user.lastName.charAt(0)}.`;
    }
    return email.split('@')[0];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Quick action cards
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                showMessage('Feature coming soon!', 'warning');
            }
        });
    });
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    // In a real app, you would filter notes based on search term
    console.log('Searching for:', searchTerm);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Note actions
function downloadNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        // Update download count
        note.downloads = (note.downloads || 0) + 1;
        localStorage.setItem('userNotes', JSON.stringify(notes));

        // Update user download stats
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.downloads = (currentUser.downloads || 0) + 1;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showMessage(`Downloading "${note.title}"...`, 'success');
        
        // Simulate download
        setTimeout(() => {
            // In real app, this would trigger actual file download
            console.log('Downloading note:', note.title);
        }, 1000);
    }
}

function viewNote(noteId) {
    showMessage('Note preview feature coming soon!', 'warning');
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