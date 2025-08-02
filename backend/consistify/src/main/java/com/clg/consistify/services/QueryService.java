package com.clg.consistify.services;

import com.clg.consistify.DTO.BotBody.BotSkillBody;
import com.clg.consistify.DTO.BotBody.BotpressSkillBody;
import com.clg.consistify.DTO.QueryDTO;
import com.clg.consistify.exception.FieldNullException;
import com.clg.consistify.exception.UserNotFoundException;
import com.clg.consistify.repository.QueryRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.QueryModel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import javax.management.Query;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class QueryService {
    private UserRepository userRepository;
    private QueryRepository queryRepository;
    private ExternalApiService externalApiService;
    public QueryService(UserRepository userRepository, QueryRepository queryRepository, ExternalApiService externalApiService) {
        this.userRepository = userRepository;
        this.queryRepository = queryRepository;
        this.externalApiService = externalApiService;
    }

    public void createQuery(QueryDTO body) throws ExecutionException, InterruptedException, JsonProcessingException {
        QueryModel query=new QueryModel();
        if(body.getQueryName()!=null && !body.getQueryName().trim().isEmpty()){
            query.setName(body.getQueryName());
        }
        else{
            throw new FieldNullException("Field cant be empty");
        }
        if(body.getDescription()!=null && !body.getDescription().trim().isEmpty()){
            query.setDescription(body.getDescription());
        }
        else{
            throw new FieldNullException("Field cant be empty");

        }
        query.setStatus("PENDING");
        query.setUser(userRepository.findByUsername(body.getUsername())
                .orElseThrow(()-> new UserNotFoundException("User not found")));
        queryRepository.save(query);
        BotpressSkillBody RequestBody=new BotpressSkillBody();
        RequestBody.getPayload().getTasks().get(0).setDescription(body.getDescription());
        RequestBody.getPayload().getTasks().get(0).setName(body.getQueryName());
        CompletableFuture<CompletableFuture<String>> future = CompletableFuture
                .runAsync(() -> {
                    try {
                        externalApiService.skillsProcessing(RequestBody);
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }
                })
                .thenCompose(unused -> CompletableFuture.supplyAsync(() -> {
                    try {
                        return externalApiService.getMessage(body.getQueryName());
                    } catch (ExecutionException | InterruptedException | JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }
                }));


    }
    public List<String> skillsNeeded(QueryDTO body){
        return List.of("");
    }
}
