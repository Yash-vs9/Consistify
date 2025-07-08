import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
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

  const { username } = useParams();
  const token = localStorage.getItem('authToken');
  const usernameJWT = getUsernameFromToken(token);
  const currentUser = usernameJWT;
  const chatPartner = username;

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
        const formatted = allMsgs
          .map((msg) => ({
            sender: msg.sender,
            text: msg.message,
            time: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: new Date(msg.timestamp),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
  
        setMessages(formatted);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };
  
    fetchMessages(); // Initial fetch
  
    const intervalId = setInterval(fetchMessages, 3000); // ⏱️ Poll every 3 seconds
  
    return () => clearInterval(intervalId); // ✅ Clean up on unmount
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <div className="text-3xl font-bold mb-6">CHAT</div>
      

      <div className="flex flex-col space-y-3 overflow-y-auto h-[70vh] w-[46vw] rounded-xl border border-cyan-400 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 p-5 shadow-lg scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-700">
                  {messages.map((msg, index) => (
    <div
      key={index}
      className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[60%] px-4 py-2 rounded-lg text-white shadow ${
          msg.sender === currentUser
            ? 'bg-blue-500 text-right'
            : 'bg-gray-700 text-left'
        }`}
      >
        <div>{msg.text}</div>
        <div className="text-xs text-gray-200 mt-1">{msg.time}</div>
      </div>
    </div>
  ))}
</div>

      <div className="w-full max-w-2xl flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;