package com.clg.consistify.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}