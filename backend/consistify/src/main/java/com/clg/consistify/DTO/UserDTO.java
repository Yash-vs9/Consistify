package com.clg.consistify.DTO;

import java.util.List;

public class UserDTO {
    private String username;
    private List<String> friendRequests;
    private List<String> friends;
    private String email;


    public List<String> getFriendRequests() {
        return friendRequests;
    }

    public void setFriendRequests(List<String> friendRequests) {
        this.friendRequests = friendRequests;
    }

    public UserDTO(String username,String email, List<String> req, List<String> friends) {
        this.username = username;
        this.friendRequests = req;
        this.friends = friends;
        this.email=email;
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public List<String> getFriends() {
        return friends;
    }
}