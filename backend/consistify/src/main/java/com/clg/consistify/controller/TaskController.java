package com.clg.consistify.controller;

import com.clg.consistify.DTO.DeleteTaskDTO;
import com.clg.consistify.DTO.TaskDTO;

import com.clg.consistify.DTO.TaskResponseDTO;
import com.clg.consistify.DTO.TaskUpdateDTO;
import com.clg.consistify.services.TaskService;
import com.clg.consistify.user.TaskModel;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody TaskDTO body) {
        TaskResponseDTO createdTask = taskService.createTask(body);
        System.out.println(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }
    @GetMapping("/get")
    public ResponseEntity<List<String>> getTasks(){
        return ResponseEntity.ok(taskService.taskNames());
    }
    @GetMapping("/getModel")
    public ResponseEntity<List<TaskResponseDTO>> getAllTask(){
        return ResponseEntity.ok(taskService.getTaskModel());
    }
    @DeleteMapping("/delete/{taskName}")
    public ResponseEntity<String> deletebytaskid(@PathVariable String taskName){
        String userName= SecurityContextHolder.getContext().getAuthentication().getName();
        taskService.deletebyuserId(taskName);
        return ResponseEntity.ok("Task deleted Successfully. ");
    }
    @PutMapping("/edit")
    public ResponseEntity<String> editusertask(@Valid @RequestBody TaskUpdateDTO taskUpdateDTO){
        taskService.updateTask(taskUpdateDTO);
        return ResponseEntity.ok("Task Updated Successfully");
    }
}
