// components/MainDashboard.jsx
import React from 'react';

const MainDashboard = () => {
  return (
    <main className="p-10 space-y-6 bg-[#0f1117]">
      <section className="bg-[#1b1d26] border border-[#2c2f3a] rounded-xl p-6 shadow-sm hover:shadow-md transition">
        <h2 className="text-2xl font-semibold mb-2">Welcome Back 👋</h2>
        <p className="text-gray-400">
          This is your dashboard. You can manage your folders, projects, and personal productivity here.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#1b1d26] border border-[#2c2f3a] rounded-xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-medium mb-1">Card {i + 1}</h3>
            <p className="text-gray-400 text-sm">Some quick information or summary goes here.</p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default MainDashboard;