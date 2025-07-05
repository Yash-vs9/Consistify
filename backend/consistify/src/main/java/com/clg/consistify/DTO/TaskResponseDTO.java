package com.clg.consistify.DTO;

import com.clg.consistify.user.TaskModel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
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
}