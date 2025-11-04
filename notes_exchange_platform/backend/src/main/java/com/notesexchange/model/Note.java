package com.notesexchange.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    private String subject;

    private String course;
    private String semester;
    private String tags;

    @Column(name = "is_digital")
    private Boolean isDigital = true;

    @Column(name = "is_physical")
    private Boolean isPhysical = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "access_level")
    private AccessLevel accessLevel = AccessLevel.PUBLIC;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @ManyToOne
    @JoinColumn(name = "uploader_id")
    private User uploader;

    private Integer downloads = 0;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    // Constructors
    public Note() {
        this.uploadDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public Boolean getIsDigital() { return isDigital; }
    public void setIsDigital(Boolean isDigital) { this.isDigital = isDigital; }

    public Boolean getIsPhysical() { return isPhysical; }
    public void setIsPhysical(Boolean isPhysical) { this.isPhysical = isPhysical; }

    public AccessLevel getAccessLevel() { return accessLevel; }
    public void setAccessLevel(AccessLevel accessLevel) { this.accessLevel = accessLevel; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public User getUploader() { return uploader; }
    public void setUploader(User uploader) { this.uploader = uploader; }

    public Integer getDownloads() { return downloads; }
    public void setDownloads(Integer downloads) { this.downloads = downloads; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
}

// AccessLevel enum moved to separate file