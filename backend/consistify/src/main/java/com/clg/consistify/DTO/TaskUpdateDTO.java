package com.clg.consistify.DTO;

import java.util.Date;
import java.util.List;

public class TaskUpdateDTO {
    private String oldtaskName;
    private String newtaskName;
    private Date startingDate;
    private Date lastDate;
    private String taskPriority;
    private List<String> collaborators;

    public TaskUpdateDTO(String oldtaskName, String newtaskName, Date startingDate, Date lastDate, String taskPriority, Long userId, List<String> collaborators) {
        this.newtaskName = newtaskName;
        this.startingDate = startingDate;
        this.lastDate = lastDate;
        this.taskPriority = taskPriority;
        this.collaborators = collaborators;
        this.oldtaskName=oldtaskName;
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

    public List<String> getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(List<String> collaborators) {
        this.collaborators = collaborators;
    }
}