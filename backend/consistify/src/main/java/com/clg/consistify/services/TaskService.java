package com.clg.consistify.services;

import com.clg.consistify.DTO.TaskDTO;
import com.clg.consistify.DTO.TaskResponseDTO;
import com.clg.consistify.DTO.TaskUpdateDTO;
import com.clg.consistify.exception.TaskAlreadyExistException;
import com.clg.consistify.exception.TaskNotFoundException;
import com.clg.consistify.repository.TaskRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.TaskModel;
import com.clg.consistify.user.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    @Autowired
    private CacheManager cacheManager;
    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }
    @CacheEvict(value = "TaskModels", key = "#username")
    public TaskResponseDTO createTask(TaskDTO body,String username) {

        UserModel user = getUserByUsername(username);


        boolean taskExists = user.getTasks()
                .stream()
                .anyMatch(task -> task.getTaskName().equalsIgnoreCase(body.getTaskName()));

        if (taskExists) {
            throw new TaskAlreadyExistException("Task already exist with this name.");
        }
        if (body.getStartingDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter all fields.");
        }

        if (body.getLastDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter all fields.");
        }


        LocalDate startDate = toLocalDate(body.getStartingDate());
        LocalDate today = LocalDate.now();
        if (startDate.isBefore(today)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Starting date cannot be in the past.");
        }


        LocalDate endDate = toLocalDate(body.getLastDate());
        if (endDate.isBefore(startDate)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Last date must be after or same as starting date.");
        }
        if(body.getTaskPriority()==null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Enter all fields");
        }
        TaskModel task = new TaskModel();
        task.setTaskName(body.getTaskName());
        task.setTaskPriority(body.getTaskPriority());
        task.setStartingDate(body.getStartingDate());
        task.setLastDate(body.getLastDate());
        task.setCollaborators(body.getCollaborators());
        task.setUser(user);

        user.getTasks().add(task);
        userRepository.save(user);
        return new TaskResponseDTO(task);

    }
    @Transactional
    @Cacheable(value = "TaskModels", key = "#username")
    public List<TaskResponseDTO> getTaskModel(String username) {
        UserModel user = getUserByUsername(username);
        System.out.println("DB calling idk why");
        System.out.println("DB calling idk why");

        System.out.println("DB calling idk why");

        System.out.println("DB calling idk why");


        return user.getTasks()
                .stream()
                .map(TaskResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<String> taskNames() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return user.getTasks()
                .stream()
                .map(TaskModel::getTaskName)
                .collect(Collectors.toList());
    }

    public void deleteByUserName(String deletetaskname) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


        Optional<TaskModel> taskOptional = user.getTasks()
                .stream()
                .filter(task -> task.getTaskName().equals(deletetaskname))
                .findFirst();

        if (taskOptional.isPresent()) {
            TaskModel taskToDelete = taskOptional.get();
            user.getTasks().remove(taskToDelete);
            userRepository.save(user);
            cacheManager.getCache("TaskModels").evict(username);

        } else {
            throw new IllegalArgumentException("Task not found or not authorized to delete.");
        }
    }

    public void updateTask(TaskUpdateDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserModel user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 1. Find the task using old task name
        TaskModel task = user.getTasks()
                .stream()
                .filter(t -> t.getTaskName().equalsIgnoreCase(dto.getOldtaskName()))
                .findFirst()
                .orElseThrow(() -> new TaskAlreadyExistException("Task with the old name not found"));

        // 2. Check if another task with the new name already exists (avoid duplicate names)
        if (dto.getNewtaskName() != null && !dto.getNewtaskName().equalsIgnoreCase(dto.getOldtaskName())) {
            boolean exists = user.getTasks()
                    .stream()
                    .anyMatch(t -> t.getTaskName().equalsIgnoreCase(dto.getNewtaskName()));
            if (exists) {
                throw new TaskAlreadyExistException("Another task with the new name already exists.");
            }
            if(dto.getNewtaskName().equals("")){
                task.setTaskName(dto.getOldtaskName());
            }
            else{
                task.setTaskName(dto.getNewtaskName());

            }
        }


        // 3. Update other fields
        if (dto.getTaskPriority() != null) {
            if(!dto.getTaskPriority().equals("")){
                task.setTaskPriority(dto.getTaskPriority());
            }
            else{
                task.setTaskPriority("Not selected");
            }

        }

        if (dto.getStartingDate() != null) {
            LocalDate start = toLocalDate(dto.getStartingDate());
            if (start.isBefore(LocalDate.now())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Starting date cannot be in the past.");
            }
            task.setStartingDate(dto.getStartingDate());
        }

        if (dto.getLastDate() != null) {
            if (task.getStartingDate() != null) {
                LocalDate start = toLocalDate(task.getStartingDate());
                LocalDate end = toLocalDate(dto.getLastDate());
                if (end.isBefore(start)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Last date must be after starting date.");
                }
            }
            task.setLastDate(dto.getLastDate());
        }

        if (dto.getCollaborators() != null) {
            task.setCollaborators(dto.getCollaborators());
        }

        taskRepository.save(task);
        cacheManager.getCache("TaskModels").evict(username);

    }
    public TaskResponseDTO getTaskByName(String taskName){
        String userName=SecurityContextHolder.getContext().getAuthentication().getName();
        UserModel user=userRepository.findByUsername(userName)
                .orElseThrow( ()-> new UsernameNotFoundException("Username not found"));
        TaskModel task=user.getTasks()
                .stream()
                .filter((t)->t.getTaskName().equals(taskName))
                .findFirst()
                .orElseThrow(()-> new TaskNotFoundException("Task not found"));
        TaskResponseDTO getTask=new TaskResponseDTO();
        getTask.setTaskName(task.getTaskName());
        getTask.setTaskPriority(task.getTaskPriority());
        getTask.setLastDate(task.getLastDate());
        getTask.setStartingDate(task.getStartingDate());
        getTask.setCollaborators(task.getCollaborators());
        return getTask;
    }


    // --------------------- Helpers ---------------------

    private String getLoggedInUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private UserModel getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private LocalDate toLocalDate(java.util.Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }
}