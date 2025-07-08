import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // ✅ Adjust path as needed
import LoadingPage from './LoadingPage';
const Friends = () => {
  const [usernames, setUsernames] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const { username: paramUsername } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Login');
  }

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

  useEffect(() => {
    if (paramUsername !== usernameJWT) {
      navigate('/home');
    }
  }, [paramUsername, usernameJWT, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsernames(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Could not load users');
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await fetch('http://localhost:8080/users/friends', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError(true);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://localhost:8080/users/requests/${paramUsername}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFriends();
    fetchRequests();
  }, [paramUsername, token]);

  const handleAddFriend = async (toUsername) => {
    try {
      const res = await fetch(`http://localhost:8080/users/send-request/${toUsername}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const msg = await res.text();
      alert(msg);
    } catch (err) {
      alert('Something went wrong');
      setError(true);
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
    } catch (err) {
      alert('Something went wrong');
      setError(true);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (usernames.length === 0) {
      return <LoadingPage />
  }

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f1117] text-white font-[Poppins]">
      {/* Sidebar */}
      <Sidebar usernameJWT={usernameJWT} />

      {/* Friends Page */}
      <main className="p-10 overflow-y-auto">
        <div className="bg-gray-900 rounded-xl p-8 w-full shadow-lg space-y-8">
          <h1 className="text-3xl font-bold border-b-2 border-blue-600 pb-2">USERS</h1>

          {/* Requests */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Requests</h2>
            <div className="bg-slate-800 p-4 rounded-lg space-y-2">
              {requests.length > 0 ? (
                requests.map((reqUser, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-slate-700 px-4 py-2 rounded-md"
                  >
                    <span className="font-medium">{reqUser}</span>
                    <button
                      onClick={() => handleAcceptRequest(reqUser)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p>No requests</p>
              )}
            </div>
          </div>

          {/* Friends List */}
          <div className="bg-slate-700 text-slate-900 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Your Friends</h2>
            <div className="space-y-2">
              {friends.length > 0 ? (
                friends.map((friend, i) => (
                  <div
                    key={i}
                    className="bg-white text-gray-800 px-4 py-2 rounded-md shadow-sm font-medium"
                  >
                    {friend}
                  </div>
                ))
              ) : (
                <p>You have no friends yet 😢</p>
              )}
            </div>
          </div>

          {/* All Users */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-2">All Users</h2>
            {usernames
              .filter((user) => user !== usernameJWT)
              .map((username, i) => {
                const isFriend = friends.includes(username);
                const isRequested = requests.includes(username);
                return (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-md shadow-sm animate-slideIn relative"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="font-semibold">{username}</span>
                    <button
                      onClick={(e) => goToChat(e, username)}
                      className="absolute left-[61vw] bg-green-400 hover:bg-green-500 hover:scale-105 transition duration-300 rounded px-4 py-1"
                    >
                      Chat
                    </button>
                    <button className="absolute left-[54vw] bg-cyan-400 hover:scale-105 transition duration-300 rounded px-4 py-1">
                      Profile
                    </button>

                    <button
                      onClick={() => handleAddFriend(username)}
                      disabled={isFriend || isRequested}
                      className={`${
                        isFriend
                          ? 'bg-gray-600 cursor-not-allowed'
                          : isRequested
                          ? 'bg-yellow-500'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white px-4 py-1 rounded hover:scale-105 transition duration-300`}
                    >
                      {isFriend ? 'Friend' : isRequested ? 'Requested' : 'Add'}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;