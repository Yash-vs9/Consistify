'use client';

import React, { useEffect } from 'react';

import router from 'next/router';

const Home: React.FC = () => {

 

  

  useEffect(() => {
    const scripts = ['/script.js'];
    const loadedScripts = scripts.map((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
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
    {/* Instagram */}
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
      className="group h-20 w-20 rounded-full flex justify-center items-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:scale-110 transition duration-300 shadow-lg"
      aria-label="Instagram"
    >
      <svg className="w-10 h-10 fill-white group-hover:fill-pink-200 transition" viewBox="0 0 24 24">
        <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm0 1.5h8.5c3.025 0 5.25 2.225 5.25 5.25v8.5c0 3.025-2.225 5.25-5.25 5.25h-8.5c-3.025 0-5.25-2.225-5.25-5.25v-8.5c0-3.025 2.225-5.25 5.25-5.25zm8.75 2.75a1 1 0 100 2 1 1 0 000-2zm-4.5 2.5A5.25 5.25 0 108 13.75a5.25 5.25 0 004.25-9.5zm0 1.5a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5z"/>
      </svg>
    </a>
    {/* Twitter */}
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
      className="group h-20 w-20 rounded-full flex justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600 hover:scale-110 transition duration-300 shadow-lg"
      aria-label="Twitter"
    >
      <svg className="w-10 h-10 fill-white group-hover:fill-blue-100 transition" viewBox="0 0 24 24">
        <path d="M19.633 7.997c.013.176.013.353.013.53 0 5.386-4.099 11.601-11.61 11.601A11.548 11.548 0 012 18.29a8.18 8.18 0 006.042-1.704 4.1 4.1 0 01-3.828-2.848c.256.038.513.064.783.064.372 0 .744-.05 1.091-.146-3.172-.636-5.564-3.437-5.564-6.802v-.085c.941.522 2.021.837 3.166.875A4.093 4.093 0 012.801 4.4a11.654 11.654 0 008.447 4.287 4.623 4.623 0 01-.101-.939A4.098 4.098 0 0115.191 3a8.17 8.17 0 002.595-.988A4.117 4.117 0 0121.18 2.2c-.31.448-.698.845-1.146 1.093A8.235 8.235 0 0023 3.254a8.266 8.266 0 01-2.367 2.456z" />
      </svg>
    </a>
    {/* LinkedIn */}
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
      className="group h-20 w-20 rounded-full flex justify-center items-center bg-gradient-to-br from-blue-800 to-cyan-400 hover:scale-110 transition duration-300 shadow-lg"
      aria-label="LinkedIn"
    >
      <svg className="w-10 h-10 fill-white group-hover:fill-cyan-100 transition" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zM8.666 20h-3v-10h3v10zm-1.44-11.218c-.982 0-1.78-.796-1.78-1.782 0-.983.797-1.782 1.78-1.782.979 0 1.778.799 1.778 1.782 0 .986-.799 1.782-1.778 1.782zm13.107 11.219h-3v-5.326c0-1.27-.025-2.902-1.765-2.902-1.77 0-2.044 1.382-2.044 2.807v5.421h-3v-10h2.879v1.367h.041c.404-.767 1.392-1.576 2.863-1.576 3.064 0 3.631 2.017 3.631 4.641v5.568z"/>
      </svg>
    </a>
    {/* Facebook */}
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
      className="group h-20 w-20 rounded-full flex justify-center items-center bg-gradient-to-br from-blue-700 to-blue-900 hover:scale-110 transition duration-300 shadow-lg"
      aria-label="Facebook"
    >
      <svg className="w-10 h-10 fill-white group-hover:fill-blue-200 transition" viewBox="0 0 24 24">
        <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326V22.674C0 23.4.6 24 1.326 24h11.495v-9.294H9.692V11.27h3.129V8.69c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.462.099 2.797.143v3.24h-1.918c-1.504 0-1.797.716-1.797 1.763v2.311h3.587l-.467 3.436h-3.12V24h6.116c.725 0 1.325-.6 1.325-1.326V1.326C24 .601 23.4 0 22.675 0z" />
      </svg>
    </a>
    {/* GitHub */}
    <a href="https://github.com" target="_blank" rel="noopener noreferrer"
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