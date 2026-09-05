'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isNavActive, itemsForRole } from '@/lib/nav-items';

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
      <Link href="/" className="flex items-center gap-2 px-5 py-5 text-lg font-bold text-primary">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">P</span>
        PCplace
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as never}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? 'bg-primary text-white shadow-sm' : 'text-foreground/75 hover:bg-border/60 hover:text-foreground'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        {loading ? null : user ? (
          <div className="rounded-lg bg-border/30 p-3">
            <p className="truncate text-sm font-semibold">{user.fullName || user.email}</p>
            <p className="text-xs text-muted">{role ? roleLabel[role] : ''}</p>
            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold transition hover:bg-border/60"
            >
              Chiqish
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              onClick={onNavigate}
              className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium hover:bg-border/60"
            >
              Kirish
            </Link>
            <Link
              href="/register"
              onClick={onNavigate}
              className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white hover:bg-primary-dark"
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
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-surface md:block">
      <SidebarContent />
    </aside>
  );
}
