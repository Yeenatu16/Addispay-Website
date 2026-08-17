'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { homeRouteForRole, useAuth } from '@/context/AuthContext';
import type { Role } from '@/lib/api';
import { Alert, Spinner } from '@/components/ui';

export function AdminGate({
  roles,
  children,
}: {
  roles: Role[];
  children: (ctx: { userRole: Role }) => React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/admin/login');
      return;
    }
    if (!roles.includes(user.role)) {
      router.push(homeRouteForRole(user.role));
    }
  }, [loading, user, router, roles]);

  if (loading || !user) {
    return <Spinner label="Verifying access..." />;
  }

  if (!roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Alert tone="info">Redirecting you to the workspace assigned to your role.</Alert>
      </div>
    );
  }

  return <>{children({ userRole: user.role })}</>;
}
