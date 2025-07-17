import React, { useState } from 'react';
import {
  Home,
  LayoutDashboard,
  Users,
  PlusCircle,
  ListChecks,
  User,
} from 'lucide-react';
const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false); // ✅ New state
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Login');
  }

  const getUsernameFromToken = (token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.sub || payload.username || null;
    } catch {
      return null;
    }
  };

  const usernameJWT = getUsernameFromToken(token);
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/dashboard' },
    { label: 'Friends', icon: <Users className="w-5 h-5" />, href: `/${usernameJWT}/friends` },
    { label: 'Create', icon: <PlusCircle className="w-5 h-5" />, href: '/project' },
    { label: 'Tasks', icon: <ListChecks className="w-5 h-5" />, href: '/tasks' },
    { label: 'Profile', icon: <User className="w-5 h-5" />, href: '/profile' },
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
        {/* Nav Items */}
<ul className="space-y-1 text-sm">
  {navItems.map((item) => (
    <li key={item.label}>
      <a
        href={item.href}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1d1f29] transition"
      >
        <span className="text-lg">{item.icon}</span>
        {!collapsed && <span className="font-poppins">{item.label}</span>}
      </a>
    </li>
  ))}
</ul>
      </ul>
    </aside>
  );
};

export default Sidebar;