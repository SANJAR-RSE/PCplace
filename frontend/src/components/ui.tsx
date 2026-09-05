import { InputHTMLAttributes, LabelHTMLAttributes, ButtonHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-border bg-surface p-5 shadow-sm ${className}`}>{children}</div>;
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
      className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${props.className ?? ''}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${props.className ?? ''}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${props.className ?? ''}`}
    />
  );
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const styles: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50',
    secondary: 'border border-border bg-surface hover:bg-border/50 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
    ghost: 'text-foreground/80 hover:bg-border/50 disabled:opacity-50',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${styles[variant]} ${className}`}
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
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[tone]}`}>{children}</span>;
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
    <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted">
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm">{hint}</p>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
