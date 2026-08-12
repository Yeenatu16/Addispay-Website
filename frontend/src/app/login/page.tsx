'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    window.location.href = 'https://uat.dashboard.addispay.et/';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <Loader2 className="w-10 h-10 text-[#00A36D] animate-spin" />
      <h2 className="text-xl font-bold text-[#101828]">Redirecting to Addispay Merchant Portal...</h2>
      <p className="text-xs text-gray-500 font-medium">
        If you are not redirected automatically,{' '}
        <a
          href="https://uat.dashboard.addispay.et/"
          className="text-[#00A36D] font-bold underline inline-flex items-center gap-1"
        >
          <span>click here to log in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </p>
    </div>
  );
}
