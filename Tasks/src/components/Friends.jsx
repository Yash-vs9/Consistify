<<<<<<< HEAD:Tasks/src/components/Friends.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingPage from './LoadingPage';
import { Pencil, MessageCircle, UserCircle, UserPlus } from 'lucide-react';

const Friends = () => {
  const [usernames, setUsernames] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const { username: paramUsername } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  if (!token) alert('Please login to continue.');
=======
"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "components/Sidebar";
import LoadingPage from "components/LoadingPage";
import { Pencil, MessageCircle, UserCircle, UserPlus ,ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

const Friends: React.FC = () => {
  const router = useRouter();
  const [pageNo,setPageNo]=useState<number>(1);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading,setLoading]=useState<boolean>(true)
>>>>>>> 6ff8aa9 (added pagable in users fetching):tasks/src/app/users/page.tsx

  const getUsernameFromToken = (token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.sub || payload.username || null;
    } catch {
      return null;
    }
  };

  const usernameJWT = getUsernameFromToken(token);

  const goToChat = (e, username) => {
    e.preventDefault();
    navigate(`/${username}/chat`);
  };
<<<<<<< HEAD:Tasks/src/components/Friends.jsx

  useEffect(() => {
    if (paramUsername !== usernameJWT) navigate('/home');
  }, [paramUsername, usernameJWT, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsernames(data);
    } catch {
      setError('Failed to load users.');
=======
  const fetchLeftPage = async () => {
    const newPage = pageNo - 1;
    if (newPage < 0) return; // Optional: Prevent going below page 0
    try {
      const response = await fetch(`http://localhost:8080/users?pageNo=${newPage}`, {
        method:"GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errData = await response.text();
        throw new Error(errData);
      }
      const data = await response.json();
      setUsernames(data);
      setPageNo(newPage); // Now update state after success
    } catch (e) {
      toast.error("Error: " + e);
>>>>>>> 6ff8aa9 (added pagable in users fetching):tasks/src/app/users/page.tsx
    }
  };
  
  const fetchRightPage = async () => {
    const newPage = pageNo + 1;
    try {
      const response = await fetch(`http://localhost:8080/users?pageNo=${newPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errData = await response.text();
        throw new Error(errData);
      }
      const data = await response.json();
      setUsernames(data);
      setPageNo(newPage); // Now update state after success
    } catch (e) {
      toast.error("Error: " + e);
    }
  };

  // const fetchUsers = async () => {
  //   if (!token) return;
  //   try {
  //     const res = await fetch("http://localhost:8080/users", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (!res.ok) throw new Error("Failed to fetch users");
  //     const data: string[] = await res.json();
  //     setUsernames(data);
  //   } catch {
  //     setError("Failed to load users.");
  //   }
  // };

  const fetchFriends = async () => {
    try {
      const res = await fetch('http://localhost:8080/users/friends', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriends(data);
    } catch {
<<<<<<< HEAD:Tasks/src/components/Friends.jsx
      setError('Failed to load friends.');
=======

      setError("Failed to load friends.");
>>>>>>> 6ff8aa9 (added pagable in users fetching):tasks/src/app/users/page.tsx
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://localhost:8080/users/requests/${paramUsername}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data);
    } catch {
      setError('Failed to load friend requests.');
    }
  };

  useEffect(() => {
<<<<<<< HEAD:Tasks/src/components/Friends.jsx
    fetchUsers();
    fetchFriends();
    fetchRequests();
  }, [paramUsername, token]);
=======
    if (!token) return;
    setError(null);
    setLoading(true);
    Promise.all([fetchLeftPage(), fetchFriends(), fetchRequests()])
      .catch(() => setError("Failed to load some data."))
      .finally(() => setLoading(false));
  }, [token]);
  
>>>>>>> 6ff8aa9 (added pagable in users fetching):tasks/src/app/users/page.tsx

  const handleAddFriend = async (toUsername) => {
    try {
      const res = await fetch(`http://localhost:8080/users/send-request/${toUsername}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const msg = await res.text();
      alert(msg);
    } catch {
      alert('Could not send request.');
    }
  };

  const handleAcceptRequest = async (fromUsername) => {
    try {
      const res = await fetch(`http://localhost:8080/users/${fromUsername}/accept-request`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const msg = await res.text();
      alert(msg);
      fetchFriends();
      fetchRequests();
    } catch {
      alert('Could not accept request.');
    }
  };

<<<<<<< HEAD:Tasks/src/components/Friends.jsx
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (usernames.length === 0) return <LoadingPage />;

=======
  if (error)
    return (
      <div className="text-red-500 text-center mt-10 font-semibold">{error}</div>
    );

  if(loading) return <LoadingPage/>
>>>>>>> 6ff8aa9 (added pagable in users fetching):tasks/src/app/users/page.tsx
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f1117] text-white font-poppins">
      <Sidebar usernameJWT={usernameJWT} />
      <main className="p-8 overflow-y-auto relative">
        {/* Glows */}
        <div className="absolute w-[300px] h-[300px] bg-cyan-400/20 blur-3xl rounded-full top-10 left-10 animate-pulse z-0" />
        <div className="absolute w-[300px] h-[300px] bg-indigo-600/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse z-0" />

        {/* Container */}
        <div className="relative z-10 space-y-10">
          <h1 className="text-4xl font-bold text-white border-b border-cyan-500 pb-2">Friends</h1>

          {/* Friend Requests */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Friend Requests</h2>
            <div className="bg-[#1e293b] p-4 rounded-lg shadow border border-white/5 space-y-3">
              {requests.length > 0 ? (
                requests.map((req, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-slate-800 px-4 py-2 rounded-md"
                  >
                    <span>{req}</span>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded transition"
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No incoming requests</p>
              )}
            </div>
          </section>

          {/* Your Friends */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Your Friends</h2>
            <div className="bg-[#1e293b] p-4 rounded-lg shadow border border-white/5 space-y-3">
              {friends.length > 0 ? (
                friends.map((friend, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-slate-700 text-white rounded-md font-medium"
                  >
                    {friend}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">You haven’t added anyone yet 😢</p>
              )}
            </div>
          </section>

          {/* All Users */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Discover Users</h2>
            <div className="grid gap-4">
            <div className="flex items-center gap-4">
  {/* Left Arrow */}
  <button onClick={fetchLeftPage} className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-white">
    <ChevronLeft size={20} />
  </button>

  {/* Page Buttons */}
  

  {/* Right Arrow */}
  <button onClick={fetchRightPage} className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-white">
    <ChevronRight size={20} />
  </button>
  <span className="p-1 bg-cyan-600 rounded w-20 font-mono transition-all duration-200 hover:scale-105 hover:bg-cyan-700">
  Page: {pageNo}
</span></div>
              
              {usernames
                .filter((u) => u !== usernameJWT)
                .map((username, i) => {
                  const isFriend = friends.includes(username);
                  const isRequested = requests.includes(username);
                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-[#1f2937] px-5 py-3 rounded-lg shadow border border-white/5 hover:scale-[1.02] transition"
                    >
                      <span className="font-semibold">{username}</span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/profile/${username}`)}
                          title="View Profile"
                          className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-700"
                        >
                          <UserCircle className="text-white" size={20} />
                        </button>
                        <button
                          onClick={(e) => goToChat(e, username)}
                          title="Chat"
                          className="p-2 bg-green-600 rounded-full hover:bg-green-700"
                        >
                          <MessageCircle className="text-white" size={20} />
                        </button>
                        <button
                          onClick={() => handleAddFriend(username)}
                          disabled={isFriend || isRequested}
                          title={
                            isFriend ? 'Already Friends' : isRequested ? 'Request Sent' : 'Add Friend'
                          }
                          className={`p-2 rounded-full transition ${
                            isFriend
                              ? 'bg-gray-600 cursor-not-allowed'
                              : isRequested
                              ? 'bg-yellow-500 hover:bg-yellow-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          <UserPlus size={20} className="text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Friends;