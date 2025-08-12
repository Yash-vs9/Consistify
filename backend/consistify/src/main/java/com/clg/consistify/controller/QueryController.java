package com.clg.consistify.controller;

import com.clg.consistify.DTO.CommentDTO;
import com.clg.consistify.DTO.QueryDTO;
import com.clg.consistify.DTO.QueryGetDTO;
import com.clg.consistify.services.ExternalApiService;
import com.clg.consistify.services.QueryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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
    @GetMapping("/get")
    public ResponseEntity<List<QueryGetDTO>> getAllQueries(){
        return ResponseEntity.ok(queryService.getQueries());
    }
    @PostMapping("/postComment")
    public ResponseEntity<Map<String, String>> sendComments(@RequestBody CommentDTO body) {
        queryService.postComment(body);
        return ResponseEntity.ok(Map.of("message", "Comment saved"));
    }

}
