'use client';

import React, { useEffect } from 'react';

import router from 'next/router';

const Home: React.FC = () => {

 

  

  useEffect(() => {
    const scripts = ['/script.js'];
    const loadedScripts = scripts.map((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      document.body.appendChild(script);
      return script;
    },[]);

    return () => {
      loadedScripts.forEach((script) => {
        document.body.removeChild(script);
      });
    };
  }, []);

  return (
    <div className="w-screen min-h-screen bg-[#020a13] text-white font-sans overflow-x-hidden relative">
      {/* Particle Canvas */}
      <canvas id="particlesCanvas" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />

     

      {/* Section 1: What is Consistify */}
      <section className="flex w-full h-screen items-center relative z-10">
        <div className="w-1/2 flex justify-center items-center bg-[#11121a] animate-fadeInLeft">
          <div className="text-5xl bg-[#1c1f2b] text-white p-10 rounded-lg relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-green-400 to-blue-400 blur-2xl opacity-30 animate-spin-slow rounded-xl" />
            <span className="relative z-10">What exactly is Consistify?</span>
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center bg-[#11121a] animate-fadeInRight">
          <p className="text-lg text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400 bg-clip-text p-6 leading-loose">
            Consistify is your productivity ecosystem – combining task tracking, leveling systems, and a personal AI assistant to keep you consistent.
          </p>
        </div>
      </section>

      {/* Section 2: Features */}
      <section className="flex w-full h-screen items-center relative z-10">
        <div className="w-1/2 flex justify-center items-center bg-[#11121a] animate-fadeInLeft">
          <ul className="text-lg text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400 bg-clip-text p-6 space-y-4 font-bold">
            <li className="hover:text-pink-400 transition">🚀 Leveling up system</li>
            <li className="hover:text-pink-400 transition">🤖 New AI Chatbot</li>
            <li className="hover:text-pink-400 transition">🧑‍🤝‍🧑 Leveling with friends</li>
            <li className="hover:text-pink-400 transition">🏆 Ranks for every level</li>
            <li className="hover:text-pink-400 transition">🔐 Secure user data</li>
            <li className="hover:text-pink-400 transition">🎯 Gamified dashboard</li>
          </ul>
        </div>
        <div className="w-1/2 flex justify-center items-center bg-[#11121a] animate-fadeInRight">
          <div className="text-5xl bg-[#1c1f2b] text-white p-10 rounded-lg relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-green-400 to-blue-400 blur-2xl opacity-30 animate-spin-slow rounded-xl" />
            <span className="relative z-10">What's new in Consistify?</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full min-h-[40vh] flex justify-center items-center bg-[#020a13] relative z-10">
  <div className="flex space-x-8">
  

    {/* LinkedIn */}
    <a href="https://www.linkedin.com/in/yash-vardhan-shukla-b0a71331b/" target="_blank" rel="noopener noreferrer"
      className="group h-20 w-20 rounded-full flex justify-center items-center bg-gradient-to-br from-blue-800 to-cyan-400 hover:scale-110 transition duration-300 shadow-lg"
      aria-label="LinkedIn"
    >
      <svg className="w-10 h-10 fill-white group-hover:fill-cyan-100 transition" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zM8.666 20h-3v-10h3v10zm-1.44-11.218c-.982 0-1.78-.796-1.78-1.782 0-.983.797-1.782 1.78-1.782.979 0 1.778.799 1.778 1.782 0 .986-.799 1.782-1.778 1.782zm13.107 11.219h-3v-5.326c0-1.27-.025-2.902-1.765-2.902-1.77 0-2.044 1.382-2.044 2.807v5.421h-3v-10h2.879v1.367h.041c.404-.767 1.392-1.576 2.863-1.576 3.064 0 3.631 2.017 3.631 4.641v5.568z"/>
      </svg>
    </a>
   
    {/* GitHub */}
    <a href="https://github.com/Yash-vs9" target="_blank" rel="noopener noreferrer"
      className="group h-20 w-20 rounded-full flex justify-center items-center bg-gradient-to-br from-gray-700 to-gray-900 hover:scale-110 transition duration-300 shadow-lg"
      aria-label="GitHub"
    >
      <svg className="w-10 h-10 fill-white group-hover:fill-gray-300 transition" viewBox="0 0 24 24">
        <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.29 3.438 9.773 8.205 11.387.6.112.82-.26.82-.577 0-.285-.01-1.041-.016-2.044-3.338.724-4.042-1.608-4.042-1.608C4.422 17.684 3.633 17.34 3.633 17.34c-1.086-.743.082-.728.082-.728 1.205.084 1.838 1.236 1.838 1.236 1.067 1.832 2.803 1.303 3.488.997.108-.773.42-1.302.763-1.602-2.665-.3-5.466-1.333-5.466-5.93 0-1.31.469-2.382 1.235-3.222-.123-.303-.535-1.522.117-3.176 0 0 1.008-.322 3.3 1.23a11.525 11.525 0 013.003-.404c1.018.004 2.044.138 3.004.404 2.289-1.553 3.294-1.23 3.294-1.23.654 1.654.242 2.873.119 3.176.77.84 1.232 1.912 1.232 3.222 0 4.609-2.805 5.625-5.476 5.921.432.371.816 1.102.816 2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 22.067 24 17.586 24 12.297 24 5.67 18.627.297 12 .297z"/>
      </svg>
    </a>
  </div>
</footer>


    </div>
  );
};

export default Home;