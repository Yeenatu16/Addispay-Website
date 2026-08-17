'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddisPayLogo from '@/components/AddisPayLogo';
import { homeRouteForRole, useAuth } from '@/context/AuthContext';
import { Alert, Button, Field, Input, Select } from '@/components/ui';
import { auth, errorMessage, type Role } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'Super_Admin' as Role });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#F8FDFB] p-4">
      <div className="w-full max-w-lg space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="space-y-3 text-center">
          <AddisPayLogo size="lg" />
          <h1 className="text-2xl font-black text-[#101828]">Bootstrap the first administrator</h1>
          <p className="text-sm text-[#6A7282]">Use this only when the system has no admin accounts yet.</p>
        </div>
        {error && <Alert tone="error">{error}</Alert>}
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');
            try {
              await auth.register(form);
              const user = await login(form.email, form.password);
              router.push(homeRouteForRole(user.role));
            } catch (err) {
              setError(errorMessage(err));
            } finally {
              setLoading(false);
            }
          }}
        >
          <Field label="Full name" required><Input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} /></Field>
          <Field label="Email" required><Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></Field>
          <Field label="Password" required><Input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} /></Field>
          <Field label="Role" required>
            <Select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as Role }))}>
              <option value="Super_Admin">Super Admin</option>
              <option value="Marketer">Marketer</option>
              <option value="HR">HR</option>
            </Select>
          </Field>
          <Button type="submit" className="w-full" loading={loading}>Create administrator</Button>
        </form>
        <div className="text-center text-xs text-gray-500"><Link href="/admin/login" className="font-bold text-[#00A36D] hover:underline">Back to login</Link></div>
      </div>
    </div>
  );
}
