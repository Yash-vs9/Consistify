// layout/SidebarLayout.jsx
import React from 'react';
import Sidebar from '../Sidebar';
import MainDashboard from '../MainDashboard';

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

const SidebarLayout = () => {
  const token = localStorage.getItem('authToken');
  const usernameJWT = getUsernameFromToken(token);

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f1117] text-white font-[Poppins]">
      <Sidebar usernameJWT={usernameJWT} />
      <MainDashboard />
    </div>
  );
};

export default SidebarLayout;