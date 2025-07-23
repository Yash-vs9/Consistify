package com.clg.consistify.user;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user_tasks")
public class TaskModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long task_id;

    @NotBlank(message = "Task name is required")
    @Column(unique = true)
    private String taskName;
    @NotNull(message = "Starting date is required")
    private Date startingDate;
    @NotNull(message = "Last date is required")
    private Date lastDate;

    public List<String> getCollaborators() {
        return collaborators;
    }

    public void setCollaborators(List<String> collaborators) {
        this.collaborators = collaborators;
    }

    private String taskPriority;

    @ElementCollection
    @CollectionTable(name = "task_collaborators", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "collaborator")
    private List<String> collaborators;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;





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

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }


}
