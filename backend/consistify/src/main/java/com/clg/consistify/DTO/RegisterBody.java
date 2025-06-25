package com.clg.consistify.DTO;

import com.clg.consistify.user.UserModel;

import java.util.Set;

public class RegisterBody {
    private String username;
    private String email;
    private String password;
    private String role = "USER";
    private String xp = "E";
    private Set<UserModel> friends = null;

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getXp() {
        return xp;
    }

    public void setXp(String xp) {
        this.xp = xp;
    }

    public Set<UserModel> getFriends() {
        return friends;
    }

    public void setFriends(Set<UserModel> friends) {
        this.friends = friends;
    }
}