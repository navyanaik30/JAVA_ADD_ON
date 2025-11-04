CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(10) DEFAULT 'STUDENT',
    department VARCHAR(100),
    bio CLOB,
    profile_image BLOB,
    notes_shared INT DEFAULT 0,
    downloads INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description CLOB,
    subject VARCHAR(100) NOT NULL,
    course VARCHAR(100),
    semester VARCHAR(50),
    tags VARCHAR(500),
    is_digital BOOLEAN DEFAULT TRUE,
    is_physical BOOLEAN DEFAULT FALSE,
    access_level VARCHAR(10) DEFAULT 'PUBLIC',
    file_path VARCHAR(500),
    file_size BIGINT,
    uploader_id BIGINT NOT NULL,
    downloads INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE downloads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    note_id BIGINT NOT NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

CREATE TABLE ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    note_id BIGINT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_note UNIQUE (user_id, note_id)
);

CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description CLOB NOT NULL,
    subject VARCHAR(100),
    asker_id BIGINT NOT NULL,
    status VARCHAR(10) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asker_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT NOT NULL,
    answerer_id BIGINT NOT NULL,
    answer_text CLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (answerer_id) REFERENCES users(id) ON DELETE CASCADE
);