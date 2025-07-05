package com.clg.consistify.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ChatResponseDTO {
    private String sender;
    private String receiver;
    private String message;
    private LocalDateTime timestamp;
    private boolean read;

    public ChatResponseDTO(String sender, String receiver, String message, LocalDateTime timestamp, boolean read) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.timestamp = timestamp;
        this.read = read;
    }
}