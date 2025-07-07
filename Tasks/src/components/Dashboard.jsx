import React, { useState } from 'react';

const SidebarLayout = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const getUsernameFromToken = (token) => {
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(payloadBase64);
      const payload = JSON.parse(decoded);
      return payload.sub || payload.username || null;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  };

  const token = localStorage.getItem('authToken');
  const usernameJWT = getUsernameFromToken(token);

  const navItems = [
    { label: 'Home', icon: '🏠', href: '/home' },
    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { label: 'Friends', icon: '🫂', href: `/${usernameJWT}/friends` },
    { label: 'Create', icon: '🚀', href: '/project' },
    { label: 'Tasks', icon: '✅', href: '/tasks' },
    { label: 'Calendar', icon: '📅', href: '/calendar' },
    { label: 'Profile', icon: '👤', href: '/profile' },
  ];

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0d0f1a] text-white font-sans">
      {/* Sidebar */}
      <aside className="h-screen sticky top-0 bg-[#11141c] px-6 py-8 shadow-xl border-r border-[#2d2f39] backdrop-blur-lg">
        <div className="text-3xl font-extrabold tracking-wide text-cyan-400 mb-6 animate-fadeIn">
          Consistify
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#1a1d27] hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:scale-[1.03] transition-all duration-300 shadow-inner hover:shadow-md"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <main className="p-10 bg-gradient-to-br from-[#0f1117] to-[#1a1c26] space-y-8 overflow-y-auto">
        {/* Header */}
        <section className="bg-[#1b1f2b] border border-[#2d2f3a] rounded-2xl p-8 shadow-xl backdrop-blur-xl bg-opacity-80 hover:shadow-cyan-500/40 transition duration-300">
          <h2 className="text-4xl font-semibold text-cyan-400 mb-3 animate-fadeInUp">
            Welcome Back 👋
          </h2>
          <p className="text-gray-300">
            Explore your dashboard. Track projects, manage tasks, and grow your productivity!
          </p>
        </section>

        {/* Cards Grid */}
        <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[#1b1d26] border border-[#2c2f3a] rounded-xl p-6 shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 backdrop-blur-lg bg-opacity-90 hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-white mb-2">🔥 Module {i + 1}</h3>
              <p className="text-gray-400 text-sm">An overview or quick stat goes here.</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default SidebarLayout;