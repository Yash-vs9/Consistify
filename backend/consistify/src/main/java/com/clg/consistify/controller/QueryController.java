package com.clg.consistify.controller;

import com.clg.consistify.DTO.QueryDTO;
import com.clg.consistify.services.QueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/query")
public class QueryController {
    private QueryService queryService;

    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    public ResponseEntity<String> submitQuery(@RequestBody QueryDTO body){
        queryService.createQuery(body);
        return ResponseEntity.ok("Query Submitted");
    }
}
