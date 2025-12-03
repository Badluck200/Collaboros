'use client';

import Navbar from '@/components/Navigation/Navbar';
import { useState } from 'react';
import { searchUserByUsername } from '@/services/api';
import Link from 'next/link';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  displayName?: string;
  userType: 'creative' | 'client';
  bio?: string;
  location?: string;
  avatar?: string;
}

export default function BrowseUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError('');
    setFoundUser(null);

    try {
      const user = await searchUserByUsername(searchQuery.trim());
      setFoundUser(user);
    } catch (err) {
      setError('User not found. Check the username and try again.');
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Users</h1>
        <p className="text-gray-600 mb-8">Search for users by their username to view their profile</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter username (e.g., johndoe#1234)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700 text-lg"
            />
            <button
              type="submit"
              disabled={searching || !searchQuery.trim()}
              className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </form>

        {/* User Result */}
        {foundUser && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-8 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-amber-700">
                  {foundUser.avatar ? (
                    <img src={foundUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-amber-700">
                      {foundUser.firstName[0]}{foundUser.lastName[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {foundUser.displayName || `${foundUser.firstName} ${foundUser.lastName}`}
                  </h2>
                  <p className="text-amber-700 font-mono mb-1">{foundUser.username}</p>
                  <p className="text-gray-600">
                    {foundUser.userType === 'creative' ? '🎨 Creative Professional' : '💼 Client'}
                  </p>
                  {foundUser.location && (
                    <p className="text-gray-600 text-sm mt-1">📍 {foundUser.location}</p>
                  )}
                </div>
              </div>
            </div>

            {foundUser.bio && (
              <div className="mb-6 bg-white/50 p-4 rounded-lg">
                <p className="text-gray-700">{foundUser.bio}</p>
              </div>
            )}

            <Link href={`/users/${foundUser._id}`}>
              <button className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition font-semibold">
                View Full Profile
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
