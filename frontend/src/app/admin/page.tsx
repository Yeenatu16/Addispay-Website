'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { currentUser } = useAdmin();

  useEffect(() => {
    if (!currentUser) {
      router.push('/admin/login');
      return;
    }

    if (currentUser.role === 'Super Admin') {
      router.push('/admin/super');
    } else if (currentUser.role === 'Blog Writer') {
      router.push('/admin/blog');
    } else if (currentUser.role === 'Career Writer') {
      router.push('/admin/careers');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-[#00A36D] animate-spin" />
      <p className="text-sm font-bold text-gray-700">Redirecting to your workspace...</p>
    </div>
  );
}
