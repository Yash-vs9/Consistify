package com.clg.consistify.DTO;

import com.clg.consistify.user.TaskModel;

import java.util.Date;
import java.util.List;

public class TaskResponseDTO {
    private String taskName;
    private String taskPriority;
    private Date startingDate;
    private Date lastDate;
    private List<String> collaborators;
    public TaskResponseDTO(TaskModel task) {
        this.taskName = task.getTaskName();
        this.taskPriority = task.getTaskPriority();
        this.startingDate = task.getStartingDate();
        this.lastDate = task.getLastDate();
        this.collaborators = task.getCollaborators();

    }
    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getTaskPriority() {
        return taskPriority;
    }

    public void setTaskPriority(String taskPriority) {
        this.taskPriority = taskPriority;
    }

    public Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(Date startingDate) {
        this.startingDate = startingDate;
    }

    public Date getLastDate() {
        return lastDate;
    }

    public void setLastDate(Date lastDate) {
        this.lastDate = lastDate;
    }

    public List<String> getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(List<String> collaborators) {
        this.collaborators = collaborators;
    }
}
