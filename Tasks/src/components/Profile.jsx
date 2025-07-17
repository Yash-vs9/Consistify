import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPage from './LoadingPage';
import { fetchTasks } from '../features/taskSlice/taskSlice';
import { fetchUser } from '../features/userSlice/userSlice';
import { Pencil, X } from 'lucide-react';

const Profile = () => {
  const token = localStorage.getItem('authToken');
  if (!token) alert('Login');

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
  const [username, setUsername] = useState(usernameJWT);
  const [level, setLevel] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    tasks,
    status: taskStatus,
  } = useSelector((state) => state.task);

  const {
    user,
    status: userStatus,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const profilePicUrl = '../src/assets/DeWatermark.ai_1739087600948.png';

  useEffect(() => {
    dispatch(fetchTasks(usernameJWT));
    dispatch(fetchUser());
  }, []);

  const xp = 99;
  const xpPercent = Math.min((xp % 1000) / 10, 100);

  if (userStatus === 'loading' || !user?.username) {
    return <LoadingPage />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f1117] overflow-hidden px-6 py-10 text-white">


      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="stars" />

      {/* Profile Card Container */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* ✏️ Edit Icon Button */}
        <button
          className="absolute top-3 right-3 bg-[#2a2b38] p-2 rounded-full hover:bg-[#344155] transition duration-200 shadow-md"
          title="Edit Profile"
          onClick={() => setIsModalOpen(true)}
        >
          <Pencil className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Profile Card */}
        <div className="bg-[#1e1f29] rounded-3xl shadow-2xl border border-cyan-500/20 p-10 flex flex-col md:flex-row gap-10">
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

          {/* Details Section */}
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
                  No Achievement yet
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center mt-4">
              <div className="bg-[#2c2e3e] p-4 rounded-xl">
                <p className="text-cyan-400 font-bold text-lg">{tasks.length}</p>
                <p className="text-gray-400 text-sm">Tasks Created</p>
              </div>
              <div className="bg-[#2c2e3e] p-4 rounded-xl">
                <p className="text-cyan-400 font-bold text-lg">
                  {user?.friends?.length ?? 0}
                </p>
                <p className="text-gray-400 text-sm">Friends</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1f2233] p-6 rounded-xl w-full max-w-md shadow-xl relative text-white">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-cyan-300">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Level</label>
                <input
                  type="number"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-cyan-500 hover:bg-cyan-600 transition w-full p-2 rounded text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;