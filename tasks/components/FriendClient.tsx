'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import LoadingPage from './LoadingPage';
import { MessageCircle, UserCircle, UserPlus } from 'lucide-react';
// ✅ Correct import for app-directory navigation
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';


interface FriendsClientProps {
  usernames: string[];
  requests: string[];
  friends: string[];
  token: string;
}

const FriendsClient: React.FC<FriendsClientProps> = ({ usernames, requests, friends, token }) => {
  const [localRequests, setLocalRequests] = useState(requests);
  const [localFriends, setLocalFriends] = useState(friends);

  const params = useParams();
  const router = useRouter();

  // Next.js app-dir Params are always strings or arrays
  const paramUsername = typeof params.username === 'string' 
    ? params.username 
    : Array.isArray(params.username) && params.username.length > 0 
      ? params.username[0] 
      : '';

  const getUsernameFromToken = (token: string) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      return payload.sub || payload.username || null;
    } catch {
      return null;
    }
  };

  const usernameJWT = getUsernameFromToken(token);

  useEffect(() => {
    if (paramUsername !== usernameJWT) {
      router.push('/home');
    }
  }, [paramUsername, usernameJWT, router]);

  const goToChat = (e: React.MouseEvent, username: string) => {
    e.preventDefault();
    router.push(`/${username}/chat`);
  };

  const handleAddFriend = async (toUsername: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/users/send-request/${toUsername}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const msg = await res.text();
      alert(msg);
    } catch {
      alert('Could not send request.');
    }
  };

  const handleAcceptRequest = async (fromUsername: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/users/${fromUsername}/accept-request`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const msg = await res.text();
      alert(msg);
      setLocalFriends([...localFriends, fromUsername]);
      setLocalRequests(localRequests.filter((r) => r !== fromUsername));
    } catch {
      alert('Could not accept request.');
    }
  };

  if (!usernames || usernames.length === 0) return <LoadingPage />;

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f1117] text-white font-poppins">
      <Sidebar/>
      <main className="p-8 overflow-y-auto relative">
        <div className="absolute w-[300px] h-[300px] bg-cyan-400/20 blur-3xl rounded-full top-10 left-10 animate-pulse z-0" />
        <div className="absolute w-[300px] h-[300px] bg-indigo-600/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse z-0" />
        <div className="relative z-10 space-y-10">
          <h1 className="text-4xl font-bold text-white border-b border-cyan-500 pb-2">
            Friends
          </h1>

          {/* Requests */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Friend Requests</h2>
            <div className="bg-[#1e293b] p-4 rounded-lg shadow border border-white/5 space-y-3">
              {localRequests.length > 0 ? (
                localRequests.map((req, i) => (
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

          {/* Friends */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Your Friends</h2>
            <div className="bg-[#1e293b] p-4 rounded-lg shadow border border-white/5 space-y-3">
              {localFriends.length > 0 ? (
                localFriends.map((friend, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 bg-slate-700 text-white rounded-md font-medium"
                  >
                    {friend}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  You haven’t added anyone yet 😢
                </p>
              )}
            </div>
          </section>

          {/* Discover Users */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Discover Users</h2>
            <div className="grid gap-4">
              {usernames
                .filter((u) => u !== usernameJWT)
                .map((username, i) => {
                  const isFriend = localFriends.includes(username);
                  const isRequested = localRequests.includes(username);
                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-[#1f2937] px-5 py-3 rounded-lg shadow border border-white/5 hover:scale-[1.02] transition"
                    >
                      <span className="font-semibold">{username}</span>
                      <div className="flex gap-3">
                        <button
                          // Viewing profile
                          onClick={() => router.push(`/profile/${username}`)}
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
                            isFriend
                              ? 'Already Friends'
                              : isRequested
                              ? 'Request Sent'
                              : 'Add Friend'
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

export default FriendsClient;
