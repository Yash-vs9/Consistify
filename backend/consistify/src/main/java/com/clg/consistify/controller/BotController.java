package com.clg.consistify.controller;

import com.clg.consistify.services.ExternalApiService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/bot")
public class BotController {
    private ExternalApiService externalApiService;

    public BotController(ExternalApiService externalApiService) {
        this.externalApiService = externalApiService;
    }
    @GetMapping("/getSkills")
    public CompletableFuture<String> skillsNeeded(String name) throws ExecutionException, InterruptedException, JsonProcessingException {

        return externalApiService.getMessage(name);
    }

}
