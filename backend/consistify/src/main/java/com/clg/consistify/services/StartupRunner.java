package com.clg.consistify.services;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Component
public class StartupRunner implements CommandLineRunner {

    private final ExternalApiService messageService;

    public StartupRunner(ExternalApiService messageService) {
        this.messageService = messageService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("App started. Fetching messages...");

        try {
            List<String> messages = messageService.getMesage().get();
            messages.forEach(System.out::println);
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error fetching messages: " + e.getMessage());
        }
    }
}
