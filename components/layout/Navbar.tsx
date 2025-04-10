'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <i className="snes-jp-logo mr-4"></i>
              <span className="text-xl text-black font-bold">CourseGPT</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/dashboard"
              className="text-black hover:opacity-70 pixel-transition"
            >
              Dashboard
            </Link>
            <Link
              href="/create-course"
              className="text-black hover:opacity-70 pixel-transition"
            >
              Create Course
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="border-4 border-black h-8 w-8 overflow-hidden">
                  {user.photoURL && (
                    <Image
                      className="h-full w-full object-cover"
                      src={user.photoURL}
                      alt={user.displayName || "User profile"}
                    />
                  )}
                </div>
                <span className="text-xs hidden lg:inline">
                  {user.displayName?.split(' ')[0] || 'Player'}
                </span>
                <button
                  onClick={() => signOut()}
                  className="nes-btn is-error"
                >
                  Exit
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="nes-btn is-primary"
              >
                Sign in
              </Link>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-2"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </div>
      
      {menuOpen && (
        <div className="md:hidden border-t-4 border-black">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className="block text-black px-3 py-2 text-sm hover:opacity-70 pixel-transition"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/create-course"
              className="block text-black px-3 py-2 text-sm hover:opacity-70 pixel-transition"
              onClick={() => setMenuOpen(false)}
            >
              Create Course
            </Link>
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm hover:opacity-70 pixel-transition"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="block px-3 py-2 text-sm hover:opacity-70 pixel-transition"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}