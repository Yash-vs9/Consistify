package com.clg.consistify.services;

import com.clg.consistify.DTO.BotBody.BotTaskBody;
import com.clg.consistify.DTO.BotBody.BotpressBody;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Payload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TestRunner implements CommandLineRunner {

    @Autowired
    private ExternalApiService externalApiService;

    @Override
    public void run(String... args) throws JsonProcessingException {

        BotpressBody body=new BotpressBody();
        externalApiService.skillsProcessing(body).thenAccept(response -> {
            System.out.println("Botpress Response: " + response);
        }).exceptionally(ex -> {
            System.err.println("Botpress Error: " + ex.getMessage());
            return null;
        });
    }
}