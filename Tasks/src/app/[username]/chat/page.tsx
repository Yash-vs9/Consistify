"use client";
import React, { useEffect, useState, useRef } from "react";
import Sidebar from "components/Sidebar";
import { useParams } from "next/navigation";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";


// ===============================
// 💬 Message Interface
// ===============================
interface Message {
  sender: string;
  text: string;
  time: string;
  date: string;
  timestamp: Date;
}


// ===============================
// 🔑 Decode JWT to get username
// ===============================
function getUsernameFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payloadBase64Url = token.split(".")[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload.sub || payload.username || null;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}


// ===============================
// 🕐 Parse Timestamp - Handle Java LocalDateTime + UTC
// ===============================
function parseTimestamp(timestamp: any): Date {
  if (!timestamp) return new Date();

  // Handle Java LocalDateTime array format: [year, month, day, hour, minute, second, nano]
  if (Array.isArray(timestamp)) {
    const [year, month, day, hour, minute, second] = timestamp;
    // ✅ Create as UTC to avoid browser timezone differences
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  }

  // Handle ISO string format (already UTC)
  if (typeof timestamp === "string") {
    // ✅ Always parse as UTC by ensuring 'Z' suffix
    const isoString = timestamp.includes("Z") ? timestamp : timestamp + "Z";
    return new Date(isoString);
  }

  // Handle already parsed Date
  if (timestamp instanceof Date) {
    return timestamp;
  }

  return new Date();
}


// ===============================
// 💬 Chat Component
// ===============================
const ChatPage: React.FC = () => {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const { username: chatPartner } = useParams<{ username: string }>();


  // JWT setup
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const currentUser = getUsernameFromToken(token);


  // React States
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);


  // Refs
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const stompClientRef = useRef<Client | null>(null);


  // ===============================
  // 📜 Scroll to latest message
  // ===============================
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);


  // ===============================
  // 🔌 WebSocket + STOMP Setup
  // ===============================
  useEffect(() => {
    if (!currentUser) return;


    const socket = new SockJS(`${API_BASE_URL}/ws?token=${token}`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => console.log("[STOMP]", msg),


      // ✅ Connected
      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        setConnected(true);


        // Subscribe to private queue
        stompClient.subscribe("/user/queue/messages", (msg: IMessage) => {
          const payload = JSON.parse(msg.body);

          console.log("📨 Received message:", payload);

          // ✅ Parse timestamp with UTC handling
          const ts = parseTimestamp(payload.timestamp);

          const newMsg: Message = {
            sender: payload.sender,
            text: payload.content,
            date: ts.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              timeZone: "UTC",
            }),
            time: ts.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
            }),
            timestamp: ts,
          };

          console.log("📅 Formatted message time:", newMsg.time, newMsg.date);

          // ✅ Keep message order always sorted
          setMessages((prev) => {
            // ✅ Check if message already exists (prevent duplicates)
            const exists = prev.some(
              (m) =>
                m.sender === newMsg.sender &&
                m.text === newMsg.text &&
                Math.abs(m.timestamp.getTime() - newMsg.timestamp.getTime()) < 1000
            );

            if (exists) {
              console.log("⚠️ Duplicate message ignored");
              return prev;
            }

            const updated = [...prev, newMsg];
            return updated.sort(
              (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
            );
          });
        });
      },


      // ❌ Error handling
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"], frame.body);
      },


      // 🔌 Disconnected
      onDisconnect: () => {
        console.warn("Disconnected from WebSocket");
        setConnected(false);
      },
    });


    stompClient.activate();
    stompClientRef.current = stompClient;


    // Cleanup
    return () => {
      stompClient.deactivate();
      setConnected(false);
    };
  }, [currentUser, API_BASE_URL, token]);


  // ===============================
  // ✉️ Send Message
  // ===============================
  const handleSend = () => {
    if (!newMessage.trim()) return;
    if (!stompClientRef.current || !connected) {
      console.error("🚫 Cannot send — STOMP not connected yet!");
      return;
    }


    setSending(true);

    // ✅ Send backend-calculated timestamp (don't send from frontend)
    const msgPayload = {
      sender: currentUser,
      receiver: chatPartner,
      content: newMessage,
      // Backend will set timestamp from LocalDateTime.now()
    };

    console.log("📤 Sending:", msgPayload);

    // Send via WebSocket
    stompClientRef.current.publish({
      destination: "/app/chat.privateMessage",
      body: JSON.stringify(msgPayload),
    });

    // ✅ REMOVED optimistic UI - let backend echo the message
    // This ensures consistent timestamp across all browsers

    setNewMessage("");
    setSending(false);
  };


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !sending) {
      handleSend();
    }
  };


  // ===============================
  // 🎨 UI Rendering
  // ===============================
  return (
    <div className="min-h-screen flex bg-gray-950 text-white">
      <Sidebar />


      <div className="flex-1 flex flex-col items-center py-6 px-4">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
          Chat with {chatPartner}
        </h1>


        {/* Chat Box */}
        <div
          ref={chatContainerRef}
          className="flex flex-col space-y-3 overflow-y-auto h-[65vh] w-full max-w-3xl p-6 rounded-2xl border border-cyan-700 bg-gray-900 shadow-2xl scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800"
        >
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center">
              {connected ? "No messages yet." : "Connecting..."}
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === currentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow transition
                      ${
                        msg.sender === currentUser
                          ? "bg-gradient-to-r from-cyan-600 to-blue-700 border border-cyan-400 text-right"
                          : "bg-gray-800 border border-indigo-600 text-left"
                      }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>
                  <div className="text-xs text-gray-300 mt-1 flex flex-col items-end gap-0.5">
                    <span>{msg.date}</span>
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>


        {/* Input Area */}
        <div className="w-full max-w-3xl mt-6 flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              connected ? "Type your message..." : "Connecting to chat..."
            }
            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring focus:ring-cyan-500/60 text-lg transition"
            disabled={!connected || sending}
            autoComplete="off"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending || !connected}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-600 transition disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};


export default ChatPage;