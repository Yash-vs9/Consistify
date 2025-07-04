package com.clg.consistify.services;

import com.clg.consistify.DTO.TaskDTO;
import com.clg.consistify.DTO.TaskResponseDTO;
import com.clg.consistify.exception.UserNotFoundException;
import com.clg.consistify.repository.TaskRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.TaskModel;
import com.clg.consistify.user.UserModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
    private UserRepository userRepository;
    public void createTask(TaskDTO body) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        TaskModel task = new TaskModel();
        task.setTaskName(body.getTaskName());
        task.setTaskPriority(body.getTaskPriority());
        task.setLastDate(body.getLastDate());
        task.setStartingDate(body.getStartingDate());
        task.setCollaborators(body.getCollaborators());

        task.setUser(user);              // set owner
        user.getTasks().add(task);       // add to user's task list

        userRepository.save(user);       // save only user, cascade will save task
    }
    public List<TaskResponseDTO> getTaskModel(){
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        UserModel user=userRepository.findByUsername(username)
                .orElseThrow(()-> new UsernameNotFoundException("NO user"));
        return user.getTasks()
                .stream()
                .map(TaskResponseDTO::new)
                .collect(Collectors.toList());
    }
    public List<String> taskNames(){
        String username= SecurityContextHolder.getContext().getAuthentication().getName();
        UserModel user=userRepository.findByUsername(username)
                .orElseThrow(()-> new UsernameNotFoundException("NO user"));
        return user.getTasks()
                .stream()
                .map(TaskModel::getTaskName)
                .toList();

    }


}
