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
    { href: '/dashboard',label:'Dashboard'},
    { href: '/sign',label:'Sign up'}

  ];

  return (
    <nav className="bg-gray-950/80 backdrop-blur-md text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-cyan-400 text-2xl font-bold tracking-wide hover:text-cyan-300 transition-all">
          Task<span className="text-white">Tracker</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group transition-colors duration-300"
            >
              <span className="hover:text-cyan-400">{link.label}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div


          className="md:hidden bg-gray-900 px-6 py-4 flex flex-col gap-4"
        >
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-cyan-400 text-base transition-all"
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