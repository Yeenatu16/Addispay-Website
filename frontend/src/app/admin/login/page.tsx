'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import AddisPayLogo from '@/components/AddisPayLogo';
import { homeRouteForRole, useAuth } from '@/context/AuthContext';
import { Alert, Input } from '@/components/ui';
import { errorMessage } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(homeRouteForRole(user.role));
    } catch (error) {
      setErrorMsg(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8FDFB] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-radial from-[#00A36D]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl shadow-[#00A36D]/5 space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <AddisPayLogo size="lg" animated={true} />
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F5EE] border border-[#00A36D]/30 text-[#00A36D] text-[10px] font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Internal Workspace Login</span>
          </div>

          <h1 className="text-2xl font-black text-[#101828] pt-1">
            Admin Access Portal
          </h1>

          <p className="text-xs text-[#6A7282] max-w-xs mx-auto font-normal">
            Log in with your authorized role to manage Blog Articles, Job Postings, or Team Permissions.
          </p>
        </div>

        {errorMsg && (
          <Alert tone="error">{errorMsg}</Alert>
        )}

        <form onSubmit={handleFormLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
              Authorized Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@addispay.et"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-sm shadow-md shadow-[#00A36D]/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <span>{loading ? 'Signing in...' : 'Log In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
          <Link href="/admin/forgot-password" className="text-[#00A36D] hover:underline">
            Forgot password?
          </Link>
          <Link href="/admin/register" className="text-[#00A36D] hover:underline">
            First-time setup
          </Link>
        </div>

      </div>
    </div>
  );
}
