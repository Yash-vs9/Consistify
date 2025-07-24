'use client';
import React, { useEffect, useState } from 'react';
import {
  Home,
  LayoutDashboard,
  Users,
  PlusCircle,
  ListChecks,
  User,
  CalendarDays,
  MessageCircleQuestion
} from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState(null); // ✅ New state

  // ✅ Decode token safely
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Login');
      return;
    }

    const getUsernameFromToken = (token: string) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload.sub || payload.username || null;
      } catch {
        return null;
      }
    };

    const usernameJWT = getUsernameFromToken(token);
    setUsername(usernameJWT);
  }, []);

  const toggleMenu = (menu: any) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, href: '/dashboard' },
    { label: 'Friends', icon: <Users className="w-5 h-5" />, href: username ? `/users` : '#' },
    { label: 'Create', icon: <PlusCircle className="w-5 h-5" />, href: '/create' },
    { label: 'Tasks', icon: <ListChecks className="w-5 h-5" />, href: '/tasks' },
    { label: 'Schedule', icon: <CalendarDays className="w-5 h-5" />, href: '/calendar' },
    { label: 'Profile', icon: <User className="w-5 h-5" />, href: '/profile' },
    { label: 'Query', icon: <MessageCircleQuestion className="w-5 h-5" />, href: '/query' },

  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#11141c] border-r border-[#2d2f39] px-4 py-6 space-y-6 transition-all duration-300 ${
        collapsed ? 'w-[80px]' : 'w-[260px]'
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="text-cyan-400 hover:text-white transition self-end w-full flex justify-end mb-4"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? '✚' : '✂︎'}
      </button>

      {!collapsed && (
        <div className="text-2xl font-bold tracking-wide text-cyan-400 text-center">
          Consistify
        </div>
      )}

      <ul className="space-y-1 text-sm">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1d1f29] transition"
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="font-poppins">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;