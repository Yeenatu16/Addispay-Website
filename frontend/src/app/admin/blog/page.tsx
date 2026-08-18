'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ImagePlus, LogOut, Mail, Newspaper, Plus, Save, Search, Settings2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminGate } from '@/components/admin/AdminGate';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import {
  Alert,
  Badge,
  Button,
  EmptyState,
  Field,
  Input,
  Modal,
  Pagination,
  Select,
  Spinner,
  Textarea,
} from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { adminNews, errorMessage, mediaUrl, type ArticleDraft, type NewsArticle, type NewsletterSubscriber, type PublicationStatus } from '@/lib/api';
import { articleCategory, articleReadTime, articleStatusTone, formatDate } from '@/lib/admin/utils';

const DEFAULT_DRAFT: ArticleDraft = {
  title: '',
  shortDescription: '',
  fullContent: '',
  coverImageUrl: '',
  status: 'DRAFT',
  isFeatured: false,
  publishedAt: null,
};

export default function BlogWriterDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | PublicationStatus>('ALL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; userName: string; details: string; createdAt: string }>>([]);
  const [settings, setSettings] = useState({ homepageLimit: 4, emptyMessage: '' });
  const [draft, setDraft] = useState<ArticleDraft>(DEFAULT_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subscriberTotal, setSubscriberTotal] = useState(0);
  const [subscriberPage, setSubscriberPage] = useState(1);
  const pageSize = 10;
  const subscriberPageSize = 8;

  async function load() {
    setLoading(true);
    try {
      const [list, logs, cfg, subs] = await Promise.all([
        adminNews.list({
          page,
          limit: pageSize,
          search: search || undefined,
          status: status === 'ALL' ? undefined : status,
        }),
        adminNews.auditLogs({ page: 1, limit: 6 }),
        adminNews.getSettings(),
        adminNews.subscribers({ page: subscriberPage, limit: subscriberPageSize }),
      ]);
      setArticles(list.articles);
      setTotal(list.total);
      setAuditLogs(logs.logs);
      setSettings(cfg);
      setSubscribers(subs.subscribers);
      setSubscriberTotal(subs.total);
      setError('');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [page, search, status, subscriberPage]);

  const stats = useMemo(() => ({
    published: articles.filter((article) => article.status === 'PUBLISHED').length,
    drafts: articles.filter((article) => article.status === 'DRAFT').length,
    featured: articles.filter((article) => article.isFeatured).length,
  }), [articles]);

  function resetEditor() {
    setEditingId(null);
    setDraft(DEFAULT_DRAFT);
    setEditorOpen(false);
  }

  async function openEditor(article?: NewsArticle) {
    if (!article) {
      setEditingId(null);
      setDraft(DEFAULT_DRAFT);
      setEditorOpen(true);
      return;
    }
    try {
      const full = await adminNews.get(article.id);
      setEditingId(full.id);
      setDraft({
        title: full.title,
        shortDescription: full.shortDescription,
        fullContent: full.fullContent,
        coverImageUrl: full.coverImageUrl,
        status: full.status,
        isFeatured: full.isFeatured,
        publishedAt: full.publishedAt,
      });
      setEditorOpen(true);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function saveArticle() {
    setSaving(true);
    try {
      if (editingId) {
        await adminNews.update(editingId, draft);
      } else {
        await adminNews.create(draft);
      }
      resetEditor();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function removeArticle(id: string) {
    if (!window.confirm('Delete this article?')) return;
    try {
      await adminNews.remove(id);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function onCoverUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const result = await adminNews.uploadCover(file);
      setDraft((prev) => ({ ...prev, coverImageUrl: result.url }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      await adminNews.updateSettings(settings);
      setSettingsOpen(false);
      await load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGate roles={['Super_Admin', 'Marketer']}>
      {() => (
        <div className="min-h-screen bg-[#F8FDFB] text-[#101828]">
          <div className="border-b border-gray-100 bg-gradient-to-b from-[#E5F5EE]/80 via-[#F8FDFB] to-[#F8FDFB] py-12 lg:py-16">
            <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Badge tone="success">News workspace</Badge>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Manage published news, drafts, and homepage settings</h1>
                  <p className="max-w-2xl text-sm text-[#6A7282]">
                    Create rich-text articles, upload cover images, feature stories on the homepage, and review the news audit trail.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
                    <Settings2 className="h-4 w-4" /> Homepage settings
                  </Button>
                  <Button onClick={() => void openEditor()}>
                    <Plus className="h-4 w-4" /> New article
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      router.push('/admin/login');
                    }}
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <StatCard label="Visible in listing" value={stats.published} accent="text-[#00A36D]" />
                <StatCard label="Drafts in progress" value={stats.drafts} accent="text-amber-600" />
                <StatCard label="Featured stories" value={stats.featured} accent="text-sky-600" />
                <StatCard label="Newsletter subscribers" value={subscriberTotal} accent="text-[#00A36D]" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
            {error && <Alert tone="error">{error}</Alert>}

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <section className="space-y-5">
                <div className="flex flex-col gap-3 rounded-3xl border border-gray-100 bg-white p-5 shadow-xs md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={search}
                      onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                      }}
                      className="pl-10"
                      placeholder="Search by title or content..."
                    />
                  </div>
                  <Select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value as 'ALL' | PublicationStatus); }}>
                    <option value="ALL">All statuses</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </Select>
                </div>

                {loading ? (
                  <Spinner label="Loading articles..." />
                ) : articles.length === 0 ? (
                  <EmptyState title="No matching articles" description="Create a story or broaden your search filters." />
                ) : (
                  <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#F8FDFB] text-xs font-extrabold uppercase tracking-wide text-gray-500">
                          <tr>
                            <th className="px-5 py-4">Article</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Published</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {articles.map((article) => (
                            <tr key={article.id} className="align-top">
                              <td className="px-5 py-4">
                                <div className="space-y-1">
                                  <div className="font-bold text-[#101828]">{article.title}</div>
                                  <div className="line-clamp-2 text-xs text-[#6A7282]">{article.shortDescription}</div>
                                  <div className="text-[11px] text-gray-400">{article.slug} · {articleReadTime(article)}</div>
                                </div>
                              </td>
                              <td className="px-5 py-4"><Badge tone="info">{articleCategory(article)}</Badge></td>
                              <td className="px-5 py-4">
                                <div className="flex flex-col gap-2">
                                  <Badge tone={articleStatusTone(article.status)}>{article.status}</Badge>
                                  {article.isFeatured && <Badge tone="success">Featured</Badge>}
                                </div>
                              </td>
                              <td className="px-5 py-4 text-xs text-gray-500">{formatDate(article.publishedAt || article.updatedAt)}</td>
                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                  <Button variant="secondary" size="sm" onClick={() => void openEditor(article)}>Edit</Button>
                                  <Link href={`/blog/${article.slug}`} className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">View</Link>
                                  <Button variant="danger" size="sm" onClick={() => void removeArticle(article.id)}>
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="border-t border-gray-100 p-5">
                      <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
                    </div>
                  </div>
                )}
              </section>

              <aside className="space-y-5">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-[#00A36D]" />
                    <h2 className="text-lg font-black">Subscribed users</h2>
                  </div>
                  <p className="mb-4 text-xs text-[#6A7282]">
                    These readers get an email when you publish a new article.
                  </p>
                  {subscribers.length === 0 ? (
                    <p className="text-xs text-gray-500">No newsletter subscribers yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {subscribers.map((sub) => (
                        <div key={sub.id} className="rounded-2xl bg-[#F8FDFB] px-4 py-3">
                          <p className="break-all text-sm font-semibold text-[#101828]">{sub.email}</p>
                          <p className="mt-1 text-[11px] text-gray-400">
                            Joined {formatDate(sub.subscribedAt)}
                          </p>
                        </div>
                      ))}
                      <Pagination
                        page={subscriberPage}
                        total={subscriberTotal}
                        pageSize={subscriberPageSize}
                        onPageChange={setSubscriberPage}
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-[#00A36D]" />
                    <h2 className="text-lg font-black">News audit trail</h2>
                  </div>
                  <div className="space-y-4">
                    {auditLogs.length === 0 ? (
                      <p className="text-xs text-gray-500">No audit entries yet.</p>
                    ) : (
                      auditLogs.map((log) => (
                        <div key={log.id} className="rounded-2xl bg-[#F8FDFB] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <Badge tone="neutral">{log.action}</Badge>
                            <span className="text-[11px] text-gray-400">{formatDate(log.createdAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="mt-2 text-xs font-semibold text-[#101828]">{log.userName}</p>
                          <p className="mt-1 text-xs text-[#6A7282]">{log.details}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <Modal open={editorOpen} onClose={resetEditor} size="2xl" title={editingId ? 'Edit article' : 'Create article'} description="Draft now or publish immediately. Publishing sends an email to newsletter subscribers.">
            <div className="space-y-5">
              <Field label="Title" required>
                <Input value={draft.title} onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))} />
              </Field>
              <Field label="Summary" required hint="Used in cards, listings, and metadata.">
                <Textarea rows={3} value={draft.shortDescription} onChange={(e) => setDraft((prev) => ({ ...prev, shortDescription: e.target.value }))} />
              </Field>
              <Field label="Cover image" hint="Upload JPG, PNG, or WebP up to 5 MB.">
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-[#F8FDFB] px-4 py-3 text-sm font-medium text-gray-600 hover:border-[#00A36D]">
                    <ImagePlus className="h-4 w-4 text-[#00A36D]" />
                    <span>{uploading ? 'Uploading cover...' : 'Upload cover image'}</span>
                    <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => void onCoverUpload(e.target.files?.[0] || null)} />
                  </label>
                  <Input value={draft.coverImageUrl || ''} onChange={(e) => setDraft((prev) => ({ ...prev, coverImageUrl: e.target.value }))} placeholder="Or paste a cover image URL" />
                  {draft.coverImageUrl && <img src={mediaUrl(draft.coverImageUrl)} alt="" className="h-40 w-full rounded-2xl object-cover" />}
                </div>
              </Field>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Status">
                  <Select value={draft.status || 'DRAFT'} onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as PublicationStatus }))}>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </Select>
                </Field>
                <Field label="Publish date">
                  <Input
                    type="datetime-local"
                    value={draft.publishedAt ? new Date(draft.publishedAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setDraft((prev) => ({ ...prev, publishedAt: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                  />
                </Field>
                <label className="mt-6 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input type="checkbox" checked={!!draft.isFeatured} onChange={(e) => setDraft((prev) => ({ ...prev, isFeatured: e.target.checked }))} />
                  Feature on homepage
                </label>
              </div>
              <Field label="Article body" required hint="The toolbar inserts headings, lists, links, quotes, images, tables, and alignment.">
                <RichTextEditor value={draft.fullContent} onChange={(value) => setDraft((prev) => ({ ...prev, fullContent: value }))} />
              </Field>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={resetEditor}>Cancel</Button>
                <Button onClick={() => void saveArticle()} loading={saving}>
                  <Save className="h-4 w-4" /> {editingId ? 'Save changes' : 'Create article'}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Homepage news settings" description="Controls how many articles appear on the public homepage and what visitors see when none are published.">
            <div className="space-y-5">
              <Field label="Homepage story count">
                <Input type="number" min={1} max={20} value={settings.homepageLimit} onChange={(e) => setSettings((prev) => ({ ...prev, homepageLimit: Number(e.target.value) }))} />
              </Field>
              <Field label="Empty-state message">
                <Textarea rows={3} value={settings.emptyMessage} onChange={(e) => setSettings((prev) => ({ ...prev, emptyMessage: e.target.value }))} />
              </Field>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setSettingsOpen(false)}>Cancel</Button>
                <Button onClick={() => void saveSettings()} loading={saving}>Save settings</Button>
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
