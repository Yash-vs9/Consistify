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
  id: number;
  sender: string;
  text: string;
  timestamp: Date;
  date: string;
  time: string;
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
// 🕐 Parse Timestamp - Handle LocalDateTime / ISO
// ===============================
function parseTimestamp(timestamp: any): Date {
  if (!timestamp) return new Date();

  if (Array.isArray(timestamp)) {
    const [year, month, day, hour, minute, second] = timestamp;
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  }

  if (typeof timestamp === "string") {
    const isoString = timestamp.includes("Z") ? timestamp : timestamp + "Z";
    return new Date(isoString);
  }

  if (timestamp instanceof Date) return timestamp;
  return new Date();
}

// ===============================
// 💬 Chat Component
// ===============================
const ChatPage: React.FC = () => {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const { username: chatPartner } = useParams<{ username: string }>();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const currentUser = getUsernameFromToken(token);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  // ===============================
  // 📜 Scroll to latest message
  // ===============================
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messages]);

  // ===============================
  // 🕓 Fetch previous chat messages
  // ===============================
  useEffect(() => {
    if (!currentUser || !chatPartner) return;

    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/chat/receive`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            senderName: currentUser,
            receiverName: chatPartner,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch chat history");
        const data = await res.json();

        const formatted: Message[] = data.map((msg: any) => {
          const ts = parseTimestamp(msg.timestamp);
          return {
            id: msg.id,
            sender: msg.sender,
            text: msg.message,
            timestamp: ts,
            date: ts.toLocaleDateString([], {
              year: "numeric",
              month: "short",
              day: "2-digit",
            }),
            time: ts.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });

        formatted.sort((a, b) => a.id - b.id);
        setMessages(formatted);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    fetchChatHistory();
  }, [currentUser, chatPartner, API_BASE_URL, token]);

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

      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        setConnected(true);

        stompClient.subscribe("/user/queue/messages", (msg: IMessage) => {
          const payload = JSON.parse(msg.body);
          console.log("📨 Received message:", payload);

          const ts = parseTimestamp(payload.timestamp);

          const newMsg: Message = {
            id: payload.id || Date.now(), // fallback if backend didn't send id
            sender: payload.sender,
            text: payload.content || payload.message,
            timestamp: ts,
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
          };

          setMessages((prev) => {
            // ✅ Avoid duplicates using message id
            const exists = prev.some((m) => m.id === newMsg.id);
            if (exists) return prev;

            const updated = [...prev, newMsg];
            updated.sort((a, b) => a.id - b.id);
            return updated;
          });
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"], frame.body);
      },

      onDisconnect: () => {
        console.warn("Disconnected from WebSocket");
        setConnected(false);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

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

    const msgPayload = {
      sender: currentUser,
      receiver: chatPartner,
      content: newMessage,
    };

    stompClientRef.current.publish({
      destination: "/app/chat.privateMessage",
      body: JSON.stringify(msgPayload),
    });

    setNewMessage("");
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !sending) handleSend();
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
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === currentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow transition ${
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