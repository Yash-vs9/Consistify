package com.clg.consistify.services;

import com.clg.consistify.DTO.TaskDTO;
import com.clg.consistify.repository.TaskRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.TaskModel;
import com.clg.consistify.user.UserModel;
import org.springframework.stereotype.Service;


import java.util.Optional;
@Service
public class TaskService {
    private TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
    private UserRepository userRepository;
    public void createTask(TaskDTO body){
        TaskModel task=new TaskModel();
        task.setTaskName(body.getTaskName());
        task.setTaskPriority(body.getTaskPriority());
        task.setLastDate(body.getLastDate());
        task.setStartingDate(body.getStartingDate());
        Long userId=body.getUserId();
        Optional<UserModel> user=userRepository.findById(userId);
        if(user.isPresent()){
            task.setUser(user.get());
            taskRepository.save(task);
        }
        else{
            throw new RuntimeException("User not found with ID "+userId);
        }
    }


}
