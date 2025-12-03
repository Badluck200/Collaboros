'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, getCurrentUser } from '@/services/api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  userType: 'creative' | 'client';
  bio?: string;
  location?: string;
  avatar?: string;
  settings: {
    maturityFilter: boolean;
    allowMessaging: boolean;
    isPublic: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'creative' | 'client';
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally fetch current user here
      fetchCurrentUser(storedToken);
    }
    setIsLoading(false);
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const userData = await getCurrentUser(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    setToken(response.token);
    localStorage.setItem('auth_token', response.token);
    await fetchCurrentUser(response.token);
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'creative' | 'client';
  }) => {
    const response = await registerUser(data);
    setToken(response.token);
    localStorage.setItem('auth_token', response.token);
    await fetchCurrentUser(response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
