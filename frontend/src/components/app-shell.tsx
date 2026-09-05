'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
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
        {/* Mobil: ingichka yuqori panel — brend + chiqish/kirish */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur md:hidden">
          <Link href="/" className="flex items-center gap-2 text-base font-bold text-primary">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-white">P</span>
            PCplace
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground/70"
              aria-label="Chiqish"
            >
              <LogOut size={16} />
            </button>
          ) : (
            <Link href="/login" className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium">
              Kirish
            </Link>
          )}
        </div>

        {/* Pastki navigatsiyaga joy qoldirish uchun bo'shliq (mobil) */}
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
      </div>

      <BottomNav />
    </div>
  );
}
