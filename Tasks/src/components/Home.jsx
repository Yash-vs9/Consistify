import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!token) {
      alert('Token not found');
      navigate('/sign');
    }
  }, [token, navigate]);

  useEffect(() => {
    const scripts = [
      'https://cdn.botpress.cloud/webchat/v2.2/inject.js',
      '/script.js',
      '/script2.js',
    ];
    const loadedScripts = scripts.map((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return script;
    });
    return () => {
      loadedScripts.forEach((script) => {
        document.body.removeChild(script);
      });
    };
  }, []);

  return (
    <div className="w-screen min-h-screen bg-[#020a13] text-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 w-full h-[7vh] flex justify-between items-center px-4 bg-white/5 backdrop-blur text-xl">
        <a href={`/${usernameJWT}/friends`} className="hover:underline">
          Add Friends
        </a>
        <img src="rectangle-list-regular.svg" alt="icon" className="h-6" />
        <p>Consistify</p>
        <a href="/sign" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-800 transition">Go to Sign</a>
      </nav>

      {/* Welcome Box */}
     

      {/* Canvas for particles */}
      <canvas id="particlesCanvas" className="fixed top-0 left-0 w-full h-full z-0" />

      <hr className="h-2 w-full bg-black/80 border-none m-0" />

      {/* Sections */}
      <section className="flex w-full h-screen">
        <div className="w-1/2 flex justify-center items-center bg-[#11121a]">
          <div className="text-5xl bg-[#1c1f2b] text-white p-10 rounded-lg relative">
            <div className="absolute inset-0 rounded-lg bg from-pink-500 via-green-400 to-blue-400 blur-xl opacity-40 animate-spin-slow" />
            What exactly is Consistify?
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center bg-[#11121a]">
          <div className="text-lg text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400 bg-clip-text p-6">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam ullam doloremque aliquam molestiae libero...
          </div>
        </div>
      </section>

      <hr className="h-2 w-full bg-black/80 border-none m-0" />

      <section className="flex w-full h-screen">
        <div className="w-1/2 flex justify-center items-center bg-[#11121a]">
          <div className="text-lg text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400 bg-clip-text p-6">
            <ul className="space-y-2 font-bold">
              <li className="hover:text-pink-400 transition">Leveling up system</li>
              <li className="hover:text-pink-400 transition">New AI Chatbot</li>
              <li className="hover:text-pink-400 transition">Leveling up with friends</li>
              <li className="hover:text-pink-400 transition">Ranks for every level</li>
              <li className="hover:text-pink-400 transition">Something</li>
              <li className="hover:text-pink-400 transition">Something</li>
            </ul>
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center bg-[#11121a]">
          <div className="text-5xl bg-[#1c1f2b] text-white p-10 rounded-lg relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 via-green-400 to-blue-400 blur-xl opacity-40 animate-spin-slow" />
            What's new in Consistify?
          </div>
        </div>
      </section>

      <hr className="h-2 w-full bg-black/80 border-none m-0" />

      {/* Footer slider */}
      <footer className="w-full h-[50vh] flex justify-center items-center bg-[#020a13]">
        <div className="flex space-x-12">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`h-48 w-48 rounded-full bg-blue-600 flex justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br ${
                num === 1
                  ? 'from-yellow-400 to-pink-500'
                  : num === 2
                  ? 'from-blue-400 to-blue-200'
                  : num === 3
                  ? 'from-orange-400 to-yellow-400'
                  : num === 4
                  ? 'from-blue-600 to-blue-900'
                  : 'from-gray-700 to-gray-900'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-20 h-20"
              >
                <circle cx="256" cy="256" r="200" fill="#ddd" />
              </svg>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Home;