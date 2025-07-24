'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/sign', label: 'Sign up' }
  ];

  return (
    <nav className="bg-gray-950/70 backdrop-blur-md text-white sticky top-0 z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-cyan-400 text-2xl font-bold tracking-wide hover:text-cyan-300 transition-all"
        >
          C<span className="text-white">onsistify</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group py-1 transition-all duration-300"
            >
              <span className="text-white group-hover:text-cyan-400 transition-all">
                {link.label}
              </span>
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-cyan-400 group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white focus:outline-none transition-transform hover:scale-110"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-950/90 backdrop-blur-md border-t border-gray-800 px-6 py-4 flex flex-col gap-4 animate-fadeIn">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-cyan-400 text-base transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;