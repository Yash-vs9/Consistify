package com.clg.consistify.services;

import com.clg.consistify.DTO.BotBody.BotTaskBody;
import com.clg.consistify.DTO.BotBody.BotpressBody;
import com.clg.consistify.DTO.BotBody.PayloadDTO;
import com.clg.consistify.DTO.QuoteDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
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
    public CompletableFuture<List<String>> skillsProcessing(BotpressBody body) throws JsonProcessingException {
        if (body.getPayload() == null) {
            body.setPayload(new PayloadDTO()); // or just new PayloadDTO()
        }
        body.getPayload().getTasks().add(new BotTaskBody("Lazy not working","React"));
        body.getPayload().setUsername("y");
        ObjectMapper mapper = new ObjectMapper();
        System.out.println("Sending payload:\n" + mapper.writeValueAsString(body));
        return webClient.post()
                .uri("https://chat.botpress.cloud/a1bf9783-18da-4fa8-8473-37e44aa43859/events")
                .header("x-user-key","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNzUzODc0MDU4fQ.2NCxrnwsNUaDwzEGHAE6u64MnBV2IxLoK9kJ5V61-qo")
                .contentType(MediaType.APPLICATION_JSON) // ✅ sets Content-Type: application/json
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .toFuture();
    }
}
