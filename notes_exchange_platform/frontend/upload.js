// upload.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.email) {
        window.location.href = 'login.html';
        return;
    }

    initializeUploadForm();
});

function initializeUploadForm() {
    const uploadForm = document.getElementById('uploadForm');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const selectedFiles = document.getElementById('selectedFiles');
    const fileList = document.getElementById('fileList');
    const resetBtn = document.getElementById('resetForm');

    let uploadedFiles = [];

    // Upload area click handler
    uploadArea.addEventListener('click', () => fileInput.click());

    // File input change handler
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // Form submission
    uploadForm.addEventListener('submit', handleFormSubmit);

    // Reset form
    resetBtn.addEventListener('click', resetForm);

    function handleFileSelect(e) {
        handleFiles(e.target.files);
    }

    function handleFiles(files) {
        if (files.length === 0) return;

        // Validate files
        for (let file of files) {
            if (!validateFile(file)) {
                continue;
            }

            // Check if file already exists
            if (!uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
                uploadedFiles.push(file);
            }
        }

        updateFileList();
        fileInput.value = ''; // Reset file input
    }

    function validateFile(file) {
        const allowedTypes = ['application/pdf', 'application/msword', 
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'application/vnd.ms-powerpoint',
                             'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                             'text/plain'];
        
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            showMessage(`File type not supported: ${file.name}`, 'error');
            return false;
        }

        if (file.size > maxSize) {
            showMessage(`File too large: ${file.name} (Max 10MB)`, 'error');
            return false;
        }

        return true;
    }

    function updateFileList() {
        fileList.innerHTML = '';

        if (uploadedFiles.length === 0) {
            selectedFiles.style.display = 'none';
            return;
        }

        selectedFiles.style.display = 'block';

        uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileSize = formatFileSize(file.size);
            const fileIcon = getFileIcon(file.type);

            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas ${fileIcon} file-icon"></i>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${fileSize}</div>
                    </div>
                </div>
                <button type="button" class="remove-file" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            fileList.appendChild(fileItem);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                uploadedFiles.splice(index, 1);
                updateFileList();
            });
        });
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getFileIcon(fileType) {
        const icons = {
            'application/pdf': 'fa-file-pdf',
            'application/msword': 'fa-file-word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word',
            'application/vnd.ms-powerpoint': 'fa-file-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'fa-file-powerpoint',
            'text/plain': 'fa-file-alt'
        };
        return icons[fileType] || 'fa-file';
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        // Validation
        if (uploadedFiles.length === 0) {
            showMessage('Please select at least one file to upload', 'error');
            return;
        }

        const formData = {
            title: document.getElementById('noteTitle').value.trim(),
            subject: document.getElementById('subject').value,
            course: document.getElementById('course').value.trim(),
            semester: document.getElementById('semester').value,
            description: document.getElementById('description').value.trim(),
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            isDigital: document.getElementById('isDigital').checked,
            isPhysical: document.getElementById('isPhysical').checked,
            access: document.querySelector('input[name="access"]:checked').value,
            files: uploadedFiles
        };

        if (!formData.title || !formData.subject || !formData.course || !formData.description) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }

        // Upload files
        uploadNotes(formData);
    }

    function uploadNotes(formData) {
        const uploadBtn = document.querySelector('.btn-primary');
        const originalText = uploadBtn.innerHTML;
        
        // Show loading state
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        uploadBtn.disabled = true;
        uploadForm.classList.add('loading');

        // Simulate upload process
        setTimeout(() => {
            // Save note data to localStorage (in real app, send to backend)
            const noteData = {
                id: Date.now(),
                ...formData,
                uploadDate: new Date().toISOString(),
                uploader: JSON.parse(localStorage.getItem('currentUser')).email,
                downloads: 0,
                rating: 0,
                // Remove actual File objects for storage
                files: formData.files.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                }))
            };

            // Save to localStorage
            const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
            notes.push(noteData);
            localStorage.setItem('userNotes', JSON.stringify(notes));

            // Update user stats
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.notesShared = (currentUser.notesShared || 0) + 1;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showMessage('Notes uploaded successfully!', 'success');
            
            // Reset form
            resetForm();
            
            // Reset button state
            uploadBtn.innerHTML = originalText;
            uploadBtn.disabled = false;
            uploadForm.classList.remove('loading');

            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        }, 3000);
    }

    function resetForm() {
        uploadForm.reset();
        uploadedFiles = [];
        updateFileList();
        showMessage('Form has been reset', 'warning');
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
    
    const uploadContainer = document.querySelector('.upload-container');
    uploadContainer.insertBefore(messageDiv, uploadContainer.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}