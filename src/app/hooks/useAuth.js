'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      });
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  const isAuthenticated = status === 'authenticated';
  const isAdmin = user?.role === 'admin';
  const isPremium = user?.isPremium === true;

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isPremium,
    session,
    status,
  };
};