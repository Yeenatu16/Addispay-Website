/**
 * Types mirroring the Go API payloads served from /api/v1.
 * Keep field names in sync with the backend JSON tags.
 */

export type Role = 'Super_Admin' | 'Marketer' | 'HR';

export const ROLE_LABELS: Record<Role, string> = {
  Super_Admin: 'Super Admin',
  Marketer: 'Marketing Manager',
  HR: 'Career Manager',
};

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminInvitation {
  id: string;
  email: string;
  role: Role;
  invitedById: string;
  expiresAt: string;
  acceptedAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
}

/** Public preview of an invitation, resolved from the emailed token. */
export interface InvitationPreview {
  email: string;
  role: Role;
  expiresAt: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export type PublicationStatus = 'DRAFT' | 'PUBLISHED';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullContent: string;
  coverImageUrl: string;
  status: PublicationStatus;
  isFeatured: boolean;
  authorId: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsListPage {
  articles: NewsArticle[];
  total: number;
}

export interface HomepageNews {
  featured: NewsArticle | null;
  latest: NewsArticle[];
  emptyMessage: string;
}

export interface NewsSettings {
  homepageLimit: number;
  emptyMessage: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isSubscribed: boolean;
  subscribedAt: string;
}

export interface SubscriberListPage {
  subscribers: NewsletterSubscriber[];
  total: number;
}

export interface ArticleDraft {
  title: string;
  shortDescription: string;
  fullContent: string;
  coverImageUrl?: string;
  isFeatured?: boolean;
  status?: PublicationStatus;
  /** ISO-8601 publish date (FR-ADM-002). */
  publishedAt?: string | null;
}

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'REMOTE';

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  REMOTE: 'Remote',
};

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  description: string;
  /** Newline-separated requirement lines. */
  requirements: string;
  isOpen: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  applications?: JobApplication[];
}

export interface JobDraft {
  title: string;
  department: string;
  location: string;
  jobType?: JobType;
  description: string;
  requirements: string;
  isOpen?: boolean;
}

export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'PENDING',
  'REVIEWED',
  'SHORTLISTED',
  'REJECTED',
];

export interface JobApplication {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  coverLetter: string;
  cvUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface ApplicationSubmission {
  jobId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  coverLetter: string;
  cvUrl: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  createdAt: string;
}

export interface AuditLogPage {
  logs: AuditLog[];
  total: number;
  resource: string;
}

export interface UploadResult {
  url: string;
  filename: string;
  path?: string;
  optimizedSize?: number;
  fileSize?: string;
}

export interface MessageResult {
  message: string;
}

export type DocumentCategory = string;

export interface OfficialDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  dateLabel: string;
  pages: number;
  sortOrder: number;
  isPublished: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentDraft {
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  dateLabel?: string;
  pages?: number;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface HomepageSettings {
  heroYoutubeId: string;
}

export interface BrochureImage {
  id: string;
  title: string;
  imageUrl: string;
  sortOrder: number;
  isPublished: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrochureDraft {
  title?: string;
  imageUrl: string;
  sortOrder?: number;
  isPublished?: boolean;
}
