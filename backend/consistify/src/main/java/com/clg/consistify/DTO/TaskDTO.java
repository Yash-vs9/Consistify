package com.clg.consistify.DTO;

import java.util.Date;

public class TaskDTO {

    private Long id;
    private String taskName;
    private Date startingDate;
    private Date lastDate;
    private String taskPriority;
    private Long userId;


    public TaskDTO() {}

    public TaskDTO(Long id, String taskName, Date startingDate, Date lastDate, String taskPriority, Long userId) {
        this.id = id;
        this.taskName = taskName;
        this.startingDate = startingDate;
        this.lastDate = lastDate;
        this.taskPriority = taskPriority;
        this.userId = userId;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}