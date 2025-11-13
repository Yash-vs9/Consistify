package com.clg.consistify.controller;

import com.clg.consistify.DTO.ChatMessage;
import com.clg.consistify.repository.ChatRepository;
import com.clg.consistify.repository.UserRepository;
import com.clg.consistify.user.ChatModel;
import com.clg.consistify.user.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class Chat {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    @MessageMapping("/chat.privateMessage")
    public void sendPrivateMessage(ChatMessage message) {
        String currentUsername =message.getSender();

        // send to recipient via WebSocket
        message.setTimestamp(LocalDateTime.now());
        messagingTemplate.convertAndSendToUser(
                message.getReceiver(),
                "/queue/messages",
                message
        );
        messagingTemplate.convertAndSendToUser(
                currentUsername,
                "/queue/messages",
                message
        );


        UserModel sender = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        UserModel receiver = userRepository.findByUsername(message.getReceiver())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatModel chat = new ChatModel();
        chat.setSender(sender);
        chat.setReceiver(receiver);
        chat.setMessage(message.getContent());
        chat.setTimestamp(LocalDateTime.now());
        chat.setRead(false);

        chatRepository.save(chat);
    }
}