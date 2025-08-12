package com.clg.consistify.services;

import com.clg.consistify.DTO.BotBody.*;
import com.clg.consistify.DTO.QuoteDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class ExternalApiService {
    private final WebClient webClient;

    public ExternalApiService(WebClient webClient) {
        this.webClient = webClient;
    }
    private final Random random = new Random(); // better to reuse

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            throw new RuntimeException("User is not authenticated");
            // Or throw your custom exception:
            // throw new UnauthenticatedUserException("User is not authenticated");
        }

        return authentication.getName();
    }

    public CompletableFuture<QuoteDTO> dailyQuote(){
        return webClient.get()
                .uri("https://api.api-ninjas.com/v1/advice")
                .header("X-Api-Key", "GdSg4mzhgZPgjOFFIE3QHw==WeAvyEQnvuEYXJf2") // replace with your actual API key
                .retrieve()
                .bodyToFlux(QuoteDTO.class)
                .collectList()
                .map(list -> list.get(random.nextInt(list.size()))) // pick random from list
                .toFuture();
    }
    public String createUserKey(String userName) {

        String YOUR_USER_ID = userName;
        String YOUR_ENCRYPTION_KEY = "yLmN89pVwXrTqLzKbNdGeSyFbQmTcHuY"; // secret key

        // Convert secret key to HMAC-SHA key
        Key key = Keys.hmacShaKeyFor(YOUR_ENCRYPTION_KEY.getBytes(StandardCharsets.UTF_8));

        // Generate JWT token
        String xUserKey = Jwts.builder()
                .claim("id", YOUR_USER_ID)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        System.out.println("Generated JWT: " + xUserKey);
        return xUserKey;
    }
    public CompletableFuture<List<String>> skillsProcessing(
            BotpressSkillBody body,
            String queryName,
            String userName
    ) throws JsonProcessingException {

        String xUserKey = createUserKey(userName);

        if (body.getPayload() == null) {
            body.setPayload(new PayloadSkillDTO());
        }

        ObjectMapper mapper = new ObjectMapper();
        System.out.println("Sending payload:\n" + mapper.writeValueAsString(body));

        return webClient.post()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/events")
                .header("x-user-key", xUserKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .toFuture()
                .thenCompose(responseList -> {
                    if (responseList == null || responseList.isEmpty()) {
                        throw new RuntimeException("Empty response from Botpress API");
                    }
                    System.out.println("Received response from skillsProcessing: " + responseList);

                    // Properly delay before fetching skill map
                    return CompletableFuture.runAsync(() -> {
                        try {
                            Thread.sleep(15000); // wait 15 seconds
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                    });
                })
                .thenCompose(v -> getMessageOfSkillMap(queryName, userName)) // only call once
                .exceptionally(ex -> {
                    System.err.println("Error fetching skill map: " + ex.getMessage());
                    return null;
                });
    }

    public CompletableFuture<String> taskdifficulty(BotpressDifficultyBody body, String taskName, String userName) throws JsonProcessingException {

        String xUserKey = createUserKey(userName);

        if (body.getPayload() == null) {
            body.setPayload(new PayloadDifficultyDTO());
        }

        ObjectMapper mapper = new ObjectMapper();
        System.out.println("Sending payload:\n" + mapper.writeValueAsString(body));

        return webClient.post()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/events")
                .header("x-user-key", xUserKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .toFuture()
                .thenCompose(responseList -> {
                    if (responseList == null || responseList.isEmpty()) {
                        throw new RuntimeException("Empty response from Botpress API");
                    }
                    System.out.println("Received response from skillsProcessing: " + responseList);

                    // Wait 5 seconds before calling getMessageOfTaskDifficulty
                    return CompletableFuture.supplyAsync(
                            () -> null,
                            CompletableFuture.delayedExecutor(10, TimeUnit.SECONDS)
                    );
                })
                .thenCompose(nil -> getMessageOfTaskDifficulty(taskName, userName)) // return this result
                .exceptionally(ex -> {
                    System.err.println("Error: " + ex.getMessage());
                    return null;
                });
    }
    public CompletableFuture<List<String>> createBotUser(String userName){
        String xUserKey=createUserKey(userName);

        HashMap<String, String > map=new HashMap<>();
        map.put("name",userName);
        return webClient.post()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/users/get-or-create")
                .header("x-user-key", xUserKey)
                .header("Content-Type", "application/json")
                .bodyValue(map)
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .toFuture();
    }
    public CompletableFuture<Map> createConversation(String userName) throws Exception {
        // Create the x-user-key
        String xUserKey = createUserKey(userName);

        // Request body
        Map<String, String> map = new HashMap<>();
        map.put("id", userName);

        // API call
        CompletableFuture<Map> result = webClient.post()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/conversations")
                .header("x-user-key", xUserKey)
                .header("Content-Type", "application/json")
                .bodyValue(map)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse -> clientResponse
                        .bodyToMono(String.class)
                        .map(body -> new RuntimeException("API Error: " + body)))
                .bodyToMono(Map.class) // Parse JSON into Map
                .toFuture();

        // Print the actual response (blocking here just for demo)
        System.out.println(result.get());

        return result;
    }
    public CompletableFuture<List<String>> getMessageOfSkillMap(String queryName,String userName) {
        String xUserKey = createUserKey(userName);
        System.out.println("in the getmessage");
        return webClient.get()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/conversations/{username}/messages", userName)
                .header("x-user-key", xUserKey)
                .retrieve()
                .bodyToMono(String.class) // Get the whole JSON as one string
                .toFuture()
                .thenApply(jsonResponse -> {
                    if (jsonResponse == null || jsonResponse.isEmpty()) {
                        throw new RuntimeException("Empty response from API");
                    }
                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        // Parse the main JSON
                        JsonNode root = mapper.readTree(jsonResponse);

                        // Get the payload text from the first message
                        String firstPayload = root.path("messages").get(0)
                                .path("payload").path("text").asText();

                        // Parse the payload text (which itself is JSON)
                        JsonNode extracted = mapper.readTree(firstPayload);
                        JsonNode targetNode = extracted.get(queryName);

                        if (targetNode == null) {
                            throw new RuntimeException("Key not found in payload: " + queryName);
                        }

                        // If it's an array, return it as comma-separated string
                        if (targetNode.isArray()) {
                            return mapper.convertValue(targetNode,new TypeReference<List<String>>() {});
                        }
                        System.out.println(targetNode);
                        // Otherwise, return as plain text
                        return List.of(targetNode.asText());

                    } catch (JsonProcessingException e) {
                        throw new RuntimeException("Error parsing JSON response", e);
                    }
                });
    }
    public CompletableFuture<String> getMessageOfTaskDifficulty(String taskName,String userName) {
        String xUserKey = createUserKey(userName);

        return webClient.get()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/conversations/{username}/messages", userName)
                .header("x-user-key", xUserKey)
                .retrieve()
                .bodyToMono(String.class) // Get the whole JSON as one string
                .toFuture()
                .thenApply(jsonResponse -> {
                    if (jsonResponse == null || jsonResponse.isEmpty()) {
                        throw new RuntimeException("Empty response from API");
                    }
                    try {
                        ObjectMapper mapper = new ObjectMapper();

                        // Parse the main JSON
                        JsonNode root = mapper.readTree(jsonResponse);

                        // Get the payload text from the first message
                        String firstPayload = root.path("messages").get(0)
                                .path("payload").path("text").asText();

                        // Parse the payload text (which itself is JSON)
                        JsonNode extracted = mapper.readTree(firstPayload);
                        JsonNode targetNode = extracted.get(taskName);

                        if (targetNode == null) {
                            throw new RuntimeException("Key not found in payload: " + taskName);
                        }

                        // If it's an array, return it as comma-separated string
                        if (targetNode.isArray()) {
                            List<String> list = mapper.convertValue(targetNode, new TypeReference<List<String>>() {
                            });
                            return String.join(", ", list);
                        }

                        // Otherwise, return as plain text
                        return targetNode.asText();

                    } catch (JsonProcessingException e) {
                        throw new RuntimeException("Error parsing JSON response", e);
                    }
                });
    }
}
