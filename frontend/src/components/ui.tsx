import { InputHTMLAttributes, LabelHTMLAttributes, ButtonHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-[1.25rem] border border-border/90 bg-surface p-5 shadow-[0_12px_30px_-20px_rgba(29,42,75,.32)] ${className}`}>{children}</div>;
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={`mb-1 block text-sm font-medium text-foreground/80 ${props.className ?? ''}`} />;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-border bg-slate-50/70 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/65 hover:border-primary/25 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${props.className ?? ''}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-border bg-slate-50/70 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/65 hover:border-primary/25 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${props.className ?? ''}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-border bg-slate-50/70 px-3.5 py-2.5 text-sm outline-none transition hover:border-primary/25 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${props.className ?? ''}`}
    />
  );
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const styles: Record<string, string> = {
    primary: 'bg-primary text-white shadow-[0_8px_18px_-8px_rgba(91,75,255,.8)] hover:bg-primary-dark hover:shadow-[0_10px_22px_-8px_rgba(91,75,255,.85)] disabled:opacity-50',
    secondary: 'border border-border bg-white text-foreground hover:border-primary/25 hover:bg-primary/5 disabled:opacity-50',
    danger: 'bg-red-600 text-white shadow-[0_8px_18px_-8px_rgba(220,38,38,.7)] hover:bg-red-700 disabled:opacity-50',
    ghost: 'text-foreground/80 hover:bg-primary/7 hover:text-primary disabled:opacity-50',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-[.98] disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
}

export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' }) {
  const styles: Record<string, string> = {
    default: 'bg-border/60 text-foreground/70',
    success: 'bg-emerald-500/15 text-emerald-600',
    warning: 'bg-amber-500/15 text-amber-600',
    danger: 'bg-red-500/15 text-red-600',
  };
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${styles[tone]}`}>{children}</span>;
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary ${className}`}
      role="status"
      aria-label="Yuklanmoqda"
    />
  );
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{children}</p>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-primary/25 bg-surface/65 p-10 text-center text-muted">
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm">{hint}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-border/80 pb-5">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[.16em] text-primary">PCPLACE PLATFORM</p>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
