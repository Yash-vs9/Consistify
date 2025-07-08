import React from 'react';
import './Profile.css'; // 🟡 custom styles here

const Profile = () => {
  const xp = 99;
  const username = 'Chintu';
  const level = 2;
  const profilePicUrl = '../src/assets/DeWatermark.ai_1739087600948.png'; // ✅ if in public/

  const xpPercent = Math.min((xp % 1000) / 10, 100);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f1117] overflow-hidden px-6 py-10 text-white">

      {/* 🌌 Animated floating blobs outside the box */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      {/* ✨ Twinkling stars background */}
      <div className="stars" />

      {/* Profile Card */}
      <div className="relative z-10 w-full max-w-5xl bg-[#1e1f29] rounded-3xl shadow-2xl border border-cyan-500/20 p-10 flex flex-col md:flex-row gap-10">

        {/* Profile Section */}
        <div className="relative z-10 w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
          <img
            src={profilePicUrl}
            alt="Profile"
            className="w-36 h-36 rounded-full border-4 border-cyan-400 shadow-lg"
          />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            {username}
          </h1>
          <span className="text-cyan-300 font-medium text-lg">Level {level}</span>

          <div className="w-full">
            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-gray-400">{xp % 1000} / 1000 XP</p>
          </div>
        </div>

        {/* Details */}
        <div className="relative z-10 w-full md:w-2/3 flex flex-col justify-between space-y-6">

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-300">About</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Hi! I'm a passionate developer focused on building full-stack web applications.
              I love learning new tech, solving problems, and collaborating with teams.
              This platform tracks your tasks, productivity, and growth.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-cyan-300">Achievements</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <li className="bg-[#2a2b38] px-4 py-2 rounded shadow text-center hover:bg-[#344155] transition">
                🧠 Focused 5 Days
              </li>
              <li className="bg-[#2a2b38] px-4 py-2 rounded shadow text-center hover:bg-[#344155] transition">
                📅 Created 10 Tasks
              </li>
              <li className="bg-[#2a2b38] px-4 py-2 rounded shadow text-center hover:bg-[#344155] transition">
                🏆 1st Milestone
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center mt-4">
            <div className="bg-[#2c2e3e] p-4 rounded-xl">
              <p className="text-cyan-400 font-bold text-lg">12</p>
              <p className="text-gray-400 text-sm">Tasks Created</p>
            </div>
            <div className="bg-[#2c2e3e] p-4 rounded-xl">
              <p className="text-cyan-400 font-bold text-lg">5</p>
              <p className="text-gray-400 text-sm">Collaborators</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;