package com.clg.consistify.services;

import com.clg.consistify.DTO.BotBody.BotpressDifficultyBody;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Component
public class StartupRunner implements CommandLineRunner {

    private final ExternalApiService messageService;

    public StartupRunner(ExternalApiService messageService) {
        this.messageService = messageService;
    }

    @Override
    public void run(String... args) {
        System.out.println("App started. Running task difficulty check...");

        try {
            // 1. Run the taskdifficulty function first
            BotpressDifficultyBody body = new BotpressDifficultyBody();  // Fill if you have a prebuilt body
            List<String> difficultyResponse = messageService.taskdifficulty(body).get();

            System.out.println("Task Difficulty Response:");
            difficultyResponse.forEach(System.out::println);

            // 2. Then run getMessage
            System.out.println("\nFetching first message payload...");
            JsonNode payload = messageService.getMessage().get();

            System.out.println("First Payload: " + payload);

            // 3. Parse the nested 'text' field if it's JSON
            if (payload.has("text")) {
                String text = payload.get("text").asText().trim();

                ObjectMapper mapper = new ObjectMapper();
                JsonNode parsedText = mapper.readTree(text);

                System.out.println("Parsed 'text' field as JSON: " + parsedText);
            }

        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Execution error: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
        }
    }
}
