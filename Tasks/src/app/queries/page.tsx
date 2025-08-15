'use client';
import { useEffect, useState } from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import Sidebar from "components/Sidebar";
import { useRouter } from "next/navigation";

interface Comment {
  id: number;
  reply: string;
  queryId: number;
  username: string;
}

interface Query {
  id: number;
  queryName: string;
  queryDescription: string;
  likes: number;
  comments: Comment[];
  username: string;
  skillsRequired: string[];
}

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [queries, setQueries] = useState<Query[]>([]);
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [pageNo, setPageNo] = useState<number>(0); // new
  const [isLastPage, setIsLastPage] = useState<boolean>(false); // to disable Next button

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchQueries = async () => {
      try {
        const response = await fetch(`http://localhost:8080/query/get?pageNo=${pageNo}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw await response.json();
        const data = await response.json();
        
        // If your backend returns a Page object
        if (data.content && Array.isArray(data.content)) {
          setQueries(data.content);
          setIsLastPage(data.last);
        } else {
          // If your backend returns just a list
          setQueries(data);
          setIsLastPage(data.length < 10); // assume last page if less than page size
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchQueries();
  }, [token, pageNo]);

  const handleLikeQuery = async (id: number) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q))
    );
    try {
      await fetch(`http://localhost:8080/query/${id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      setQueries((prev) =>
        prev.map((q) => (q.id === id ? { ...q, likes: q.likes - 1 } : q))
      );
    }
  };

  const handleAddComment = async (id: number) => {
    const newComment: Comment = {
      id: Date.now(),
      reply: commentText[id],
      queryId: id,
      username: "You"
    };
    setCommentText((prev) => ({ ...prev, [id]: "" }));
    setQueries((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, comments: [...q.comments, newComment] } : q
      )
    );
    try {
      await fetch("http://localhost:8080/query/postComment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reply: commentText[id], queryId: id })
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="z-20">
        <Sidebar />
        <button
          onClick={() => router.push("/query")}
          className="absolute top-20 right-20 bg-gray-900 text-white px-5 py-2 rounded-xl shadow-md hover:bg-slate-600 transition-colors duration-200"
        >
          Create
        </button>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 px-4 py-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_70%)]"></div>
        </div>

        {/* Foreground */}
        <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/10">
          <h1 className="text-4xl font-bold mb-8 text-center text-white tracking-tight">
            💬 Community Queries
          </h1>

          {queries.map((query) => (
            <div
              key={query.id}
              onClick={() => setSelectedQuery(query)}
              className="cursor-pointer bg-slate-900/60 border border-slate-800 rounded-lg p-5 mb-5 shadow-md hover:shadow-lg hover:border-cyan-400 transition-all duration-300"
            >
              <p className="text-white text-lg font-semibold mb-1">{query.queryName}</p>
              <p className="text-slate-400 text-xs mb-4">— by {query.username}</p>

              <div className="flex items-center gap-6 text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikeQuery(query.id);
                  }}
                  className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
                >
                  <Heart size={18} />
                  <span>{query.likes}</span>
                </button>
                <div className="flex items-center gap-1 text-cyan-300">
                  <MessageCircle size={18} />
                  <span>{query.comments.length} Comments</span>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-between mt-6">
            <button
              disabled={pageNo === 0}
              onClick={() => setPageNo((prev) => Math.max(0, prev - 1))}
              className={`px-4 py-2 rounded-lg text-white ${
                pageNo === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              Previous
            </button>
            <button
              disabled={isLastPage}
              onClick={() => setPageNo((prev) => prev + 1)}
              className={`px-4 py-2 rounded-lg text-white ${
                isLastPage ? "bg-gray-600 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal (unchanged) */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSelectedQuery(null)}
          ></div>
          <div className="relative z-10 w-full max-w-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700 p-6 animate-scaleIn">
            <button
              onClick={() => setSelectedQuery(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X size={22} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-1">{selectedQuery.queryName}</h2>
            <p className="text-slate-400 text-sm mb-4">— by {selectedQuery.username}</p>
            <p className="text-slate-300 mb-6">{selectedQuery.queryDescription}</p>
            <h4 className="text-sm font-semibold text-slate-400 mb-3">Comments</h4>
            <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {selectedQuery.comments.length === 0 ? (
                <p className="text-slate-500 text-xs mb-2">No comments yet</p>
              ) : (
                selectedQuery.comments.map((comment) => (
                  <p key={comment.id} className="text-slate-300 text-sm mb-2">
                    <span className="font-bold text-cyan-400">{comment.username}:</span> {comment.reply}
                  </p>
                ))
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                className="flex-1 bg-slate-800 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                placeholder="Write a comment..."
                value={commentText[selectedQuery.id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [selectedQuery.id]: e.target.value,
                  }))
                }
              />
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                onClick={() => handleAddComment(selectedQuery.id)}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}