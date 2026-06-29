'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Loader from './Loader';
import { toast } from 'react-hot-toast';

export default function AdminGuard({ children }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isAdmin) {
        toast.error('Access denied: Admin only');
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return children;
}