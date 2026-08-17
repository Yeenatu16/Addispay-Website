'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AddisPayLogo from '@/components/AddisPayLogo';
import { Alert, Badge, Button, Field, Input, Spinner } from '@/components/ui';
import { auth, errorMessage } from '@/lib/api';

function AcceptInvitationContent() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [preview, setPreview] = useState<{ email: string; role: string; expiresAt: string } | null>(null);
  const [form, setForm] = useState({ fullName: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    auth.getInvitation(token).then(setPreview).catch((err) => setError(errorMessage(err))).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Spinner label="Loading invitation..." />;

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#F8FDFB] p-4">
      <div className="w-full max-w-lg space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="space-y-3 text-center">
          <AddisPayLogo size="lg" />
          <h1 className="text-2xl font-black text-[#101828]">Accept your admin invitation</h1>
        </div>
        {message && <Alert tone="success">{message}</Alert>}
        {error && <Alert tone="error">{error}</Alert>}
        {preview && (
          <div className="rounded-2xl bg-[#F8FDFB] p-4 text-sm">
            <div className="font-semibold text-[#101828]">{preview.email}</div>
            <div className="mt-2 flex items-center gap-2"><Badge tone="info">{preview.role}</Badge><span className="text-xs text-gray-500">Expires {new Date(preview.expiresAt).toLocaleString()}</span></div>
          </div>
        )}
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            setError('');
            setMessage('');
            try {
              await auth.acceptInvitation({ token, ...form });
              setMessage('Invitation accepted. You can now sign in with your new password.');
            } catch (err) {
              setError(errorMessage(err));
            } finally {
              setSaving(false);
            }
          }}
        >
          <Field label="Full name" required><Input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} /></Field>
          <Field label="Choose password" required><Input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} /></Field>
          <Button type="submit" className="w-full" loading={saving}>Accept invitation</Button>
        </form>
        <div className="text-center text-xs text-gray-500"><Link href="/admin/login" className="font-bold text-[#00A36D] hover:underline">Back to login</Link></div>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={<Spinner label="Loading invitation..." />}>
      <AcceptInvitationContent />
    </Suspense>
  );
}
