'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';

type ShareArticleButtonProps = {
  title: string;
  summary: string;
  path: string;
};

function absoluteUrl(path: string) {
  if (typeof window === 'undefined') return path;
  return new URL(path, window.location.origin).toString();
}

function telegramShareUrl(url: string, title: string) {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
}

function whatsappShareUrl(url: string, title: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
}

function linkedinShareUrl(url: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

function facebookShareUrl(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

function xShareUrl(url: string, title: string) {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
}

export function ShareArticleButton({ title, summary, path }: ShareArticleButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(path);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShareUrl(absoluteUrl(path));
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      window.prompt('Copy this article link:', shareUrl);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: summary, url: shareUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    setOpen((prev) => !prev);
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-center gap-2">
        <span className="hidden text-xs font-medium text-[#6A7282] sm:inline">Share</span>
        <button
          type="button"
          onClick={() => void handleShare()}
          className="rounded-xl border border-[#E5F5EE] bg-white p-2 text-[#00A36D] transition-colors hover:bg-[#E5F5EE]"
          aria-label="Share article"
          aria-expanded={open}
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_12px_40px_rgba(16,24,40,0.12)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => void copyLink()}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#101828] hover:bg-[#F8FDFB]"
          >
            {copied ? <Check className="h-4 w-4 text-[#00A36D]" /> : <Copy className="h-4 w-4 text-[#00A36D]" />}
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <a
            role="menuitem"
            href={whatsappShareUrl(shareUrl, title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#101828] hover:bg-[#F8FDFB]"
          >
            WhatsApp
          </a>
          <a
            role="menuitem"
            href={telegramShareUrl(shareUrl, title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#101828] hover:bg-[#F8FDFB]"
          >
            Telegram
          </a>
          <a
            role="menuitem"
            href={linkedinShareUrl(shareUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#101828] hover:bg-[#F8FDFB]"
          >
            LinkedIn
          </a>
          <a
            role="menuitem"
            href={facebookShareUrl(shareUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#101828] hover:bg-[#F8FDFB]"
          >
            Facebook
          </a>
          <a
            role="menuitem"
            href={xShareUrl(shareUrl, title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#101828] hover:bg-[#F8FDFB]"
          >
            X
          </a>
        </div>
      )}
    </div>
  );
}
