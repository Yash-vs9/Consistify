import React, { useState } from 'react';

const Sidebar = ({ usernameJWT }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false); // ✅ New state

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { label: 'Home', icon: '🏠', href: '/home' },
    { label: 'Dashboard', icon: '📊', href: '/dashboard' },
    { label: 'Friends', icon: '🫂', href: `/${usernameJWT}/friends` },
    { label: 'Create', icon: '䷀', href: '/project' },
    { label: 'Tasks', icon: '✉️', href: '/tasks' },
    { label: 'Calendar', icon: '📅', href: 'calendar' },
    { label: 'Profile', icon: '👤', href: 'profile' },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#11141c] border-r border-[#2d2f39] px-4 py-6 space-y-6 transition-all duration-300 ${
        collapsed ? 'w-[80px]' : 'w-[260px]'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-cyan-400 hover:text-white transition self-end w-full flex justify-end mb-4"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? '✚' : '✂︎'}
      </button>

      {/* Logo */}
      {!collapsed && (
        <div className="text-2xl font-bold tracking-wide text-cyan-400 text-center">
          Consistify
        </div>
      )}

      {/* Nav Items */}
      <ul className="space-y-1 text-sm">
        {navItems.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1d1f29] transition"
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;