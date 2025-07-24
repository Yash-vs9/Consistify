"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "components/Sidebar";
import { useParams } from "next/navigation";

interface Message {
  sender: string;
  text: string;
  time: string; // Time, e.g. "09:08 PM"
  date: string; // Date, e.g. "Apr 22, 2024"
  timestamp: Date;
}

function getUsernameFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payloadBase64Url = token.split('.')[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload.sub || payload.username || null;
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}

const Chat: React.FC = () => {
  // Get username from route params (Next.js app router)
  const { username: chatPartner } = useParams<{ username: string }>();
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const currentUser = getUsernameFromToken(token);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Fetch messages (with polling)
  useEffect(() => {
    if (!currentUser || !chatPartner) return;
    let mounted = true;

    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:8080/chat/receive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            senderName: currentUser,
            receiverName: chatPartner,
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch messages");
        const allMsgs = await response.json();
        const formatted: Message[] = allMsgs.map((msg: any) => {
          const ts = new Date(msg.timestamp);
          return {
            sender: msg.sender,
            text: msg.message,
            time: ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            date: ts.toLocaleDateString([], { year: "numeric", month: "short", day: "2-digit" }),
            timestamp: ts,
          };
        })
        .sort((a: Message, b: Message) => a.timestamp.getTime() - b.timestamp.getTime());
        if (mounted) setMessages(formatted);
      } catch (error: any) {
        if (mounted) setError("Failed to load messages.");
        console.error("Error fetching messages:", error?.message);
      }
    };

    fetchMessages(); // initial
    const intervalId = setInterval(fetchMessages, 3000); // poll every 3s

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [token, chatPartner, currentUser]);

  // Handlers
  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    setError(null);

    const now = new Date();
    const newMsg: Message = {
      sender: currentUser!,
      text: newMessage,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: now.toLocaleDateString([], { year: "numeric", month: "short", day: "2-digit" }),
      timestamp: now,
    };

    try {
      const response = await fetch("http://localhost:8080/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          senderName: currentUser,
          receiverName: chatPartner,
          message: newMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (error: any) {
      setError("Failed to send message.");
      console.error("Error sending message:", error?.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-cyan-950 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center py-6 px-4">
        <div className="text-4xl font-bold mb-6 tracking-wide bg-gradient-to-r from-cyan-400 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
          Chat with {chatPartner}
        </div>
        <div
          className="flex flex-col space-y-3 overflow-y-auto h-[65vh] w-full max-w-3xl rounded-2xl border border-cyan-700 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 p-6 shadow-2xl scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800"
          ref={chatContainerRef}
          tabIndex={0}
          aria-label="Chat messages"
        >
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === currentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow transition
                    ${msg.sender === currentUser
                      ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-right border border-cyan-400"
                      : "bg-gray-800 text-left border border-indigo-600"}
                  `}
                  tabIndex={-1}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  <div className="text-xs text-gray-300 mt-1 flex flex-col items-end gap-0.5">
                    <span>{msg.date}</span>
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Error */}
        {error && (
          <div className="text-red-400 text-sm mt-2">{error}</div>
        )}

        {/* Message Input */}
        <form
          className="w-full max-w-3xl mt-6 flex items-center gap-3"
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring focus:ring-cyan-500/60 text-lg transition"
            autoComplete="off"
            aria-label="Type a message"
            disabled={sending}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md hover:from-cyan-400 hover:to-blue-600 transition disabled:opacity-50`}
            aria-label="Send Message"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
