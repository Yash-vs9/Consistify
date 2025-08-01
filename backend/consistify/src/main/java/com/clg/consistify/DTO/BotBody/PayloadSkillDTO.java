package com.clg.consistify.DTO.BotBody;

import java.util.ArrayList;
import java.util.List;

public class PayloadSkillDTO {
    String type="xp_request";
    List<BotSkillBody> tasks=new ArrayList<>();

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<BotSkillBody> getTasks() {
        return tasks;
    }

    public void setTasks(List<BotSkillBody> tasks) {
        this.tasks = tasks;
    }
}
