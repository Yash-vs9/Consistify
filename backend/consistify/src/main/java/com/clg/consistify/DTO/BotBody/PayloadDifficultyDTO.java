package com.clg.consistify.DTO.BotBody;

import java.util.ArrayList;
import java.util.List;

public class PayloadDifficultyDTO {
    String type="task_difficulty";
    List<BotDifficultyBody> tasks=new ArrayList<>();
    public List<BotDifficultyBody> getTasks() {
        return tasks;
    }

    public void setTasks(List<BotDifficultyBody> tasks) {
        this.tasks = tasks;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


}
