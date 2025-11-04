package com.notesexchange.controller;

import com.notesexchange.dto.ApiResponse;
import com.notesexchange.model.User;
import com.notesexchange.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            users.forEach(user -> user.setPassword(null)); // Remove passwords
            return ResponseEntity.ok(new ApiResponse(true, "Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve users"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userService.getUserById(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setPassword(null); // Remove password
                return ResponseEntity.ok(new ApiResponse(true, "User retrieved successfully", user));
            } else {
                return ResponseEntity.ok(new ApiResponse(false, "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to retrieve user"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            if (updatedUser != null) {
                updatedUser.setPassword(null); // Remove password
                return ResponseEntity.ok(new ApiResponse(true, "User updated successfully", updatedUser));
            } else {
                return ResponseEntity.ok(new ApiResponse(false, "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Failed to update user"));
        }
    }
}