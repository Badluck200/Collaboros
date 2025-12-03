'use client';

import Navbar from '@/components/Navigation/Navbar';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserProfile } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  displayName?: string;
  email: string;
  userType: 'creative' | 'client';
  bio?: string;
  location?: string;
  avatar?: string;
  settings: {
    isPublic: boolean;
    allowMessaging: boolean;
  };
}

export default function UserProfile() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = params.id as string;
        const userData = await getUserProfile(userId);
        setUser(userData);
      } catch (err) {
        setError('User not found or profile is private.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadUser();
    }
  }, [params.id]);

  const handleMessageUser = () => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    // Navigate to messages page - the existing search can find and message the user
    router.push(`/messages?user=${user?.username}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-red-600">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg p-8 mb-12">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-amber-700">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">
                  {user.displayName || `${user.firstName} ${user.lastName}`}
                </h1>
                <p className="text-xl opacity-90 mb-2">
                  {user.userType === 'creative' ? '🎨 Creative Professional' : '💼 Client'}
                </p>
                <p className="font-mono text-amber-200 mb-1">{user.username}</p>
                {user.location && (
                  <p className="text-sm opacity-75">📍 {user.location}</p>
                )}
              </div>
            </div>
            {!isOwnProfile && user.settings.allowMessaging && isAuthenticated && (
              <button
                onClick={handleMessageUser}
                className="bg-white text-amber-700 px-8 py-3 rounded-lg hover:bg-amber-50 transition font-semibold shadow-lg"
              >
                💬 Message
              </button>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {user.bio && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Portfolio Section (placeholder for now) */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
          <p className="text-gray-600">Portfolio items will appear here once implemented.</p>
        </div>
      </div>
    </div>
  );
}
