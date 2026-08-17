'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Inbox, Loader2, X } from 'lucide-react';

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/* ------------------------------------------------------------------ button */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-[#00A36D] hover:bg-[#008959] text-white shadow-md shadow-[#00A36D]/20',
  secondary: 'bg-white hover:bg-gray-50 text-[#101828] border border-gray-200',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-xs rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-sm rounded-xl gap-2',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center font-bold transition-all',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A36D]',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------- form fields */

const CONTROL_CLASS =
  'w-full bg-[#F8FDFB] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 ' +
  'font-medium transition-colors placeholder:text-gray-400 ' +
  'focus:outline-none focus:border-[#00A36D] focus:ring-2 focus:ring-[#00A36D]/15 ' +
  'disabled:bg-gray-50 disabled:text-gray-400 aria-invalid:border-rose-400';

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, required, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-gray-500">{hint}</p>}
      {error && (
        <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} {...rest} className={cx(CONTROL_CLASS, className)} />;
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} {...rest} className={cx(CONTROL_CLASS, 'leading-relaxed', className)} />;
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...rest }, ref) {
  return <select ref={ref} {...rest} className={cx(CONTROL_CLASS, 'pr-10', className)} />;
});

/* -------------------------------------------------------------------- badge */

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  success: 'bg-[#E5F5EE] text-[#00734C]',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  info: 'bg-sky-50 text-sky-700',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ alerts */

export function Alert({
  tone,
  children,
}: {
  tone: 'error' | 'success' | 'info';
  children: React.ReactNode;
}) {
  const styles = {
    error: 'bg-rose-50 border-rose-200 text-rose-700',
    success: 'bg-[#E5F5EE] border-[#00A36D]/30 text-[#00734C]',
    info: 'bg-sky-50 border-sky-200 text-sky-800',
  }[tone];

  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('flex items-start gap-2 rounded-xl border p-3.5 text-xs font-semibold', styles)}
    >
      <Icon className="w-4 h-4 shrink-0 mt-px" aria-hidden />
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------- loading */

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <Loader2 className="w-7 h-7 text-[#00A36D] animate-spin" aria-hidden />
      <p className="text-xs font-bold text-gray-500">{label}</p>
    </div>
  );
}

/**
 * Shown whenever a collection resolves empty, so visitors and admins always get
 * an explanatory message instead of a blank region (FR-DYN-004).
 */
export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 rounded-3xl border border-dashed border-gray-200 bg-white/60 px-6 py-14">
      <div className="w-12 h-12 rounded-2xl bg-[#E5F5EE] text-[#00A36D] flex items-center justify-center">
        <Icon className="w-6 h-6" aria-hidden />
      </div>
      <h3 className="text-base font-bold text-[#101828]">{title}</h3>
      {description && <p className="max-w-md text-xs text-[#6A7282] leading-relaxed">{description}</p>}
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------- modal */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl';
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const width = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', '2xl': 'max-w-6xl' }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          'relative w-full space-y-6 rounded-3xl bg-white p-6 shadow-2xl sm:p-8',
          'my-auto max-h-[92vh] overflow-y-auto',
          width,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-5 top-5 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="space-y-1 pr-10">
          <h2 className="text-xl font-black text-[#101828]">{title}</h2>
          {description && <p className="text-xs text-[#6A7282]">{description}</p>}
        </div>

        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- pagination */

export function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="Pagination">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </Button>
      <span className="text-xs font-bold text-gray-600">
        Page {page} of {pageCount}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
      >
        Next
      </Button>
    </nav>
  );
}
