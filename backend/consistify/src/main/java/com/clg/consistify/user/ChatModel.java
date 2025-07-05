package com.clg.consistify.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    @JsonBackReference
    private UserModel sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    @JsonBackReference
    private UserModel receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "`read`")
    private boolean read;
}