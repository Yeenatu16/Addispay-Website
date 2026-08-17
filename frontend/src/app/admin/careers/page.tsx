'use client';

import { useEffect, useMemo, useState } from 'react';
import { Briefcase, LogOut, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminGate } from '@/components/admin/AdminGate';
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  Field,
  Input,
  Modal,
  Select,
  Spinner,
  Textarea,
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import {
  adminCareers,
  APPLICATION_STATUSES,
  errorMessage,
  JOB_TYPE_LABELS,
  type ApplicationStatus,
  type JobDraft,
  type JobPosting,
} from '@/lib/api';
import { formatDate, openJobsCount, requirementsToLines } from '@/lib/admin/utils';

const EMPTY_JOB: JobDraft = {
  title: '',
  department: '',
  location: '',
  jobType: 'FULL_TIME',
  description: '',
  requirements: '',
};

export default function CareersAdminPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<JobDraft>(EMPTY_JOB);

  async function load(jobId?: string) {
    setLoading(true);
    try {
      const [allJobs, apps, logs] = await Promise.all([
        adminCareers.listJobs(),
        adminCareers.listApplications(jobId || undefined),
        adminCareers.auditLogs({ page: 1, limit: 6 }),
      ]);
      setJobs(allJobs);
      setApplications(apps);
      setAuditLogs(logs.logs);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(selectedJobId);
  }, [selectedJobId]);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) || null, [jobs, selectedJobId]);

  function openCreate() {
    setEditingId(null);
    setDraft(EMPTY_JOB);
    setJobModalOpen(true);
  }

  async function openEdit(job: JobPosting) {
    try {
      const full = await adminCareers.getJob(job.id);
      setEditingId(full.id);
      setDraft({
        title: full.title,
        department: full.department,
        location: full.location,
        jobType: full.jobType,
        description: full.description,
        requirements: full.requirements,
        isOpen: full.isOpen,
      });
      setJobModalOpen(true);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function saveJob() {
    setSaving(true);
    try {
      if (editingId) await adminCareers.updateJob(editingId, draft);
      else await adminCareers.createJob(draft);
      setJobModalOpen(false);
      setDraft(EMPTY_JOB);
      await load(selectedJobId);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteJob(id: string) {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await adminCareers.deleteJob(id);
      if (selectedJobId === id) setSelectedJobId('');
      await load(selectedJobId === id ? '' : selectedJobId);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function changeStatus(id: string, status: ApplicationStatus) {
    try {
      await adminCareers.updateApplicationStatus(id, status);
      await load(selectedJobId);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <AdminGate roles={['Super_Admin', 'HR']}>
      {() => (
        <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
          <div className="border-b border-gray-100 bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-12 lg:py-16">
            <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Badge tone="warning">Careers workspace</Badge>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Manage vacancies and applicant pipelines</h1>
                  <p className="max-w-2xl text-sm text-[#6A7282]">
                    Publish job openings, close filled roles, review submitted applications, and update each candidate’s screening status.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={openCreate}>
                    <Plus className="h-4 w-4" /> Post job
                  </Button>
                  <Button variant="ghost" onClick={() => { logout(); router.push('/admin/login'); }}>
                    <LogOut className="h-4 w-4" /> Log out
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Open roles" value={openJobsCount(jobs)} accent="text-[#F5A414]" />
                <StatCard label="Total roles" value={jobs.length} accent="text-[#101828]" />
                <StatCard label="Applications loaded" value={applications.length} accent="text-[#00A36D]" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
            {error && <Alert tone="error">{error}</Alert>}
            {loading ? (
              <Spinner label="Loading careers workspace..." />
            ) : (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                <div className="space-y-8">
                  <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 p-5">
                      <div>
                        <h2 className="text-lg font-black">Job postings</h2>
                        <p className="text-xs text-gray-500">Open roles are shown on the public careers page.</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FDFB] text-xs font-extrabold uppercase tracking-wide text-gray-500">
                          <tr>
                            <th className="px-5 py-4">Role</th>
                            <th className="px-5 py-4">Department</th>
                            <th className="px-5 py-4">Location</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {jobs.map((job) => (
                            <tr key={job.id}>
                              <td className="px-5 py-4">
                                <div className="font-bold">{job.title}</div>
                                <div className="text-xs text-gray-500">{JOB_TYPE_LABELS[job.jobType]}</div>
                              </td>
                              <td className="px-5 py-4">{job.department}</td>
                              <td className="px-5 py-4">{job.location}</td>
                              <td className="px-5 py-4">
                                <Badge tone={job.isOpen ? 'success' : 'neutral'}>{job.isOpen ? 'OPEN' : 'CLOSED'}</Badge>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                  <Button variant="secondary" size="sm" onClick={() => { setSelectedJobId(job.id); void openEdit(job); }}>Edit</Button>
                                  <Button variant="danger" size="sm" onClick={() => void deleteJob(job.id)}>
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
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
                    <div className="flex flex-col gap-3 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-lg font-black">Applications</h2>
                        <p className="text-xs text-gray-500">Filter by role to review one hiring pipeline at a time.</p>
                      </div>
                      <Select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
                        <option value="">All roles</option>
                        {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
                      </Select>
                    </div>
                    {applications.length === 0 ? (
                      <div className="p-6"><EmptyState title="No applications yet" description={selectedJob ? `Applicants for ${selectedJob.title} will appear here.` : 'Applications will appear here as candidates apply.'} /></div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-[#F8FDFB] text-xs font-extrabold uppercase tracking-wide text-gray-500">
                            <tr>
                              <th className="px-5 py-4">Candidate</th>
                              <th className="px-5 py-4">Applied</th>
                              <th className="px-5 py-4">Status</th>
                              <th className="px-5 py-4">CV</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {applications.map((app) => (
                              <tr key={app.id}>
                                <td className="px-5 py-4">
                                  <div className="font-bold">{app.fullName}</div>
                                  <div className="text-xs text-gray-500">{app.email} · {app.phoneNumber}</div>
                                  <div className="mt-1 text-xs text-gray-500 line-clamp-2">{app.coverLetter}</div>
                                </td>
                                <td className="px-5 py-4 text-xs text-gray-500">{formatDate(app.appliedAt)}</td>
                                <td className="px-5 py-4">
                                  <Select value={app.status} onChange={(e) => void changeStatus(app.id, e.target.value as ApplicationStatus)}>
                                    {APPLICATION_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                                  </Select>
                                </td>
                                <td className="px-5 py-4">
                                  <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#00A36D] hover:underline">Open CV</a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </div>

                <aside className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-[#F5A414]" />
                    <h2 className="text-lg font-black">Career audit trail</h2>
                  </div>
                  <div className="space-y-4">
                    {auditLogs.length === 0 ? (
                      <p className="text-xs text-gray-500">No audit entries yet.</p>
                    ) : auditLogs.map((log) => (
                      <div key={log.id} className="rounded-2xl bg-[#F8FDFB] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <Badge tone="neutral">{log.action}</Badge>
                          <span className="text-[11px] text-gray-400">{formatDate(log.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold">{log.userName}</p>
                        <p className="mt-1 text-xs text-[#6A7282]">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            )}
          </div>

          <Modal open={jobModalOpen} onClose={() => setJobModalOpen(false)} title={editingId ? 'Edit job posting' : 'Post job opening'} description="Public vacancies are pulled directly from this data on the careers page.">
            <div className="space-y-4">
              <Field label="Job title" required><Input value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} /></Field>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Department" required><Input value={draft.department} onChange={(e) => setDraft((prev) => ({ ...prev, department: e.target.value }))} /></Field>
                <Field label="Location" required><Input value={draft.location} onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))} /></Field>
                <Field label="Job type"><Select value={draft.jobType || 'FULL_TIME'} onChange={(e) => setDraft((prev) => ({ ...prev, jobType: e.target.value as any }))}><option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="REMOTE">Remote</option></Select></Field>
              </div>
              <Field label="Description" required><Textarea rows={4} value={draft.description} onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))} /></Field>
              <Field label="Requirements" required hint="One requirement per line.">
                <Textarea rows={6} value={draft.requirements} onChange={(e) => setDraft((prev) => ({ ...prev, requirements: e.target.value }))} />
              </Field>
              {editingId && (
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input type="checkbox" checked={draft.isOpen ?? true} onChange={(e) => setDraft((prev) => ({ ...prev, isOpen: e.target.checked }))} />
                  Role is open for applications
                </label>
              )}
              <div className="rounded-2xl bg-[#F8FDFB] p-4 text-xs text-gray-500">
                {requirementsToLines(draft.requirements).length} requirement line(s) will be rendered publicly.
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setJobModalOpen(false)}>Cancel</Button>
                <Button onClick={() => void saveJob()} loading={saving}><Save className="h-4 w-4" /> Save job</Button>
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
