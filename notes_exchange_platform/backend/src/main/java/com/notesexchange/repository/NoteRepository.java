package com.notesexchange.repository;

import com.notesexchange.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUploaderId(Long uploaderId);
    List<Note> findBySubject(String subject);
    List<Note> findByOrderByUploadDateDesc();
    List<Note> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
}