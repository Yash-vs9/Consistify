package com.clg.consistify.controller;

import com.clg.consistify.services.ExternalApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
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
//    public ResponseEntity<HashMap<String,String>> getSkills() throws ExecutionException, InterruptedException {
//        CompletableFuture<List<String>> body = externalApiService.getMesage();
//
//    }
}
