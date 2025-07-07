import React, { useState } from 'react';
import { href } from 'react-router-dom';

const SidebarLayout = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
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

  const navItems = [
    { label: 'Home', icon: '🏠', href: '/home' },
    { label: 'Dashboard', icon: '📊', href: 'dashboard.html' },
    { label: 'Friends', icon: '🫂', href: `/${usernameJWT}/friends` },

    {
      label: 'Create',icon:'䷀', href: '/project'
     
    },
    {
      label: 'Tasks',icon:'✉️' ,href: '/tasks'

    },
    { label: 'Calendar', icon: '📅', href: 'calendar.html' },
    { label: 'Profile', icon: '👤', href: 'profile.html' },
  ];

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f1117] text-white font-[Poppins]">
      {/* Sidebar */}
      <aside className="h-screen sticky top-0 bg-[#11141c] border-r border-[#2d2f39] px-6 py-8 space-y-6">
        <div className="text-2xl font-bold tracking-wide text-cyan-400">Consistify</div>
        <ul className="space-y-1 text-sm">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg hover:bg-[#1d1f29] transition"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openMenu === item.label ? 'rotate-180' : ''
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openMenu === item.label && (
                    <ul className="ml-8 mt-1 space-y-1 transition-all text-gray-300">
                      {item.children.map((sub) => (
                        <li key={sub}>
                          <a href="#" className="block px-2 py-1 hover:text-white">
                            {sub}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1d1f29] transition"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
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
    </div>
  );
};

export default SidebarLayout;