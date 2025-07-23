package com.clg.consistify.service;

import com.clg.consistify.DTO.TaskResponseDTO;
import com.clg.consistify.DTO.TaskUpdateDTO;
import com.clg.consistify.repository.TaskRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.services.TaskService;
import com.clg.consistify.user.TaskModel;
import com.clg.consistify.user.UserModel;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {
    @Mock
    TaskRepository taskRepository;
    @Mock
    UserRepository userRepository;

    @InjectMocks
    TaskService taskService;
    @Test
    void taskNamesShouldGiveAllProducts(){
        String fakeUsername = "yash";
        Authentication auth=new UsernamePasswordAuthenticationToken(fakeUsername,null);
        SecurityContext context= SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        TaskModel task1 = new TaskModel();
        task1.setTaskName("Complete Testing");

        TaskModel task2 = new TaskModel();
        task2.setTaskName("Review Code");

        UserModel fakeUser = new UserModel();
        fakeUser.setTasks(List.of(task1, task2));

        // ✅ 3. Mock repository
        when(userRepository.findByUsername("yash")).thenReturn(Optional.of(fakeUser));

        // ✅ 4. Call the method
        List<String> taskNames = taskService.taskNames();

        // ✅ 5. Assert
        assertEquals(2, taskNames.size());
        assertEquals("Complete Testing", taskNames.get(0));
        assertEquals("Review Code", taskNames.get(1));

    }
    @Test
    void deleteByUserNameShouldSaveToDB(){
        TaskModel task=new TaskModel();
        task.setTaskName("testtask1");
        String userName="yash";
        Authentication auth=new UsernamePasswordAuthenticationToken(userName,null);
        SecurityContext context= SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        UserModel user=new UserModel();
        user.getTasks().add(task);
        when(userRepository.findByUsername("yash")).thenReturn(Optional.of(user));
        taskService.deleteByUserName(task.getTaskName());
        verify(userRepository,times(1)).save(user);
        assertEquals(0, user.getTasks().size());

    }
    @Test
    void updateTask_SaveToDB(){
        String name="yash";
        Authentication auth=new UsernamePasswordAuthenticationToken(name,null);
        SecurityContext context= SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        TaskUpdateDTO task1=new TaskUpdateDTO();
        task1.setNewtaskName("DSA");
        task1.setOldtaskName("web");
        task1.setTaskPriority("HIGH");
        Date date=new Date();
        task1.setStartingDate(date );
        task1.setLastDate(date);
        UserModel user=new UserModel();
        TaskModel task2=new TaskModel();
        task2.setTaskName("web");
        user.setTasks(List.of(task2));
        user.setUsername("yash");
        when(userRepository.findByUsername(name)).thenReturn(Optional.of(user));
        taskService.updateTask(task1);
        assertEquals(user.getTasks().get(0).getTaskName(),"DSA");
    }
    @Test
    void getTaskByName_ShouldReturnOneTask(){
        TaskModel task1=new TaskModel();
        String name="Yash";
        task1.setTaskName("exampleTask");
        Authentication auth=new UsernamePasswordAuthenticationToken(name,null);
        SecurityContext context= SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        UserModel user=new UserModel();
        user.setUsername("Yash");
        user.setTasks(List.of(task1));
        when(userRepository.findByUsername("Yash")).thenReturn(Optional.of(user));
        TaskResponseDTO returnedTask=taskService.getTaskByName(task1.getTaskName());
        assertEquals(returnedTask.getTaskName(),"exampleTask");

    }

}
