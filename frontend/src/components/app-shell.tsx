'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Settings } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { BottomNav } from '@/components/bottom-nav';
import { useAuth } from '@/lib/auth-context';

const NO_SHELL_ROUTES = ['/login', '/register'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  if (NO_SHELL_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobil: gaming topbar */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 px-4 py-3 backdrop-blur-xl md:hidden">
          <Link href="/" className="flex items-center gap-2.5 text-base font-extrabold tracking-tight text-[var(--foreground)]">
            {/* Neon logo icon */}
            <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-sm font-black text-white shadow-[0_0_14px_var(--primary-glow)]">
              P
              <span className="absolute -inset-[1px] rounded-xl border border-[var(--primary)]/40" />
            </span>
            <span className="bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)]/70 bg-clip-text text-transparent">
              PCplace
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
              aria-label="Sozlamalar"
            >
              <Settings size={16} />
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] transition-all hover:border-[var(--danger)]/40 hover:text-[var(--danger)]"
                aria-label="Chiqish"
              >
                <LogOut size={16} />
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-3 py-1.5 text-sm font-semibold text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20"
              >
                Kirish
              </Link>
            )}
          </div>
        </div>

        <main className="relative z-10 flex-1 pb-16 md:pb-0">{children}</main>
      </div>

      <BottomNav />
    </div>
  );
}
