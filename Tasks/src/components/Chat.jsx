import React, { useState, useEffect } from "react";
import styles from "./Chat.module.css";
import { useParams } from "react-router-dom";

const Chat = () => {
  const getUsernameFromToken = (token) => {
    if (!token) return null;
  
    try {
      const payloadBase64Url = token.split('.')[1];
      const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
  
      return payload.sub || payload.username || null;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  };
  const {username}=useParams();
  const token = localStorage.getItem('authToken');
  const usernameJWT = getUsernameFromToken(token);
  const currentUser = usernameJWT; // Ideally use from JWT or userContext
  const chatPartner =username;


  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:8080/chat/receive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            senderName: currentUser,
            receiverName: chatPartner,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch messages");

        const allMsgs = await response.json();
        console.log(allMsgs)
        const formatted = allMsgs
          .map((msg) => ({
            sender: msg.sender, // ✅ Fix for UserModel structure
            text: msg.message,
            time: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: new Date(msg.timestamp),
          }))
          .sort((a, b) => a.timestamp - b.timestamp); // sort messages by time

        setMessages(formatted);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchMessages();
  }, [currentUser, chatPartner]);

  const handleSend = async () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      senderName: currentUser,
      receiverName: chatPartner,
      message: newMessage,
    };

    try {
      const response = await fetch("http://localhost:8080/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(newMsg),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setMessages((prev) => [
        ...prev,
        {
          sender: currentUser,
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date(),
        },
      ]);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>CHAT</div>

      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.sender === currentUser ? styles.sent : styles.received
            }`}
          >
            <div className={styles.text}>{msg.text}</div>
            <div className={styles.time}>{msg.time}</div>
          </div>
        ))}
      </div>

      <div className={styles.inputBar}>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;