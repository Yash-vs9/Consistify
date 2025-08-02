package com.clg.consistify.controller;

import com.clg.consistify.DTO.QueryDTO;
import com.clg.consistify.services.ExternalApiService;
import com.clg.consistify.services.QueryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/query")
public class QueryController {
    private QueryService queryService;
    private ExternalApiService externalApiService;
    public QueryController(QueryService queryService, ExternalApiService externalApiService) {
        this.queryService = queryService;
        this.externalApiService = externalApiService;
    }
    @PostMapping("/create")
    public ResponseEntity<String> submitQuery(@RequestBody QueryDTO body) throws ExecutionException, InterruptedException, JsonProcessingException {
        body.setUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        queryService.createQuery(body);
        return ResponseEntity.ok("Query Submitted");
    }
}
