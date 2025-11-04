package com.notesexchange.dto;

public class SignupRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String userType;
    private String department;

    // Constructors
    public SignupRequest() {}

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}