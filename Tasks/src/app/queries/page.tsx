'use client';
import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react"; // Lucide icons

// Types
interface Reply {
  id: number;
  text: string;
}

interface Query {
  id: number;
  text: string;
  likes: number;
  replies: Reply[];
}

export default function Home() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [newQuery, setNewQuery] = useState("");
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [openReplies, setOpenReplies] = useState<Set<number>>(new Set());

  const handleAddQuery = () => {
    if (!newQuery.trim()) return;
    const newQueryObj: Query = {
      id: Date.now(),
      text: newQuery,
      likes: 0,
      replies: [],
    };
    setQueries((prev) => [newQueryObj, ...prev]);
    setNewQuery("");
  };

  const handleLikeQuery = (id: number) => {
    setQueries((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, likes: q.likes + 1 } : q
      )
    );
  };

  const handleAddReply = (id: number) => {
    if (!replyText[id]?.trim()) return;
    setQueries((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, replies: [...q.replies, { id: Date.now(), text: replyText[id] }] }
          : q
      )
    );
    setReplyText((prev) => ({ ...prev, [id]: "" }));
  };

  const toggleReplies = (id: number) => {
    setOpenReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Glowing animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 animate-pulse opacity-25 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.4),transparent_70%)]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/10">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-center text-white/90 tracking-tight">
          💬 Community Queries
        </h1>

        {/* Add Query */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg px-4 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            placeholder="Write your query..."
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg transition"
            onClick={handleAddQuery}
          >
            Post
          </button>
        </div>

        {/* Queries */}
        {queries.map((query) => (
          <div
            key={query.id}
            className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4 hover:bg-white/10 transition"
          >
            <p className="text-white/90 text-base mb-3">{query.text}</p>

            {/* Actions */}
            <div className="flex items-center gap-5 text-sm">
              <button
                onClick={() => handleLikeQuery(query.id)}
                className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
              >
                <Heart size={18} />
                <span>{query.likes}</span>
              </button>

              <button
                onClick={() => toggleReplies(query.id)}
                className="flex items-center gap-1 text-blue-300 hover:text-blue-200 transition"
              >
                <MessageCircle size={18} />
                <span>{openReplies.has(query.id) ? "Hide" : "Comments"}</span>
              </button>
            </div>

            {/* Replies Section */}
            {openReplies.has(query.id) && (
              <div className="mt-4 ml-6 border-l border-white/10 pl-4">
                <h4 className="text-xs uppercase text-white/60 mb-2">Replies</h4>
                {query.replies.length === 0 && (
                  <p className="text-white/50 text-xs mb-2">No replies yet</p>
                )}

                <ul className="space-y-1 mb-3">
                  {query.replies.map((r) => (
                    <li key={r.id} className="text-white/80 text-sm">
                      {r.text}
                    </li>
                  ))}
                </ul>

                {/* Reply Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg px-3 py-1 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                    placeholder="Write a reply..."
                    value={replyText[query.id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [query.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-medium transition"
                    onClick={() => handleAddReply(query.id)}
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
