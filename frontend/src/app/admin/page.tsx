'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { homeRouteForRole, useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/admin/login');
      return;
    }
    router.push(homeRouteForRole(user.role));
  }, [loading, user, router]);

  return <Spinner label="Opening your workspace..." />;
}
