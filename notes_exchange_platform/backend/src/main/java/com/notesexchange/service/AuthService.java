package com.notesexchange.service;

import com.notesexchange.model.User;
import com.notesexchange.model.UserType;
import com.notesexchange.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;

    public User registerUser(String email, String password, String firstName, String lastName, 
                           String userType, String department) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(password); // In real app, encrypt this
        user.setFirstName(firstName);
        user.setLastName(lastName);
        
        // Handle user type conversion safely
        try {
            user.setUserType(UserType.valueOf(userType.toUpperCase()));
        } catch (IllegalArgumentException e) {
            // Default to STUDENT if invalid type
            user.setUserType(UserType.STUDENT);
        }
        
        user.setDepartment(department);

        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // In real app, use password encryption
            if (user.getPassword().equals(password)) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
}