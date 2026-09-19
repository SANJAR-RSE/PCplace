'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isNavActive, itemsForRole } from '@/lib/nav-items';
import { Settings, Crown } from 'lucide-react';

const roleLabel: Record<string, string> = {
  user: 'Foydalanuvchi',
  clubOwner: 'Klub egasi',
  admin: 'Admin',
};

const roleBadgeStyle: Record<string, string> = {
  user: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  clubOwner: 'bg-amber-500/10 text-amber-400',
  admin: 'bg-[var(--accent)]/10 text-[var(--accent)]',
};

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, role, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const items = itemsForRole(role);

  function handleLogout() {
    logout();
    onNavigate?.();
    router.push('/login');
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-5 py-6">
        <img src="/logo.png" alt="PCplace" className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
        <div>
          <p className="text-base font-extrabold tracking-tight text-[var(--foreground)]">PCplace</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]/70">Gaming Hub</p>
        </div>
      </Link>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 pt-4">
        {items.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as never}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                active
                  ? 'bg-[var(--primary)]/15 text-[var(--primary)] shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                  : 'text-[var(--muted)] hover:bg-[var(--primary)]/8 hover:text-[var(--foreground)]'
              }`}
            >
              {/* Active indicator line */}
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary-glow)]" />
              )}
              <span className={active ? 'text-[var(--primary)]' : 'text-[var(--muted)] group-hover:text-[var(--foreground)]'}>
                <Icon size={18} />
              </span>
              {item.label}

            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[var(--border)] p-3">
        {/* Settings link */}
        <Link
          href="/settings"
          onClick={onNavigate}
          className={`group relative mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
            isNavActive(pathname, '/settings')
              ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
              : 'text-[var(--muted)] hover:bg-[var(--primary)]/8 hover:text-[var(--foreground)]'
          }`}
        >
          {isNavActive(pathname, '/settings') && (
            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary-glow)]" />
          )}
          <Settings size={18} />
          Sozlamalar
        </Link>

        {/* User card */}
        {loading ? null : user ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-3">
            <div className="mb-2 flex items-center gap-2">
              {/* Avatar */}
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary-dark)]/20 text-sm font-bold text-[var(--primary)]">
                {(user.fullName || user.email)?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">{user.fullName || user.email}</p>
                {role && (
                  <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${roleBadgeStyle[role] ?? ''}`}>
                    {role === 'admin' || role === 'clubOwner' ? <Crown size={9} /> : null}
                    {roleLabel[role]}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] transition-all hover:border-[var(--danger)]/30 hover:text-[var(--danger)]"
            >
              Chiqish
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              onClick={onNavigate}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-3 py-2 text-center text-sm font-semibold text-[var(--muted)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
            >
              Kirish
            </Link>
            <Link
              href="/register"
              onClick={onNavigate}
              className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] px-3 py-2 text-center text-sm font-semibold text-white shadow-[0_0_16px_var(--primary-glow)] transition-all hover:shadow-[0_0_24px_var(--primary-glow)]"
            >
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl md:block">
      {/* Neon top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />
      <SidebarContent />
    </aside>
  );
}
