import React, { useState } from 'react';
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
    <div className="relative flex items-center justify-center min-h-screen bg-[#111827] font-poppins px-4 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full top-10 left-10 animate-pulse z-0" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse z-0" />
  
      {/* Sign-in / Register Box */}
      <div className="w-full max-w-md p-8 bg-[#1f2937] rounded-2xl shadow-lg z-10">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          {active ? 'Create an Account' : 'Welcome Back'}
        </h2>
  
        <form onSubmit={active ? registerSubmit : handleLogin} className="space-y-4">
          {active && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={active ? registerEmail : loginEmail}
            onChange={(e) =>
              active ? setRegisterEmail(e.target.value) : setLoginEmail(e.target.value)
            }
            required
            className="w-full px-4 py-2 rounded-lg bg-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={active ? registerPassword : loginPassword}
            onChange={(e) =>
              active ? setRegisterPassword(e.target.value) : setLoginPassword(e.target.value)
            }
            required
            className="w-full px-4 py-2 rounded-lg bg-[#374151] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
  
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {active ? 'Register' : 'Sign In'}
          </button>
        </form>
  
        <div className="text-sm text-gray-400 text-center mt-4">
          {active ? (
            <>
              Already have an account?{' '}
              <button
                className="text-cyan-400 hover:underline"
                onClick={() => setActive(false)}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New here?{' '}
              <button
                className="text-cyan-400 hover:underline"
                onClick={() => setActive(true)}
              >
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sign;