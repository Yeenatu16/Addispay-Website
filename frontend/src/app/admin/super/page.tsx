'use client';

import { useEffect, useState } from 'react';
import { LogOut, MailPlus, ShieldCheck, UserCog, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminGate } from '@/components/admin/AdminGate';
import { Alert, Badge, Button, EmptyState, Field, Input, Modal, Select, Spinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { adminCareers, adminNews, adminTeam, errorMessage, ROLE_LABELS, type Role, type User } from '@/lib/api';
import { formatDate, roleLabel } from '@/lib/admin/utils';

export default function SuperAdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [newsCount, setNewsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Marketer');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [team, pendingInvites, newsList, jobs] = await Promise.all([
        adminTeam.listUsers(),
        adminTeam.listInvitations(),
        adminNews.list({ page: 1, limit: 1 }),
        adminCareers.listJobs(),
      ]);
      setUsers(team);
      setInvites(pendingInvites);
      setNewsCount(newsList.total);
      setJobsCount(jobs.length);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function sendInvite() {
    setSaving(true);
    try {
      await adminTeam.invite(inviteEmail, inviteRole);
      setInviteOpen(false);
      setInviteEmail('');
      setInviteRole('Marketer');
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function toggleUser(user: User) {
    try {
      if (user.isActive) await adminTeam.revoke(user.id);
      else await adminTeam.restore(user.id);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function cancelInvite(id: string) {
    try {
      await adminTeam.cancelInvitation(id);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <AdminGate roles={['Super_Admin']}>
      {() => (
        <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
          <div className="border-b border-gray-100 bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-12 lg:py-16">
            <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Badge tone="warning">Super Admin control center</Badge>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Oversee team access, invitations, and content operations</h1>
                  <p className="max-w-2xl text-sm text-[#6A7282]">
                    This workspace uses the live admin APIs for invitations, account revocation, restoration, and portfolio-wide oversight.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={() => setInviteOpen(true)}>
                    <MailPlus className="h-4 w-4" /> Invite administrator
                  </Button>
                  <Button variant="ghost" onClick={() => { logout(); router.push('/admin/login'); }}>
                    <LogOut className="h-4 w-4" /> Log out
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <StatCard label="Administrators" value={users.length} accent="text-[#101828]" />
                <StatCard label="Pending invites" value={invites.length} accent="text-sky-600" />
                <StatCard label="News articles" value={newsCount} accent="text-[#00A36D]" />
                <StatCard label="Career postings" value={jobsCount} accent="text-[#F5A414]" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
            {error && <Alert tone="error">{error}</Alert>}
            {loading ? (
              <Spinner label="Loading super admin data..." />
            ) : (
              <>
                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
                  <div className="flex items-center gap-2 border-b border-gray-100 p-5">
                    <UserCog className="h-5 w-5 text-[#00A36D]" />
                    <div>
                      <h2 className="text-lg font-black">Administrator accounts</h2>
                      <p className="text-xs text-gray-500">Revoke or restore access without waiting for stored client sessions to expire.</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#F8FDFB] text-xs font-extrabold uppercase tracking-wide text-gray-500">
                        <tr>
                          <th className="px-5 py-4">Name</th>
                          <th className="px-5 py-4">Email</th>
                          <th className="px-5 py-4">Role</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Created</th>
                          <th className="px-5 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-5 py-4 font-bold">{user.fullName}</td>
                            <td className="px-5 py-4">{user.email}</td>
                            <td className="px-5 py-4"><Badge tone="info">{roleLabel(user.role)}</Badge></td>
                            <td className="px-5 py-4"><Badge tone={user.isActive ? 'success' : 'danger'}>{user.isActive ? 'ACTIVE' : 'REVOKED'}</Badge></td>
                            <td className="px-5 py-4 text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end">
                                <Button variant={user.isActive ? 'danger' : 'secondary'} size="sm" onClick={() => void toggleUser(user)}>
                                  {user.isActive ? 'Revoke' : 'Restore'}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
                  <div className="flex items-center gap-2 border-b border-gray-100 p-5">
                    <ShieldCheck className="h-5 w-5 text-[#F5A414]" />
                    <div>
                      <h2 className="text-lg font-black">Pending invitations</h2>
                      <p className="text-xs text-gray-500">Invites expire automatically; you can also cancel them manually.</p>
                    </div>
                  </div>
                  {invites.length === 0 ? (
                    <div className="p-6">
                      <EmptyState title="No pending invitations" description="Create a new invitation to onboard a marketer or HR manager." />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FDFB] text-xs font-extrabold uppercase tracking-wide text-gray-500">
                          <tr>
                            <th className="px-5 py-4">Email</th>
                            <th className="px-5 py-4">Role</th>
                            <th className="px-5 py-4">Created</th>
                            <th className="px-5 py-4">Expires</th>
                            <th className="px-5 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {invites.map((invite) => (
                            <tr key={invite.id}>
                              <td className="px-5 py-4 font-semibold">{invite.email}</td>
                              <td className="px-5 py-4"><Badge tone="info">{ROLE_LABELS[invite.role as Role]}</Badge></td>
                              <td className="px-5 py-4 text-xs text-gray-500">{formatDate(invite.createdAt)}</td>
                              <td className="px-5 py-4 text-xs text-gray-500">{formatDate(invite.expiresAt)}</td>
                              <td className="px-5 py-4">
                                <div className="flex justify-end">
                                  <Button variant="danger" size="sm" onClick={() => void cancelInvite(invite.id)}>
                                    <XCircle className="h-3.5 w-3.5" /> Cancel
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>

          <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite administrator" description="Only Marketer and HR roles are invitable; Super Admin remains bootstrap-only.">
            <div className="space-y-4">
              <Field label="Work email" required><Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} /></Field>
              <Field label="Role" required>
                <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as Role)}>
                  <option value="Marketer">Marketer</option>
                  <option value="HR">HR</option>
                </Select>
              </Field>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button>
                <Button onClick={() => void sendInvite()} loading={saving}>Send invite</Button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </AdminGate>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className={`mt-1 text-3xl font-black ${accent}`}>{value}</div>
    </div>
  );
}
