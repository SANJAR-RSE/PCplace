import { InputHTMLAttributes, LabelHTMLAttributes, ButtonHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

/* ── Card ─── Glassmorphism gaming card ─────────────────────── */
export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden ${className}`}>
      {/* Top neon accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-40" />
      {children}
    </div>
  );
}

/* ── Label ────────────────────────────────────────────────────── */
export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={`mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--muted)] ${props.className ?? ''}`}
    />
  );
}

/* ── Field ────────────────────────────────────────────────────── */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

/* ── Input ────────────────────────────────────────────────────── */
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--muted)]/50 hover:border-[var(--primary)]/40 focus:border-[var(--primary)] focus:bg-[var(--surface)] focus:ring-3 focus:ring-[var(--primary)]/20 ${props.className ?? ''}`}
    />
  );
}

/* ── Textarea ─────────────────────────────────────────────────── */
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--muted)]/50 hover:border-[var(--primary)]/40 focus:border-[var(--primary)] focus:bg-[var(--surface)] focus:ring-3 focus:ring-[var(--primary)]/20 ${props.className ?? ''}`}
    />
  );
}

/* ── Select ───────────────────────────────────────────────────── */
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-all duration-200 hover:border-[var(--primary)]/40 focus:border-[var(--primary)] focus:ring-3 focus:ring-[var(--primary)]/20 ${props.className ?? ''}`}
    />
  );
}

/* ── Button ───────────────────────────────────────────────────── */
export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const styles: Record<string, string> = {
    primary:
      'bg-[var(--primary)] text-white shadow-[0_0_20px_var(--primary-glow)] hover:bg-[var(--primary-dark)] hover:shadow-[0_0_30px_var(--primary-glow)] disabled:opacity-40 disabled:shadow-none',
    secondary:
      'border border-[var(--border)] bg-[var(--surface2)] text-[var(--foreground)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface)] hover:text-[var(--primary)] disabled:opacity-40',
    danger:
      'bg-[var(--danger)] text-white shadow-[0_0_20px_rgba(255,77,109,0.4)] hover:shadow-[0_0_30px_rgba(255,77,109,0.6)] disabled:opacity-40',
    ghost:
      'text-[var(--foreground)]/70 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] disabled:opacity-40',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[.97] disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
}

/* ── Badge ────────────────────────────────────────────────────── */
export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' }) {
  const styles: Record<string, string> = {
    default: 'bg-[var(--border)]/60 text-[var(--muted)]',
    success: 'bg-[var(--accent)]/15 text-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]',
    warning: 'bg-amber-500/15 text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]',
    danger:  'bg-[var(--danger)]/15 text-[var(--danger)] shadow-[0_0_8px_rgba(255,77,109,0.3)]',
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${styles[tone]}`}>
      {children}
    </span>
  );
}

/* ── Spinner ──────────────────────────────────────────────────── */
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] shadow-[0_0_8px_var(--primary-glow)] ${className}`}
      role="status"
      aria-label="Yuklanmoqda"
    />
  );
}

/* ── ErrorText ────────────────────────────────────────────────── */
export function ErrorText({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mb-4 rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-2.5 text-sm text-[var(--danger)]">
      {children}
    </p>
  );
}

/* ── EmptyState ───────────────────────────────────────────────── */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--primary)]/20 bg-[var(--surface)]/50 p-12 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 text-[var(--primary)]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
      </div>
      <p className="font-semibold text-[var(--foreground)]/70">{title}</p>
      {hint && <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>}
    </div>
  );
}

/* ── PageHeader ───────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-6">
      <div>
        <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[var(--primary)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_6px_var(--primary-glow)]" />
          PCPLACE PLATFORM
        </p>
        <h1 className="bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)]/70 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
