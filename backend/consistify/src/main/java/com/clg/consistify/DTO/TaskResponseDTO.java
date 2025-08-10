package com.clg.consistify.DTO;

import com.clg.consistify.user.TaskModel;
import org.springframework.data.redis.stream.Task;

import java.util.Date;
import java.util.List;

public class TaskResponseDTO {
    private String taskName;
    private String taskPriority;
    private Date startingDate;
    private Date lastDate;
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public TaskResponseDTO(TaskModel task) {
        this.taskName = task.getTaskName();
        this.taskPriority = task.getTaskPriority();
        this.startingDate = task.getStartingDate();
        this.lastDate = task.getLastDate();
        this.userName=task.getUser().getUsername();

    }
    public TaskResponseDTO(){

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

}
