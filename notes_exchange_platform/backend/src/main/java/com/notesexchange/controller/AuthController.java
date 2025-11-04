package com.notesexchange.controller;

import com.notesexchange.dto.ApiResponse;
import com.notesexchange.dto.LoginRequest;
import com.notesexchange.dto.SignupRequest;
import com.notesexchange.model.User;
import com.notesexchange.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {



    @GetMapping("/test")
    public String test() {
        return "Auth controller is working!";
    }
    
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest) {
    try {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + loginRequest.getEmail());
        System.out.println("Password received: " + (loginRequest.getPassword() != null ? "***" : "null"));
        
        Optional<User> userOptional = authService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(null);
            System.out.println("Login SUCCESS for: " + user.getEmail());
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", user));
        } else {
            System.out.println("Login FAILED - invalid credentials");
            return ResponseEntity.ok(new ApiResponse(false, "Invalid email or password"));
        }
    } catch (Exception e) {
        System.err.println("=== LOGIN ERROR ===");
        e.printStackTrace(); // This will show the exact error
        return ResponseEntity.ok(new ApiResponse(false, "Login failed: " + e.getMessage()));
    }
}

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(@RequestBody SignupRequest signupRequest) {
        try {
            User user = authService.registerUser(
                signupRequest.getEmail(),
                signupRequest.getPassword(),
                signupRequest.getFirstName(),
                signupRequest.getLastName(),
                signupRequest.getUserType(),
                signupRequest.getDepartment()
            );
            
            // Remove password from response
            user.setPassword(null);
            return ResponseEntity.ok(new ApiResponse(true, "Registration successful", user));
            
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }
}

