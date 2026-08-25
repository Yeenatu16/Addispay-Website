'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  LogOut,
  MailPlus,
  PlayCircle,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  UserCog,
  Video,
  XCircle,
} from 'lucide-react';
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
  adminDocuments,
  adminHomepage,
  adminNews,
  adminTeam,
  errorMessage,
  mediaUrl,
  ROLE_LABELS,
  type DocumentDraft,
  type OfficialDocument,
  type Role,
  type User,
} from '@/lib/api';
import { extractYouTubeId, youtubeThumbnailUrl } from '@/lib/youtube';
import { formatDate, roleLabel } from '@/lib/admin/utils';

const EMPTY_DOC_DRAFT: DocumentDraft = {
  title: '',
  category: '',
  description: '',
  fileUrl: '',
  fileSize: '',
  dateLabel: '',
  pages: 0,
  sortOrder: 0,
  isPublished: true,
};

export default function SuperAdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [newsCount, setNewsCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [docs, setDocs] = useState<OfficialDocument[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [heroVideoInput, setHeroVideoInput] = useState('');
  const [savedHeroId, setSavedHeroId] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Marketer');
  const [docOpen, setDocOpen] = useState(false);
  const [docDraft, setDocDraft] = useState<DocumentDraft>(EMPTY_DOC_DRAFT);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [heroPreviewReady, setHeroPreviewReady] = useState(false);
  const [heroThumbSrc, setHeroThumbSrc] = useState('');

  const previewVideoId = extractYouTubeId(heroVideoInput) || savedHeroId || null;

  useEffect(() => {
    if (!previewVideoId) {
      setHeroThumbSrc('');
      setHeroPreviewReady(false);
      return;
    }
    setHeroPreviewReady(false);
    setHeroThumbSrc(youtubeThumbnailUrl(previewVideoId, 'maxresdefault'));
  }, [previewVideoId]);

  async function load() {
    setLoading(true);
    try {
      const [team, pendingInvites, newsList, jobs, documentList, categoryList, homepage] = await Promise.all([
        adminTeam.listUsers(),
        adminTeam.listInvitations(),
        adminNews.list({ page: 1, limit: 1 }),
        adminCareers.listJobs(),
        adminDocuments.list(),
        adminDocuments.categories(),
        adminHomepage.getSettings(),
      ]);
      setUsers(team);
      setInvites(pendingInvites);
      setNewsCount(newsList.total);
      setJobsCount(jobs.length);
      setDocs(documentList);
      setCategories(categoryList);
      setSavedHeroId(homepage.heroYoutubeId);
      setHeroVideoInput(homepage.heroYoutubeId);
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

  function openCreateDoc() {
    setEditingDocId(null);
    setDocDraft(EMPTY_DOC_DRAFT);
    setDocOpen(true);
  }

  function openEditDoc(doc: OfficialDocument) {
    setEditingDocId(doc.id);
    setDocDraft({
      title: doc.title,
      category: doc.category,
      description: doc.description,
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
      dateLabel: doc.dateLabel,
      pages: doc.pages,
      sortOrder: doc.sortOrder,
      isPublished: doc.isPublished,
    });
    setDocOpen(true);
  }

  async function onPdfUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const result = await adminDocuments.upload(file);
      setDocDraft((prev) => ({
        ...prev,
        fileUrl: result.url,
        fileSize: result.fileSize || prev.fileSize || 'PDF',
      }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function saveDocument() {
    setSaving(true);
    try {
      if (editingDocId) {
        await adminDocuments.update(editingDocId, docDraft);
      } else {
        await adminDocuments.create(docDraft);
      }
      setDocOpen(false);
      setDocDraft(EMPTY_DOC_DRAFT);
      setEditingDocId(null);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteDocument(id: string) {
    if (!window.confirm('Remove this document from the public library?')) return;
    try {
      await adminDocuments.remove(id);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function saveHeroVideo() {
    setSavingHero(true);
    try {
      const result = await adminHomepage.updateSettings(heroVideoInput.trim());
      setSavedHeroId(result.heroYoutubeId);
      setHeroVideoInput(result.heroYoutubeId);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSavingHero(false);
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
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Oversee team access, documents, and homepage media
                  </h1>
                  <p className="max-w-2xl text-sm text-[#6A7282]">
                    Manage invitations, official PDF documents, and the homepage hero YouTube video from one place.
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

              <div className="grid gap-4 sm:grid-cols-5">
                <StatCard label="Administrators" value={users.length} accent="text-[#101828]" />
                <StatCard label="Pending invites" value={invites.length} accent="text-sky-600" />
                <StatCard label="News articles" value={newsCount} accent="text-[#00A36D]" />
                <StatCard label="Career postings" value={jobsCount} accent="text-[#F5A414]" />
                <StatCard label="Documents" value={docs.length} accent="text-[#00A36D]" />
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
                    <Video className="h-5 w-5 text-[#00A36D]" />
                    <div>
                      <h2 className="text-lg font-black">Homepage hero video</h2>
                      <p className="text-xs text-gray-500">
                        Paste a YouTube URL or 11-character video ID. Changes appear on the public homepage immediately.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <Field label="YouTube video URL or ID" required>
                      <Input
                        value={heroVideoInput}
                        onChange={(e) => setHeroVideoInput(e.target.value)}
                        placeholder="https://youtu.be/oHFAOehZBRc or oHFAOehZBRc"
                      />
                    </Field>

                    {previewVideoId ? (
                      <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-[#101828]">
                        {!heroPreviewReady && heroThumbSrc && (
                          <img
                            src={heroThumbSrc}
                            alt="YouTube video thumbnail"
                            className="absolute inset-0 z-[1] h-full w-full object-cover"
                            onError={() =>
                              setHeroThumbSrc(youtubeThumbnailUrl(previewVideoId, 'hqdefault'))
                            }
                          />
                        )}
                        <iframe
                          key={previewVideoId}
                          src={`https://www.youtube-nocookie.com/embed/${previewVideoId}?rel=0&modestbranding=1`}
                          title="Hero video preview"
                          className={`relative z-[2] h-full w-full transition-opacity duration-300 ${
                            heroPreviewReady ? 'opacity-100' : 'opacity-0'
                          }`}
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onLoad={() => setHeroPreviewReady(true)}
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video max-w-2xl items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-[#F8FDFB] text-xs font-semibold text-gray-500">
                        Enter a valid YouTube URL or ID to preview
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <Button onClick={() => void saveHeroVideo()} loading={savingHero}>
                        <PlayCircle className="h-4 w-4" /> Save hero video
                      </Button>
                      {savedHeroId && (
                        <a
                          href={`https://www.youtube.com/watch?v=${savedHeroId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#00A36D] hover:underline"
                        >
                          Open on YouTube ({savedHeroId})
                        </a>
                      )}
                    </div>
                  </div>
                </section>

                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
                  <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#00A36D]" />
                      <div>
                        <h2 className="text-lg font-black">Official documents</h2>
                        <p className="text-xs text-gray-500">
                          Add or remove PDFs shown on the public /doc library. Only published documents are visible to visitors.
                        </p>
                      </div>
                    </div>
                    <Button onClick={openCreateDoc}>
                      <Plus className="h-4 w-4" /> Add document
                    </Button>
                  </div>
                  {docs.length === 0 ? (
                    <div className="p-6">
                      <EmptyState
                        title="No documents yet"
                        description="Upload a PDF and publish it to populate the public document library."
                      />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FDFB] text-xs font-extrabold tracking-wide text-gray-500 uppercase">
                          <tr>
                            <th className="px-5 py-4">Title</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Size</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {docs.map((doc) => (
                            <tr key={doc.id}>
                              <td className="px-5 py-4">
                                <div className="font-bold">{doc.title}</div>
                                <div className="mt-0.5 text-xs text-gray-500">{doc.dateLabel}</div>
                              </td>
                              <td className="px-5 py-4">
                                <Badge tone="info">{doc.category}</Badge>
                              </td>
                              <td className="px-5 py-4 text-xs text-gray-500">{doc.fileSize}</td>
                              <td className="px-5 py-4">
                                <Badge tone={doc.isPublished ? 'success' : 'danger'}>
                                  {doc.isPublished ? 'PUBLISHED' : 'HIDDEN'}
                                </Badge>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                  <Button variant="secondary" size="sm" onClick={() => openEditDoc(doc)}>
                                    Edit
                                  </Button>
                                  <Button variant="danger" size="sm" onClick={() => void deleteDocument(doc.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
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

                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
                  <div className="flex items-center gap-2 border-b border-gray-100 p-5">
                    <UserCog className="h-5 w-5 text-[#00A36D]" />
                    <div>
                      <h2 className="text-lg font-black">Administrator accounts</h2>
                      <p className="text-xs text-gray-500">
                        Revoke or restore access without waiting for stored client sessions to expire.
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#F8FDFB] text-xs font-extrabold tracking-wide text-gray-500 uppercase">
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
                            <td className="px-5 py-4">
                              <Badge tone="info">{roleLabel(user.role)}</Badge>
                            </td>
                            <td className="px-5 py-4">
                              <Badge tone={user.isActive ? 'success' : 'danger'}>
                                {user.isActive ? 'ACTIVE' : 'REVOKED'}
                              </Badge>
                            </td>
                            <td className="px-5 py-4 text-xs text-gray-500">{formatDate(user.createdAt)}</td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end">
                                <Button
                                  variant={user.isActive ? 'danger' : 'secondary'}
                                  size="sm"
                                  onClick={() => void toggleUser(user)}
                                >
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
                      <p className="text-xs text-gray-500">
                        Invites expire automatically; you can also cancel them manually.
                      </p>
                    </div>
                  </div>
                  {invites.length === 0 ? (
                    <div className="p-6">
                      <EmptyState
                        title="No pending invitations"
                        description="Create a new invitation to onboard a marketer or HR manager."
                      />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FDFB] text-xs font-extrabold tracking-wide text-gray-500 uppercase">
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
                              <td className="px-5 py-4">
                                <Badge tone="info">{ROLE_LABELS[invite.role as Role]}</Badge>
                              </td>
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

          <Modal
            open={inviteOpen}
            onClose={() => setInviteOpen(false)}
            title="Invite administrator"
            description="Only Marketer and HR roles are invitable; Super Admin remains bootstrap-only."
          >
            <div className="space-y-4">
              <Field label="Work email" required>
                <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              </Field>
              <Field label="Role" required>
                <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as Role)}>
                  <option value="Marketer">Marketer</option>
                  <option value="HR">HR</option>
                </Select>
              </Field>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => void sendInvite()} loading={saving}>
                  Send invite
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            open={docOpen}
            onClose={() => setDocOpen(false)}
            title={editingDocId ? 'Edit document' : 'Add document'}
            description="Upload a PDF and set the metadata shown on the public documents page."
          >
            <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              <Field label="Title" required>
                <Input
                  value={docDraft.title}
                  onChange={(e) => setDocDraft((d) => ({ ...d, title: e.target.value }))}
                />
              </Field>
              <Field label="Category" required>
                <Input
                  list="document-category-suggestions"
                  value={docDraft.category}
                  onChange={(e) => setDocDraft((d) => ({ ...d, category: e.target.value }))}
                  placeholder="Type a category (new or existing)"
                />
                <datalist id="document-category-suggestions">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                <p className="mt-1 text-[11px] text-gray-500">
                  Enter any category name. New names create a new filter group on /doc; existing names group under that category.
                </p>
              </Field>
              <Field label="Description" required>
                <Textarea
                  rows={3}
                  value={docDraft.description}
                  onChange={(e) => setDocDraft((d) => ({ ...d, description: e.target.value }))}
                />
              </Field>
              <Field label="Date label">
                <Input
                  value={docDraft.dateLabel || ''}
                  onChange={(e) => setDocDraft((d) => ({ ...d, dateLabel: e.target.value }))}
                  placeholder="e.g. 2025 Annual"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Pages">
                  <Input
                    type="number"
                    min={0}
                    value={docDraft.pages ?? 0}
                    onChange={(e) => setDocDraft((d) => ({ ...d, pages: Number(e.target.value) || 0 }))}
                  />
                </Field>
                <Field label="Sort order">
                  <Input
                    type="number"
                    value={docDraft.sortOrder ?? 0}
                    onChange={(e) => setDocDraft((d) => ({ ...d, sortOrder: Number(e.target.value) || 0 }))}
                  />
                </Field>
              </div>
              <Field label="PDF file" required>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-[#F8FDFB] px-4 py-6 text-sm font-semibold text-gray-700 hover:border-[#00A36D]">
                  <Upload className="h-4 w-4 text-[#00A36D]" />
                  {uploading ? 'Uploading…' : docDraft.fileUrl ? 'Replace PDF' : 'Upload PDF (max 25 MB)'}
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => void onPdfUpload(e.target.files?.[0] || null)}
                  />
                </label>
                {docDraft.fileUrl && (
                  <a
                    href={mediaUrl(docDraft.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs font-semibold text-[#00A36D] hover:underline"
                  >
                    Current file ({docDraft.fileSize || 'PDF'})
                  </a>
                )}
              </Field>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={docDraft.isPublished !== false}
                  onChange={(e) => setDocDraft((d) => ({ ...d, isPublished: e.target.checked }))}
                />
                Published on public /doc page
              </label>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setDocOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => void saveDocument()}
                  loading={saving}
                  disabled={!docDraft.fileUrl || !docDraft.title || !docDraft.description || !docDraft.category.trim()}
                >
                  {editingDocId ? 'Save changes' : 'Publish document'}
                </Button>
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
