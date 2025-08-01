package com.clg.consistify.services;

import com.clg.consistify.DTO.BotBody.*;
import com.clg.consistify.DTO.QuoteDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class ExternalApiService {
    private final WebClient webClient;

    public ExternalApiService(WebClient webClient) {
        this.webClient = webClient;
    }
    private final Random random = new Random(); // better to reuse


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
    public String createUserKey() {
        String username = "12345";
        String YOUR_USER_ID = username;
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
    public CompletableFuture<List<String>> skillsProcessing(BotpressSkillBody body) throws JsonProcessingException {
        String xUserKey=createUserKey();
        if (body.getPayload() == null) {
            body.setPayload(new PayloadSkillDTO()); // or just new PayloadDTO()
        }
        body.getPayload().getTasks().add(new BotSkillBody("Lazy not working","React"));
        ObjectMapper mapper = new ObjectMapper();
        System.out.println("Sending payload:\n" + mapper.writeValueAsString(body));
        return webClient.post()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/events")
                .header("x-user-key",xUserKey)
                .contentType(MediaType.APPLICATION_JSON) // ✅ sets Content-Type: application/json
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .toFuture();
    }
    public CompletableFuture<List<String>> taskdifficulty(BotpressDifficultyBody body) throws JsonProcessingException {
        String xUserKey=createUserKey();
        if (body.getPayload()==null){
            body.setPayload(new PayloadDifficultyDTO());
        }
        body.getPayload().getTasks().add(new BotDifficultyBody("DSA",new Date(2025,8,1),new Date(2025,8,11)));
        ObjectMapper mapper=new ObjectMapper();
        System.out.println("Sending payload:\n"+mapper.writeValueAsString(body));
        return webClient.post()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/events")
                .header("x-user-key",xUserKey)
                .contentType(MediaType.APPLICATION_JSON) // ✅ sets Content-Type: application/json
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .toFuture();
    }
    public CompletableFuture<List<String>> createBotUser(){
        String xUserKey=createUserKey();
        String username=SecurityContextHolder.getContext().getAuthentication().getName();
        HashMap<String, String > map=new HashMap<>();
        map.put("name",username);
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
    public CompletableFuture<List<String>> createConversation(){
        String username=SecurityContextHolder.getContext().getAuthentication().getName();
        String xUserKey=createUserKey();
        HashMap<String,String> map=new HashMap<>();
        map.put("id",username);
        return webClient.post()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/conversations/get-or-create")
                .header("x-user-key",xUserKey)
                .header("Content-Type","application/json")
                .bodyValue(map)
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .toFuture();
    }
    public CompletableFuture<JsonNode> getMessage() throws ExecutionException, InterruptedException, JsonProcessingException {
        String username="12345";
        String xUserKey=createUserKey();
        CompletableFuture<List<String>> responseFuture= webClient.get()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/conversations/{username}/messages",username)
                .header("x-user-key",xUserKey)
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .toFuture();
        List<String> response= responseFuture.get();
        if(response.isEmpty()){
            throw new RuntimeException("Empty response from API");
        }
        String jsonResponse=response.get(0);
        ObjectMapper mapper=new ObjectMapper();
        JsonNode root=mapper.readTree(jsonResponse);
        JsonNode firstPayload=root.path("messages").get(0).path("payload").path("text");
        System.out.println(firstPayload);
        return CompletableFuture.completedFuture(firstPayload);
    }
}
