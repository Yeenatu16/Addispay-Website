/**
 * Every Addispay API endpoint, grouped by the area of the product it serves.
 * Components should call these functions rather than `fetch` directly.
 */

import { apiRequest, apiUpload } from './client';
import type {
  AdminInvitation,
  ApplicationStatus,
  ApplicationSubmission,
  ArticleDraft,
  AuditLogPage,
  HomepageNews,
  InvitationPreview,
  JobApplication,
  JobDraft,
  JobPosting,
  LoginResult,
  MessageResult,
  NewsArticle,
  NewsListPage,
  NewsSettings,
  PublicationStatus,
  Role,
  UploadResult,
  User,
} from './types';

export * from './types';
export { ApiError, API_BASE_URL, API_ORIGIN, errorMessage, getStoredToken, mediaUrl, setStoredToken } from './client';

/* ------------------------------------------------------------------ health */

export const health = {
  check: () => apiRequest<{ status: string; engine: string }>('/health', { cache: 'no-store' }),
};

/* -------------------------------------------------------------------- auth */

export const auth = {
  login: (email: string, password: string) =>
    apiRequest<LoginResult>('/auth/login', { method: 'POST', body: { email, password } }),

  /** Bootstrap: creates the very first Super Admin when no users exist yet. */
  register: (input: { fullName: string; email: string; password: string; role: Role }) =>
    apiRequest<User>('/auth/register', { method: 'POST', body: input }),

  forgotPassword: (email: string) =>
    apiRequest<MessageResult>('/auth/forgot-password', { method: 'POST', body: { email } }),

  resetPassword: (token: string, newPassword: string) =>
    apiRequest<MessageResult>('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword },
    }),

  /** Resolves an emailed invitation token so the signup form can be prefilled. */
  getInvitation: (token: string) =>
    apiRequest<InvitationPreview>('/auth/invitations', { query: { token }, cache: 'no-store' }),

  acceptInvitation: (input: { token: string; fullName: string; password: string }) =>
    apiRequest<User>('/auth/accept-invitation', { method: 'POST', body: input }),

  me: () => apiRequest<User>('/admin/me', { auth: true, cache: 'no-store' }),
};

/* ---------------------------------------------------------- public content */

export const news = {
  homepage: (revalidate = 60) =>
    apiRequest<HomepageNews>('/news/homepage', { revalidate }),

  list: (params: { page?: number; limit?: number; search?: string } = {}) =>
    apiRequest<NewsListPage>('/news', {
      query: { page: params.page, limit: params.limit, search: params.search },
      cache: 'no-store',
    }),

  bySlug: (slug: string, revalidate = 60) =>
    apiRequest<NewsArticle>(`/news/${encodeURIComponent(slug)}`, { revalidate }),
};

export const careers = {
  openJobs: (revalidate = 60) => apiRequest<JobPosting[]>('/careers', { revalidate }),

  apply: (input: ApplicationSubmission) =>
    apiRequest<JobApplication>('/careers/apply', { method: 'POST', body: input }),

  /** Stores an applicant's résumé and returns an absolute URL for `cvUrl`. */
  uploadCv: (file: File) => apiUpload<UploadResult>('/careers/upload-cv', file),
};

export const content = {
  subscribe: (email: string) =>
    apiRequest<MessageResult>('/content/subscribe', { method: 'POST', body: { email } }),

  contact: (input: { fullName: string; email: string; reason: string; message: string }) =>
    apiRequest<MessageResult>('/content/contact', { method: 'POST', body: input }),
};

/* ------------------------------------------- admin: news (Super Admin, Marketer) */

export const adminNews = {
  list: (params: { page?: number; limit?: number; search?: string; status?: PublicationStatus } = {}) =>
    apiRequest<NewsListPage>('/admin/news/articles', {
      auth: true,
      cache: 'no-store',
      query: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
      },
    }),

  get: (id: string) =>
    apiRequest<NewsArticle>(`/admin/news/articles/${id}`, { auth: true, cache: 'no-store' }),

  create: (draft: ArticleDraft) =>
    apiRequest<NewsArticle>('/admin/news/articles', { method: 'POST', body: draft, auth: true }),

  update: (id: string, draft: Partial<ArticleDraft>) =>
    apiRequest<NewsArticle>(`/admin/news/articles/${id}`, {
      method: 'PUT',
      body: draft,
      auth: true,
    }),

  remove: (id: string) =>
    apiRequest<MessageResult>(`/admin/news/articles/${id}`, { method: 'DELETE', auth: true }),

  uploadCover: (file: File) =>
    apiUpload<UploadResult>('/admin/news/upload', file, { auth: true }),

  getSettings: () =>
    apiRequest<NewsSettings>('/admin/news/settings', { auth: true, cache: 'no-store' }),

  updateSettings: (input: { homepageLimit?: number; emptyMessage?: string }) =>
    apiRequest<NewsSettings>('/admin/news/settings', { method: 'PUT', body: input, auth: true }),

  auditLogs: (params: { page?: number; limit?: number } = {}) =>
    apiRequest<AuditLogPage>('/admin/news/audit-logs', {
      auth: true,
      cache: 'no-store',
      query: { page: params.page, limit: params.limit },
    }),
};

/* ------------------------------------------ admin: careers (Super Admin, HR) */

export const adminCareers = {
  listJobs: () => apiRequest<JobPosting[]>('/admin/careers/jobs', { auth: true, cache: 'no-store' }),

  getJob: (id: string) =>
    apiRequest<JobPosting>(`/admin/careers/jobs/${id}`, { auth: true, cache: 'no-store' }),

  createJob: (draft: JobDraft) =>
    apiRequest<JobPosting>('/admin/careers/jobs', { method: 'POST', body: draft, auth: true }),

  updateJob: (id: string, draft: Partial<JobDraft>) =>
    apiRequest<JobPosting>(`/admin/careers/jobs/${id}`, { method: 'PUT', body: draft, auth: true }),

  deleteJob: (id: string) =>
    apiRequest<MessageResult>(`/admin/careers/jobs/${id}`, { method: 'DELETE', auth: true }),

  listApplications: (jobId?: string) =>
    apiRequest<JobApplication[]>('/admin/careers/applications', {
      auth: true,
      cache: 'no-store',
      query: { jobId },
    }),

  updateApplicationStatus: (id: string, status: ApplicationStatus) =>
    apiRequest<JobApplication>(`/admin/careers/applications/${id}/status`, {
      method: 'PUT',
      body: { status },
      auth: true,
    }),

  auditLogs: (params: { page?: number; limit?: number } = {}) =>
    apiRequest<AuditLogPage>('/admin/careers/audit-logs', {
      auth: true,
      cache: 'no-store',
      query: { page: params.page, limit: params.limit },
    }),
};

/* --------------------------------------- admin: team (Super Admin only) */

export const adminTeam = {
  listUsers: () => apiRequest<User[]>('/admin/users', { auth: true, cache: 'no-store' }),

  revoke: (id: string) =>
    apiRequest<MessageResult>(`/admin/users/${id}/revoke`, { method: 'POST', auth: true }),

  restore: (id: string) =>
    apiRequest<MessageResult>(`/admin/users/${id}/restore`, { method: 'POST', auth: true }),

  invite: (email: string, role: Role) =>
    apiRequest<AdminInvitation>('/admin/invitations', {
      method: 'POST',
      body: { email, role },
      auth: true,
    }),

  listInvitations: () =>
    apiRequest<AdminInvitation[]>('/admin/invitations', { auth: true, cache: 'no-store' }),

  cancelInvitation: (id: string) =>
    apiRequest<MessageResult>(`/admin/invitations/${id}`, { method: 'DELETE', auth: true }),
};
