package com.clg.consistify.services;

import com.clg.consistify.repository.ChatRepository;
import com.clg.consistify.user.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    @Autowired
    private ChatRepository chatRepository;
    public List<ChatModel> getConversation(Long senderId, Long receiverId) {
        return chatRepository.findChats(senderId, receiverId);
    }
}
