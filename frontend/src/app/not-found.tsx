import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-950/80 border border-blue-800/80 flex items-center justify-center text-3xl font-extrabold text-blue-400 mx-auto shadow-2xl">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-white">Page Not Found</h1>
        <p className="text-slate-300 text-sm">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
        >
          <Home className="w-4 h-4" />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
