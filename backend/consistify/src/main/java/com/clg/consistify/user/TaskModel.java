package com.clg.consistify.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long task_id;

    private String taskName;
    private Date startingDate;
    private Date lastDate;
    private String taskPriority;

    @ElementCollection
    @CollectionTable(name = "task_collaborators", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "collaborator")
    private List<String> collaborators;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;
}