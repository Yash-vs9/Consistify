import React, { useEffect, useState } from 'react';
import styles from './Friends.module.css'

import { useNavigate, useParams } from 'react-router-dom';


const Friends = () => {
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

  const token = localStorage.getItem('authToken');
  const usernameJWT = getUsernameFromToken(token);
  const { username: paramUsername } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (paramUsername !== usernameJWT) {
      navigate('/home');
    }
  }, [paramUsername, usernameJWT, navigate]);

  const [usernames, setUsernames] = useState([]);
  const [req, setReq] = useState([]);
  const [friends, setFriends] = useState([]);
  const [param, setParam] = useState(paramUsername);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
      })
      .then((data) => setUsernames(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, [paramUsername]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`http://localhost:8080/users/${paramUsername}/friends`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    if (paramUsername) fetchFriends();
  }, [paramUsername, token]);

  useEffect(() => {
    fetch(`http://localhost:8080/users/requests/${paramUsername}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch friend requests');
        return response.json();
      })
      .then((data) => setReq(data))
      .catch((error) => console.error('Error fetching requests:', error));
  }, [paramUsername]);

  const handleAddFriend = async (toUsername, e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/users/${paramUsername}/send-request/${toUsername}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert('Friend request sent!');
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Something went wrong');
    }
  };

  const handleAddFriendReq = async (toUsername, e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/users/${paramUsername}/accept-request/${toUsername}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert('Friend request accepted');
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className={styles.friendRealWindow}>
      <div className={styles.friendWindow}>
        <h1>USERS</h1>
        <div id="req" className={styles.reqWrapper}>
          <button>Requests</button>
          <div className={styles.requestContainer}>
            {req.map((request, index) => (
              <div className={styles.requestItem} key={index}>
                <span>{request}</span>
                <button onClick={(e) => handleAddFriendReq(request, e)}>Accept</button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.friendContainer}>
          {usernames.map((username, index) => (
            <div
              className={styles.usernames}
              key={index}
              style={{ '--order': index }}
            >
              <span>{username}</span>
              <button onClick={(e) => handleAddFriend(username, e)} id="add">Add</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;