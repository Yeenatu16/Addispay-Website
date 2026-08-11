'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import AddisPayLogo from '@/components/AddisPayLogo';
import { useAdmin, AdminRole } from '@/context/AdminContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAs } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleQuickDemoLogin = (demoEmail: string, role: AdminRole) => {
    loginAs(demoEmail, role);
    router.push('/admin');
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your authorized email address.');
      return;
    }

    const success = loginAs(email);
    if (success) {
      router.push('/admin');
    } else {
      setErrorMsg('Unauthorized email or account revoked. Please contact Super Admin for access permission.');
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

        {/* Quick Demo Role Selector */}
        <div className="bg-[#F8FDFB] p-4 rounded-2xl border border-[#E5F5EE] space-y-3">
          <div className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#F5A414]" />
            <span>Select Demo Role to Test Access:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('admin@addispay.et', 'Super Admin')}
              className="p-3 rounded-xl bg-white hover:bg-[#00A36D] text-left border border-gray-200 hover:border-[#00A36D] transition-all group shadow-2xs"
            >
              <div className="text-xs font-bold text-[#101828] group-hover:text-white">Super Admin</div>
              <div className="text-[10px] text-gray-500 group-hover:text-emerald-100">Full Control</div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('blog@addispay.et', 'Blog Writer')}
              className="p-3 rounded-xl bg-white hover:bg-[#00A36D] text-left border border-gray-200 hover:border-[#00A36D] transition-all group shadow-2xs"
            >
              <div className="text-xs font-bold text-[#101828] group-hover:text-white">Blog Writer</div>
              <div className="text-[10px] text-gray-500 group-hover:text-emerald-100">Articles Only</div>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('careers@addispay.et', 'Career Writer')}
              className="p-3 rounded-xl bg-white hover:bg-[#F5A414] text-left border border-gray-200 hover:border-[#F5A414] transition-all group shadow-2xs"
            >
              <div className="text-xs font-bold text-[#101828] group-hover:text-white">Career Writer</div>
              <div className="text-[10px] text-gray-500 group-hover:text-amber-100">Jobs Only</div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Custom Email Login Form */}
        <form onSubmit={handleFormLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
              Authorized Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@addispay.et"
                className="w-full bg-[#F8FDFB] border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-[#00A36D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F8FDFB] border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-[#00A36D]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#00A36D] hover:bg-[#008959] text-white font-bold text-sm shadow-md shadow-[#00A36D]/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <span>Log In to Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-gray-400 font-medium">
          Strictly for authorized Addispay staff & administrators.
        </div>

      </div>
    </div>
  );
}
