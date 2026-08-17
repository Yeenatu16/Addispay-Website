import type {
  JobPosting,
  NewsArticle,
  PublicationStatus,
  Role,
  User,
} from '@/lib/api';

export function roleLabel(role: Role): string {
  switch (role) {
    case 'Super_Admin':
      return 'Super Admin';
    case 'Marketer':
      return 'Marketing Manager';
    case 'HR':
      return 'Career Manager';
  }
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function formatDate(value?: string | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', opts || {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function articleReadTime(article: Pick<NewsArticle, 'fullContent'>): string {
  const words = article.fullContent.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function articleCategory(article: Pick<NewsArticle, 'title' | 'shortDescription' | 'fullContent'>): string {
  const text = `${article.title} ${article.shortDescription} ${article.fullContent}`.toLowerCase();
  if (text.includes('security') || text.includes('fraud') || text.includes('compliance')) return 'Security';
  if (text.includes('api') || text.includes('sdk') || text.includes('developer')) return 'Developer';
  if (text.includes('launch') || text.includes('product') || text.includes('feature')) return 'Product Updates';
  if (text.includes('funding') || text.includes('company') || text.includes('board')) return 'Company News';
  return 'Business';
}

export function requirementsToLines(input: string): string[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
}

export function requirementsFromLines(lines: string[]): string {
  return lines.map((line) => line.trim()).filter(Boolean).join('\n');
}

export function articleStatusTone(status: PublicationStatus) {
  return status === 'PUBLISHED' ? 'success' : 'warning';
}

export function adminCanManageNews(user: User | null) {
  return !!user && (user.role === 'Super_Admin' || user.role === 'Marketer');
}

export function adminCanManageCareers(user: User | null) {
  return !!user && (user.role === 'Super_Admin' || user.role === 'HR');
}

export function openJobsCount(jobs: JobPosting[]) {
  return jobs.filter((job) => job.isOpen).length;
}
