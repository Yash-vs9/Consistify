import React, { useState } from 'react';
import logo from '../assets/DeWatermark.ai_1739087600948.png';
import { signData, loginUser } from './api';
import { useNavigate } from 'react-router-dom';

const Sign = () => {
  const [active, setActive] = useState(false);
  const [name, setName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const name = await loginUser(loginEmail, loginPassword);
      setName(name);
      navigate(`/`);
    } catch (error) {
      alert('Login failed');
    }
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const name1 = await signData(username, registerEmail, registerPassword);
      if (name1) navigate(`/`);
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className={`flex h-screen w-screen bg-gradient-to-b from-[#e6f3fc] to-[#bad7ef] transition-all duration-500 overflow-hidden`}>
      {/* Left Panel */}
      <div className="w-1/2 flex items-center justify-center">
        {/* Login Form */}
        <div className={`bg-slate-400 p-8 rounded-2xl shadow-xl w-[340px] text-center transition-all duration-500 ${active ? 'hidden' : 'block'}`}>
          <h2 className="text-2xl font-semibold text-[#496b8d] mb-4">Sign In</h2>
          <form onSubmit={handleLogin}>
            <div className="bg-[#d1e6f7] p-3 rounded-xl shadow-inner mb-4">
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="bg-transparent w-full outline-none text-[#1e4873] text-base"
              />
            </div>
            <div className="bg-[#d1e6f7] p-3 rounded-xl shadow-inner mb-4">
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="bg-transparent w-full outline-none text-[#1e4873] text-base"
              />
            </div>
            <div className="flex justify-between text-sm text-[#34495e] mb-4">
              <label><input type="checkbox" className="mr-1" /> Remember Me</label>
              <a href="#" className="text-[#315e8f] hover:text-[#214266]">Forgot Password?</a>
            </div>
            <button type="submit" className="w-full bg-[#4c7bb5] text-white py-3 rounded-xl shadow-md hover:bg-[#3b6ca8] transition">Sign In</button>
            <div className="text-sm mt-4 text-[#2c3e50]">
              New to our site? <span className="text-[#315e8f] font-medium cursor-pointer hover:text-[#1d3d66]" onClick={() => setActive(true)}>Create account</span>
            </div>
          </form>
        </div>

        {/* Register Form */}
        <div className={`bg-slate-400 p-8 rounded-2xl shadow-xl w-[340px] text-center transition-all duration-500 ${active ? 'block' : 'hidden'}`}>
          <h2 className="text-2xl font-semibold text-[#1e4873] mb-4">Sign Up</h2>
          <form onSubmit={registerSubmit}>
            <div className="bg-[#d1e6f7] p-3 rounded-xl shadow-inner mb-4">
              <input
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent w-full outline-none text-[#1e4873] text-base"
              />
            </div>
            <div className="bg-[#d1e6f7] p-3 rounded-xl shadow-inner mb-4">
              <input
                type="email"
                placeholder="Email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="bg-transparent w-full outline-none text-[#1e4873] text-base"
              />
            </div>
            <div className="bg-[#d1e6f7] p-3 rounded-xl shadow-inner mb-4">
              <input
                type="password"
                placeholder="Password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="bg-transparent w-full outline-none text-[#1e4873] text-base"
              />
            </div>
            <button type="submit" className="w-full bg-[#4c7bb5] text-white py-3 rounded-xl shadow-md hover:bg-[#3b6ca8] transition">Register</button>
            <div className="text-sm mt-4 text-[#2c3e50]">
              Already have an account? <span className="text-[#315e8f] font-medium cursor-pointer hover:text-[#1d3d66]" onClick={() => setActive(false)}>Login</span>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel with Logo */}
      <div className="w-1/2 h-full">
        <img
          src={logo}
          alt="Logo"
          className="w-full h-full object-cover rounded-l-3xl transition-all duration-500"
        />
      </div>
    </div>
  );
};

export default Sign;