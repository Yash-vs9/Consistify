package com.clg.consistify.services;

import com.clg.consistify.DTO.BotBody.BotSkillBody;
import com.clg.consistify.DTO.BotBody.BotpressSkillBody;
import com.clg.consistify.DTO.BotBody.PayloadSkillDTO;
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
        // Validate and prepare QueryModel
        QueryModel query = new QueryModel();

        if (body.getQueryName() != null && !body.getQueryName().trim().isEmpty()) {
            query.setName(body.getQueryName());
        } else {
            throw new FieldNullException("Field cant be empty");
        }

        if (body.getDescription() != null && !body.getDescription().trim().isEmpty()) {
            query.setDescription(body.getDescription());
        } else {
            throw new FieldNullException("Field cant be empty");
        }

        query.setStatus("PENDING");
        query.setUser(userRepository.findByUsername(body.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not found")));

        queryRepository.save(query);

        // Prepare BotpressSkillBody payload
        BotpressSkillBody requestBody = new BotpressSkillBody();
        PayloadSkillDTO payload = new PayloadSkillDTO();

        BotSkillBody task = new BotSkillBody(body.getQueryName(), body.getDescription());
        payload.getTasks().add(task);

        requestBody.setPayload(payload);

        // Guard clause to ensure payload is valid
        if (requestBody != null &&
                requestBody.getPayload() != null &&
                requestBody.getPayload().getTasks() != null &&
                !requestBody.getPayload().getTasks().isEmpty()) {

            // Update the first task with the query info (optional but you did it)
            requestBody.getPayload().getTasks().get(0).setDescription(body.getDescription());
            requestBody.getPayload().getTasks().get(0).setName(body.getQueryName());
        }

        // Now, call the externalApiService asynchronously and chain correctly

        // IMPORTANT: To chain futures properly, skillsProcessing must return CompletableFuture<Void>
        // Let's assume you've refactored it as below:
        //
        // public CompletableFuture<Void> skillsProcessing(BotpressSkillBody body) throws JsonProcessingException {
        //     // returns CompletableFuture<Void> that completes when http request finishes
        // }

        CompletableFuture<Void> skillFuture;
        try {
            skillFuture = externalApiService.skillsProcessing(requestBody);
        } catch (JsonProcessingException e) {
            // If creating the request or something synchronous throws, propagate
            throw e;
        }

        CompletableFuture<String> resultFuture = skillFuture.thenCompose(unused -> {
            try {
                return externalApiService.getMessage(body.getQueryName());
            } catch (Exception e) {
                CompletableFuture<String> failedFuture = new CompletableFuture<>();
                failedFuture.completeExceptionally(e);
                return failedFuture;
            }
        });

        try {
            String result = resultFuture.get(); // blocks until complete
            System.out.println("Result from getMessage: " + result);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            // Optionally wrap or handle exceptions here
        }
    }

}
