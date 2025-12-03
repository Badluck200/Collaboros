'use client';

import Navbar from '@/components/Navigation/Navbar';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getConversations, getConversation, sendMessage, searchUserByUsername } from '@/services/api';

interface Message {
  _id: string;
  senderId: { _id: string; firstName: string; lastName: string; username: string; avatar?: string };
  recipientId: { _id: string; firstName: string; lastName: string; username: string; avatar?: string };
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  _id: string;
  senderId: { _id: string; firstName: string; lastName: string; username: string; avatar?: string };
  recipientId: { _id: string; firstName: string; lastName: string; username: string; avatar?: string };
  content: string;
  createdAt: string;
}

export default function Messages() {
  const { user, token, isAuthenticated } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations(token!);
      setConversations(data);
      if (data.length > 0 && !selectedUserId) {
        const firstConvo = data[0];
        const otherUserId = firstConvo.senderId._id === user?._id 
          ? firstConvo.recipientId._id 
          : firstConvo.senderId._id;
        setSelectedUserId(otherUserId);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [token, selectedUserId, user]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadConversations();
    }
  }, [isAuthenticated, token, loadConversations]);

  const loadMessagesCb = useCallback(async (userId: string) => {
    try {
      const data = await getConversation(token!, userId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [token]);

  useEffect(() => {
    if (selectedUserId && token) {
      loadMessagesCb(selectedUserId);
    }
  }, [selectedUserId, token, loadMessagesCb]);

  // Remove duplicate definition; use the useCallback variant above
  // Duplicate definition removed (use the useCallback version above)

  const loadMessages = async (userId: string) => {
    try {
      const data = await getConversation(token!, userId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !token) return;

    setSending(true);
    try {
      await sendMessage(token, {
        recipientId: selectedUserId,
        content: newMessage.trim(),
      });
      setNewMessage('');
      await loadMessages(selectedUserId);
      await loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;

    setSearching(true);
    setSearchError('');
    try {
      const foundUser = await searchUserByUsername(searchUsername.trim());
      if (foundUser._id === user?._id) {
        setSearchError('You cannot message yourself');
      } else {
        setSelectedUserId(foundUser._id);
        setSearchUsername('');
        await loadMessages(foundUser._id);
      }
    } catch (error) {
      setSearchError('User not found. Check the username and try again.');
    } finally {
      setSearching(false);
    }
  };

  const getOtherUser = (convo: Conversation) => {
    return convo.senderId._id === user?._id ? convo.recipientId : convo.senderId;
  };

  const getSelectedUserName = () => {
    const convo = conversations.find(c => 
      c.senderId._id === selectedUserId || c.recipientId._id === selectedUserId
    );
    if (convo) {
      const otherUser = getOtherUser(convo);
      return `${otherUser.firstName} ${otherUser.lastName}`;
    }
    return 'User';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Messages</h1>
            <p className="text-xl text-gray-600">Please sign in to view your messages.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Messages</h1>
          
          {/* Search for user */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Start a new conversation</h3>
            <form onSubmit={handleSearchUser} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter username (e.g., johndoe#1234)"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
              <button
                type="submit"
                disabled={searching || !searchUsername.trim()}
                className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition font-semibold disabled:opacity-50"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </form>
            {searchError && (
              <p className="text-red-600 text-sm mt-2">{searchError}</p>
            )}
            {user?.username && (
              <p className="text-gray-600 text-sm mt-2">
                Your username: <span className="font-semibold text-amber-700">{user.username}</span>
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No conversations yet. Start messaging someone!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-96 md:h-[600px]">
            {/* Chat List */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-y-auto">
              <h2 className="font-bold text-lg mb-4 text-gray-900">Conversations</h2>
              <div className="space-y-3">
                {conversations.map((convo) => {
                  const otherUser = getOtherUser(convo);
                  const isSelected = selectedUserId === otherUser._id;
                  return (
                    <div
                      key={convo._id}
                      onClick={() => setSelectedUserId(otherUser._id)}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        isSelected
                          ? 'bg-amber-100 border-2 border-amber-700'
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900">
                        {otherUser.firstName} {otherUser.lastName}
                      </h3>
                      <p className="text-xs text-amber-700 font-mono">{otherUser.username}</p>
                      <p className="text-sm text-gray-500 mt-1 truncate">{convo.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(convo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-bold text-lg text-gray-900">{getSelectedUserName()}</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.senderId._id === user?._id;
                  return (
                    <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          isOwn ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-amber-100' : 'text-gray-600'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition font-semibold disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
