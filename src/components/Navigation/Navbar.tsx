'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/Auth/AuthModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Image */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <div className="relative w-24 h-16" style={{background: 'url(/images/logo.png) center/contain no-repeat', filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))'}}></div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/portfolio" className="text-gray-700 hover:text-amber-700 transition">
              Browse Creatives
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-amber-700 transition">
              Job Requests
            </Link>
            <Link href="/messages" className="text-gray-700 hover:text-amber-700 transition">
              Messages
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-amber-700 transition">
                  {user?.firstName || 'Profile'}
                </Link>
                <button
                  onClick={logout}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/portfolio" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Browse Creatives
            </Link>
            <Link href="/jobs" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Job Requests
            </Link>
            <Link href="/messages" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Messages
            </Link>
            <Link href="/profile" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
              Profile
            </Link>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </nav>
  );
}
