import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom';

const FriendsList = () => {
  const navigate=useNavigate();
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
  const { username} = useParams(); 
  const [friends,setFriends]=useState([])
  useEffect(() => {
      const fetchFriends = async () => {
        try {
          const res = await fetch(`http://localhost:8080/users/${username}/friends`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          setFriends(data);
        } catch (err) {
          console.error('Error:', err);
        }
      };
  
      if (username) fetchFriends();
    }, [username, token]);
    const handleClick=(e,username)=>{
      e.preventDefault();
      navigate(`/${username}/chat`)
    }
  return (
    <div className='friendListWindow'>
      <div className='friendListContainer'>
      {
          friends.map((username,index)=>{
            return <div className='usernames' key={index}><span>{username}</span> <button onClick={(e)=>handleClick(e,username)}>Message</button> </div>
          })
        }
      </div>
    </div>
  )
}

export default FriendsList
