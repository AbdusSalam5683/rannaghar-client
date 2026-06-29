'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        return response.data.data.user;
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.data.success) {
        const { user, refreshToken } = response.data.data;
        setUser(user);
        setIsAuthenticated(true);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        toast.success('Login successful!');
        return { success: true, user };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('refreshToken');
      toast.success('Logout successful!');
      return { success: true };
    } catch (error) {
      toast.error('Logout failed');
      return { success: false };
    }
  };

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      setUser({
        ...session.user,
        isPremium: session.user.isPremium || false,
        role: session.user.role || 'user',
        id: session.user.id || session.user._id,
      });
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      // Try to get user from API with JWT
      getCurrentUser();
    }
  }, [session, status]);

  const isAdmin = user?.role === 'admin';
  const isPremium = user?.isPremium === true;

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isPremium,
    login,
    logout,
    getCurrentUser,
    session,
    status,
  };
};