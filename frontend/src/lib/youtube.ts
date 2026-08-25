/**
 * Helpers for YouTube IDs used by the homepage hero and Super Admin preview.
 */

const YT_ID = /^[a-zA-Z0-9_-]{11}$/;

/** Extract an 11-character YouTube video ID from a raw ID or common URL forms. */
export function extractYouTubeId(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (YT_ID.test(value)) return value;

  try {
    let candidate = value;
    if (candidate.startsWith('//')) candidate = `https:${candidate}`;
    if (!candidate.includes('://') && (candidate.includes('youtube.com') || candidate.includes('youtu.be'))) {
      candidate = `https://${candidate}`;
    }
    const u = new URL(candidate);
    const host = u.hostname.toLowerCase();

    if (host.includes('youtu.be')) {
      const id = u.pathname.replace(/^\//, '').split(/[/?&]/)[0];
      return YT_ID.test(id) ? id : null;
    }

    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      const v = u.searchParams.get('v');
      if (v && YT_ID.test(v)) return v;
      const parts = u.pathname.split('/').filter(Boolean);
      for (let i = 0; i < parts.length; i++) {
        if (['embed', 'shorts', 'live', 'v'].includes(parts[i]) && parts[i + 1] && YT_ID.test(parts[i + 1])) {
          return parts[i + 1];
        }
      }
    }
  } catch {
    /* ignore invalid URLs */
  }

  return null;
}

/** High-quality thumbnail with hqdefault fallback via onError at the call site. */
export function youtubeThumbnailUrl(videoId: string, quality: 'maxresdefault' | 'hqdefault' = 'hqdefault') {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}
