'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AddisPayLogo from '@/components/AddisPayLogo';
import { Alert, Button, Field, Input } from '@/components/ui';
import { auth, errorMessage } from '@/lib/api';

function ResetPasswordContent() {
  const params = useSearchParams();
  const [token, setToken] = useState(params.get('token') || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#F8FDFB] p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="space-y-3 text-center">
          <AddisPayLogo size="lg" />
          <h1 className="text-2xl font-black text-[#101828]">Choose a new password</h1>
        </div>
        {message && <Alert tone="success">{message}</Alert>}
        {error && <Alert tone="error">{error}</Alert>}
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');
            setMessage('');
            try {
              const result = await auth.resetPassword(token, password);
              setMessage(result.message);
            } catch (err) {
              setError(errorMessage(err));
            } finally {
              setLoading(false);
            }
          }}
        >
          <Field label="Reset token" required><Input value={token} onChange={(e) => setToken(e.target.value)} /></Field>
          <Field label="New password" required><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          <Button type="submit" className="w-full" loading={loading}>Reset password</Button>
        </form>
        <div className="text-center text-xs text-gray-500">
          <Link href="/admin/login" className="font-bold text-[#00A36D] hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[85vh] items-center justify-center"><span className="text-sm font-semibold text-gray-500">Loading reset form...</span></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
