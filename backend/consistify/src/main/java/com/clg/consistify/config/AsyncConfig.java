package com.clg.consistify.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
public class AsyncConfig {
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);         // Min thread count
        executor.setMaxPoolSize(10);         // Max thread count
        executor.setQueueCapacity(100);      // Task queue size
        executor.setThreadNamePrefix("ThreadName -");
        executor.initialize();
        return executor;
    }
}
