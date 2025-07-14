package com.clg.consistify.controller;

import com.clg.consistify.services.TaskService;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(TaskController.class)
@Import(TaskControllerTest.MockConfig.class)
public class TaskControllerTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    TaskService taskService;

    @TestConfiguration
    static class MockConfig {
        @Bean
        public TaskService taskService() {
            return Mockito.mock(TaskService.class);
        }
    }

}
