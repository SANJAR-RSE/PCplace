'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isNavActive, itemsForRole } from '@/lib/nav-items';
import { Settings } from 'lucide-react';

const roleLabel: Record<string, string> = {
  user: 'Foydalanuvchi',
  clubOwner: 'Klub egasi',
  admin: 'Admin',
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
      <Link href="/" className="flex items-center gap-2 px-5 py-6 text-lg font-extrabold tracking-tight text-foreground">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm text-white shadow-lg shadow-primary/25">P</span>
        PCplace
      </Link>

      <nav className="flex-1 space-y-1 px-3 pt-2">
        {items.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as never}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/65 hover:bg-primary/7 hover:text-primary'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link href="/settings" className={`mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isNavActive(pathname, '/settings') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/65 hover:bg-primary/7 hover:text-primary'}`}>
          <Settings size={18} />
          Sozlamalar
        </Link>
        {loading ? null : user ? (
          <div className="rounded-xl border border-border/70 bg-slate-50/70 p-3">
            <p className="truncate text-sm font-semibold">{user.fullName || user.email}</p>
            <p className="text-xs text-muted">{role ? roleLabel[role] : ''}</p>
            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold transition hover:border-primary/30 hover:text-primary"
            >
              Chiqish
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              onClick={onNavigate}
              className="rounded-xl border border-border bg-white px-3 py-2 text-center text-sm font-semibold hover:border-primary/30"
            >
              Kirish
            </Link>
            <Link
              href="/register"
              onClick={onNavigate}
              className="rounded-xl bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
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
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border/80 bg-white/80 backdrop-blur-xl md:block">
      <SidebarContent />
    </aside>
  );
}
