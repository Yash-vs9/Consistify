package com.clg.consistify.repository;

import com.clg.consistify.user.ChatModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<ChatModel,Long> {
    @Query(value = "SELECT * FROM user_chats WHERE (sender_id = :senderId AND receiver_id = :receiverId) OR (sender_id = :receiverId AND receiver_id = :senderId)", nativeQuery = true)
    List<ChatModel> findChats(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
}


