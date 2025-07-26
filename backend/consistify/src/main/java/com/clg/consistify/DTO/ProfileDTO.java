package com.clg.consistify.DTO;

import java.math.BigInteger;

public class ProfileDTO {
    private String username;
    private String xp;
    private int noOfTasks;
    private int noOfFriends;

    public ProfileDTO(String username, String xp, Number taskCount, Number friendCount) {
        this.username = username;
        this.xp = xp;
        this.noOfTasks = taskCount != null ? taskCount.intValue() : 0;
        this.noOfFriends = friendCount != null ? friendCount.intValue() : 0;
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public String getXp() {
        return xp;
    }

    public int getNoOfTasks() {
        return noOfTasks;
    }

    public int getNoOfFriends() {
        return noOfFriends;
    }
}