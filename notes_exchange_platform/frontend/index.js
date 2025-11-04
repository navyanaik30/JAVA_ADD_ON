// index.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.email) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize main dashboard
    initializeMainDashboard(currentUser);
});

function initializeMainDashboard(user) {
    // Update user information
    updateUserInfo(user);
    
    // Load dashboard data
    loadDashboardData();
    
    // Load recent notes
    loadRecentNotes();
    
    // Load featured notes
    loadFeaturedNotes();
    
    // Setup event listeners
    setupMainEventListeners();
}

function updateUserInfo(user) {
    // Update header
    document.getElementById('headerUserName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('mainUserName').textContent = user.firstName;
    
    // Update profile image if available
    if (user.profileImage) {
        document.getElementById('headerProfileImage').src = user.profileImage;
    }
}

function loadDashboardData() {
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allUsers = Object.keys(localStorage)
        .filter(key => key.startsWith('user_'))
        .length;

    // Welcome section stats
    document.getElementById('welcomeTotalNotes').textContent = notes.length;
    document.getElementById('welcomeActiveUsers').textContent = allUsers;

    // User activity stats
    const myUploads = notes.filter(note => note.uploader === currentUser.email).length;
    const myDownloads = currentUser.downloads || 0;
    const myRating = currentUser.rating || '0.0';
    const myContributions = (myUploads || 0) + (currentUser.questions || 0) + (currentUser.answers || 0);

    document.getElementById('myUploadsCount').textContent = myUploads;
    document.getElementById('myDownloadsCount').textContent = myDownloads;
    document.getElementById('myRating').textContent = myRating;
    document.getElementById('myContributions').textContent = myContributions;
}

function loadRecentNotes() {
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    const recentNotesContainer = document.getElementById('recentNotesGrid');
    
    // Sort by upload date and take latest 4
    const recentNotes = notes
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
        .slice(0, 4);

    if (recentNotes.length === 0) {
        recentNotesContainer.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 40px;">
                <i class="fas fa-inbox" style="font-size: 3rem; color: var(--gray); margin-bottom: 15px;"></i>
                <h3 style="color: var(--gray); margin-bottom: 10px;">No Notes Yet</h3>
                <p style="color: var(--gray);">Start sharing your knowledge with the community!</p>
                <a href="upload.html" class="btn btn-primary" style="margin-top: 15px;">
                    <i class="fas fa-upload"></i> Share Your First Notes
                </a>
            </div>
        `;
        return;
    }

    recentNotesContainer.innerHTML = recentNotes.map(note => `
        <div class="note-card" data-format="${note.isDigital ? 'digital' : 'physical'}">
            <div class="note-header">
                <div>
                    <div class="note-title">${note.title}</div>
                    <div class="note-subject">${formatSubject(note.subject)}</div>
                </div>
                <div class="note-format ${note.isDigital ? 'digital' : 'physical'}">
                    ${note.isDigital ? 'Digital' : 'Physical'}
                </div>
            </div>
            <div class="note-meta">
                <span>By ${getUploaderName(note.uploader)}</span>
                <span>${formatDate(note.uploadDate)}</span>
            </div>
            <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 15px; line-height: 1.4;">
                ${note.description.length > 80 ? note.description.substring(0, 80) + '...' : note.description}
            </p>
            <div class="note-tags">
                ${note.tags && note.tags.slice(0, 3).map(tag => `
                    <span class="tag">${tag}</span>
                `).join('')}
            </div>
            <div class="note-actions">
                <button class="btn btn-primary btn-small" onclick="downloadNote(${note.id})">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn btn-secondary btn-small" onclick="viewNoteDetails(${note.id})">
                    <i class="fas fa-eye"></i> Details
                </button>
            </div>
        </div>
    `).join('');

    // Add filter functionality
    setupNoteFilters();
}

function loadFeaturedNotes() {
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    const featuredContainer = document.getElementById('featuredNotes');
    
    // For demo, take first 3 notes as featured
    const featuredNotes = notes.slice(0, 3);

    if (featuredNotes.length === 0) {
        featuredContainer.innerHTML = `
            <div class="text-center" style="padding: 40px;">
                <p style="color: var(--gray);">No featured notes available yet.</p>
            </div>
        `;
        return;
    }

    featuredContainer.innerHTML = featuredNotes.map(note => `
        <div class="featured-note">
            <div class="featured-badge">
                <i class="fas fa-star"></i> Featured
            </div>
            <h4>${note.title}</h4>
            <p>${note.description.length > 100 ? note.description.substring(0, 100) + '...' : note.description}</p>
            <div class="featured-meta">
                <span>By ${getUploaderName(note.uploader)}</span>
                <span>${note.downloads || 0} downloads</span>
            </div>
        </div>
    `).join('');
}

function setupMainEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('input', debounce(handleGlobalSearch, 300));

    // Quick search button
    document.getElementById('quickSearchBtn').addEventListener('click', function() {
        document.getElementById('globalSearch').focus();
    });

    // Ask question functionality
    document.getElementById('askQuestionBtn').addEventListener('click', openQuestionModal);
    document.getElementById('closeQuestionModal').addEventListener('click', closeQuestionModal);
    document.getElementById('cancelQuestion').addEventListener('click', closeQuestionModal);

    // Question form submission
    document.getElementById('questionForm').addEventListener('submit', handleQuestionSubmit);

    // Close modal when clicking outside
    document.getElementById('questionModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeQuestionModal();
        }
    });
}

function setupNoteFilters() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    const noteCards = document.querySelectorAll('.note-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            
            // Filter notes
            noteCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-format') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function handleGlobalSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm.length === 0) {
        // Reset to show all notes
        document.querySelectorAll('.note-card').forEach(card => {
            card.style.display = 'block';
        });
        return;
    }

    // Filter notes based on search term
    document.querySelectorAll('.note-card').forEach(card => {
        const title = card.querySelector('.note-title').textContent.toLowerCase();
        const subject = card.querySelector('.note-subject').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || subject.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function openQuestionModal() {
    document.getElementById('questionModal').classList.add('active');
}

function closeQuestionModal() {
    document.getElementById('questionModal').classList.remove('active');
    document.getElementById('questionForm').reset();
}

function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('questionTitle').value.trim(),
        subject: document.getElementById('questionSubject').value,
        description: document.getElementById('questionDescription').value.trim(),
        date: new Date().toISOString()
    };

    if (!formData.title || !formData.subject || !formData.description) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    // Save question (in real app, send to backend)
    const questions = JSON.parse(localStorage.getItem('userQuestions') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const question = {
        id: Date.now(),
        ...formData,
        asker: currentUser.email,
        answers: [],
        status: 'open'
    };
    
    questions.push(question);
    localStorage.setItem('userQuestions', JSON.stringify(questions));

    // Update user stats
    currentUser.questions = (currentUser.questions || 0) + 1;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showMessage('Question posted successfully!', 'success');
    closeQuestionModal();
    
    // Refresh stats
    loadDashboardData();
}

// Utility functions (reuse from previous files)
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

function downloadNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    const note = notes.find(n => n.id === noteId);
    
    if (note) {
        note.downloads = (note.downloads || 0) + 1;
        localStorage.setItem('userNotes', JSON.stringify(notes));

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.downloads = (currentUser.downloads || 0) + 1;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showMessage(`Downloading "${note.title}"...`, 'success');
        loadDashboardData(); // Refresh stats
    }
}

function viewNoteDetails(noteId) {
    showMessage('Note details feature coming soon!', 'warning');
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

// Add tag styles to CSS
const tagStyles = `
.note-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 15px;
}

.tag {
    background: var(--light-gray);
    color: var(--dark);
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 500;
}

.note-format.digital {
    background: var(--primary);
    color: white;
}

.note-format.physical {
    background: var(--warning);
    color: var(--dark);
}
`;

// Inject tag styles
const styleSheet = document.createElement('style');
styleSheet.textContent = tagStyles;
document.head.appendChild(styleSheet);