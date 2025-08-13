'use client';
import { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

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
  const [token, setToken] = useState<string>("");
  const [queries, setQueries] = useState<Query[]>([]);
  const [commentText, setCommentText] = useState<Record<number, string>>({});
  const [openComments, setOpenComments] = useState<Set<number>>(new Set());

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchQueries = async () => {
      try {
        const response = await fetch("http://localhost:8080/query/get", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw await response.json();
        const data = await response.json();
        setQueries(data);
        console.log(data)

      } catch (e) {
        console.error(e);
      }
    };

    fetchQueries();
  }, [token]);

  const handleLikeQuery = async (id: number) => {
    // Optimistic update
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
    } catch (err) {
      console.error("Failed to save like", err);
      setQueries((prev) =>
        prev.map((q) => (q.id === id ? { ...q, likes: q.likes - 1 } : q))
      );
    }
  };

  const handleAddComment = async (id: number) => {
    const newComment: Comment = {
      id: Date.now(), // temporary ID for UI
      reply: commentText[id],
      queryId: id,
      username: "You" // or fetch actual logged-in user's name
    };
    setCommentText("")
  
    // Optimistic UI update
    setQueries((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, comments: [...q.comments, newComment] } : q
      )
    );
    const body={
      reply:commentText[id],
      queryId:id
    }
    console.log(body)
   const response=await fetch("http://localhost:8080/query/postComment",{
    method:"POST",
    headers:{
      Authorization:`Bearer ${token}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify(body)
   })
   if(!response.ok){
    const errData=await response.text();
    console.log(errData)
  }
  const data=await response.json()
  console.log(data)
};

  const toggleComments = (id: number) => {
    setOpenComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 animate-pulse opacity-25 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.4),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/10">
        <h1 className="text-3xl font-bold mb-6 text-center text-white/90 tracking-tight">
          💬 Community Queries
        </h1>

        {queries.map((query) => (
          <div
            key={query.id}
            className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-200"
          >
            <p className="text-white text-lg font-medium mb-1">
              {query.queryName}
            </p>
            <p className="text-slate-400 text-xs mb-3">— by {query.username}</p>

            <div className="flex items-center gap-6 text-sm mb-2">
              <button
                onClick={() => handleLikeQuery(query.id)}
                className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
              >
                <Heart size={18} />
                <span>{query.likes}</span>
              </button>

              <button
                onClick={() => toggleComments(query.id)}
                className="flex items-center gap-1 text-blue-300 hover:text-blue-200 transition"
              >
                <MessageCircle size={18} />
                <span>
                  {openComments.has(query.id) ? "Hide" : "Comments"}
                </span>
              </button>
            </div>

            {openComments.has(query.id) && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <h4 className="text-xs uppercase text-slate-400 mb-2">
                  Comments
                </h4>
                {query.comments.length === 0 && (
                  <p className="text-slate-500 text-xs mb-2">
                    No comments yet
                  </p>
                )}

                {query.comments.map((comment) => (
                  <p
                    key={comment.id}
                    className="text-slate-300 text-sm mb-1"
                  >
                     <span className="font-bold">{comment.username}</span> {comment.reply} 
                  </p>
                ))}

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    className="flex-1 bg-slate-900 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-3 py-1 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                    placeholder="Write a comment..."
                    value={commentText[query.id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [query.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-medium transition"
                    onClick={() => handleAddComment(query.id)}
                  >
                    Comment
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