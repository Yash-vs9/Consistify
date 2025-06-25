package com.clg.consistify.controller;

import com.clg.consistify.DTO.ChatDTO;
import com.clg.consistify.DTO.ChatRequestDTO;
import com.clg.consistify.DTO.ChatResponseDTO;
import com.clg.consistify.repository.ChatRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.services.ChatService;
import com.clg.consistify.user.ChatModel;
import com.clg.consistify.user.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<String> sendChat(@RequestBody ChatRequestDTO chatDTO) {
        UserModel sender = userRepository.findByUsername(chatDTO.getSenderName())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        UserModel receiver = userRepository.findByUsername(chatDTO.getReceiverName())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatModel chat = new ChatModel();
        chat.setSender(sender);
        chat.setReceiver(receiver);
        chat.setMessage(chatDTO.getMessage());
        chat.setTimestamp(LocalDateTime.now());
        chat.setRead(false);

        chatRepository.save(chat);
        return ResponseEntity.ok("Message sent!");
    }
    @PostMapping("/receive")
    public ResponseEntity<List<ChatResponseDTO>> getChats(@RequestBody ChatRequestDTO chatDTO){
        Optional<UserModel> sender = userRepository.findByUsername(chatDTO.getSenderName());
        if (sender.isEmpty()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        Optional<UserModel> receiver = userRepository.findByUsername(chatDTO.getReceiverName());
        if (receiver.isEmpty()) {
            return ResponseEntity.unprocessableEntity().build();
        }

        Long senderId = sender.get().getId();
        Long receiverId = receiver.get().getId();
        List<ChatModel> msgs = chatRepository.findChats(senderId, receiverId);

        // Map to DTO
        List<ChatResponseDTO> response = msgs.stream()
                .map(msg -> new ChatResponseDTO(
                        msg.getSender().getUsername(),
                        msg.getReceiver().getUsername(),
                        msg.getMessage(),
                        msg.getTimestamp(),
                        msg.isRead()
                )).toList();

        return ResponseEntity.ok(response);
    }

}