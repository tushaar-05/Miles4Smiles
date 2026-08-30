'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Calendar, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Categories', href: '#categories' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'News', href: '#news' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1944bc]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-14 lg:h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Miles for Smiles Logo"
            width={140}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav Links with "/" separators */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {NAV_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4 lg:gap-6">
              <Link
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-150 tracking-wide"
              >
                {link.label}
              </Link>
              {i < NAV_LINKS.length - 1 && (
                <span className="text-white/30 text-sm select-none">/</span>
              )}
            </span>
          ))}
        </div>

        {/* REGISTER button — lime green */}
        <div className="hidden md:block">
          <Link
            href="#register"
            id="navbar-register-cta"
            className="inline-flex items-center gap-2.5 bg-[#c8f135] hover:bg-[#d4f851] active:bg-[#b8e025] text-neutral-900 font-black text-sm px-5 py-2.5 rounded-lg transition-all duration-150 tracking-widest uppercase"
          >
            <Calendar size={15} strokeWidth={2.5} />
            Register
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          id="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1538a8] px-6 py-4 flex flex-col gap-4 border-t border-white/10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 font-medium py-1"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#register"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center gap-2 bg-[#c8f135] text-neutral-900 font-black text-sm px-5 py-3 rounded-lg uppercase tracking-widest mt-1"
          >
            <Calendar size={15} />
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
