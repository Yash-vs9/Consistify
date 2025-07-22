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
    });

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
      <footer className="w-full h-[50vh] flex justify-center items-center bg-[#020a13] relative z-10">
        <div className="flex space-x-12">
          {[1, 2, 3, 4, 5].map((num) => (
            <div
              key={num}
              className={`h-48 w-48 rounded-full flex justify-center items-center transition-all duration-300 hover:scale-110 hover:bg-gradient-to-br shadow-md ${
                num === 1
                  ? 'from-yellow-400 to-pink-500'
                  : num === 2
                  ? 'from-blue-400 to-blue-200'
                  : num === 3
                  ? 'from-orange-400 to-yellow-400'
                  : num === 4
                  ? 'from-blue-600 to-blue-900'
                  : 'from-gray-700 to-gray-900'
              } bg-blue-600`}
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