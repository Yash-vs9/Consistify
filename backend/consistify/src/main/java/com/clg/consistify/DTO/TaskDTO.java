package com.clg.consistify.DTO;

import java.util.Date;
import java.util.List;

public class TaskDTO {

    private Long task_id;
    private String taskName;
    private Date startingDate;
    private Date lastDate;
    private String taskPriority;
    private Long userId;
    private List<String> collaborators;

    public TaskDTO(List<String> collaborators) {
        this.collaborators = collaborators;
    }
    public TaskDTO() {
    }

    public TaskDTO(Long id, String taskName, Date startingDate, Date lastDate, String taskPriority, Long userId, List<String> collaborators) {
        this.task_id = id;
        this.taskName = taskName;
        this.startingDate = startingDate;
        this.lastDate = lastDate;
        this.taskPriority = taskPriority;
        this.userId = userId;
        this.collaborators = collaborators;
    }


    public Long getId() {
        return task_id;
    }

    public void setId(Long id) {
        this.task_id = id;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
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

    public String getTaskPriority() {
        return taskPriority;
    }

    public void setTaskPriority(String taskPriority) {
        this.taskPriority = taskPriority;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<String> getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(List<String> collaborators) {
        this.collaborators = collaborators;
    }
}