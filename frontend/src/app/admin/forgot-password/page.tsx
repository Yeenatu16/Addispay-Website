'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddisPayLogo from '@/components/AddisPayLogo';
import { Alert, Button, Field, Input } from '@/components/ui';
import { auth, errorMessage } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#F8FDFB] p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="space-y-3 text-center">
          <AddisPayLogo size="lg" />
          <h1 className="text-2xl font-black text-[#101828]">Reset your administrator password</h1>
          <p className="text-sm text-[#6A7282]">Enter your work email and we’ll send a reset link if the account exists.</p>
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
              const result = await auth.forgotPassword(email);
              setMessage(result.message);
            } catch (err) {
              setError(errorMessage(err));
            } finally {
              setLoading(false);
            }
          }}
        >
          <Field label="Work email" required>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Button type="submit" className="w-full" loading={loading}>Send reset link</Button>
        </form>
        <div className="text-center text-xs text-gray-500">
          <Link href="/admin/login" className="font-bold text-[#00A36D] hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
