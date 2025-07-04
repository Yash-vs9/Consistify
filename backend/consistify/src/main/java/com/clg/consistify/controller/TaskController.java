package com.clg.consistify.controller;

import com.clg.consistify.DTO.TaskDTO;
import com.clg.consistify.DTO.TaskResponseDTO;
import com.clg.consistify.services.TaskService;
import com.clg.consistify.user.TaskModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {
    private TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    @PostMapping("/create")
    public ResponseEntity<Void> createTask(@RequestBody TaskDTO taskDTO) {
        taskService.createTask(taskDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping("/get")
    public ResponseEntity<List<String>> getTasks(){
        return ResponseEntity.ok(taskService.taskNames());
    }
    @GetMapping("/getModel")
    public ResponseEntity<List<TaskResponseDTO>> getAllTask(){
        return ResponseEntity.ok(taskService.getTaskModel());
    }

}
