package com.clg.consistify.DTO;

import java.util.Date;

public class TaskUpdateDTO {
    private String oldtaskName;
    private String newtaskName;
    private Date startingDate;
    private Date lastDate;
    private String taskPriority;
    private String description;


    public TaskUpdateDTO(String oldtaskName, String newtaskName, Date startingDate, Date lastDate, String taskPriority, Long userId,String description) {
        this.newtaskName = newtaskName;
        this.startingDate = startingDate;
        this.lastDate = lastDate;
        this.taskPriority = taskPriority;
        this.oldtaskName=oldtaskName;
        this.description=description;
    }

    public TaskUpdateDTO() {

    }

    public String getNewtaskName() {
        return newtaskName;
    }

    public void setNewtaskName(String newtaskName) {
        this.newtaskName = newtaskName;
    }

    public String getOldtaskName() {
        return oldtaskName;
    }

    public void setOldtaskName(String oldtaskName) {
        this.oldtaskName = oldtaskName;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}