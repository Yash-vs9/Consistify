package com.clg.consistify.DTO.BotBody;

import java.util.ArrayList;
import java.util.List;

public class PayloadDTO {
    String type="xp_request";
    String username="y";
    List<BotTaskBody> tasks=new ArrayList<>();

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<BotTaskBody> getTasks() {
        return tasks;
    }

    public void setTasks(List<BotTaskBody> tasks) {
        this.tasks = tasks;
    }
}
