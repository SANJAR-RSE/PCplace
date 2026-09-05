'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

const roleLabel: Record<string, string> = {
  user: 'Foydalanuvchi',
  clubOwner: 'Klub egasi',
  admin: 'Admin',
};

export function Navbar() {
  const { user, role, logout, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = (() => {
    if (role === 'admin') {
      return [
        { href: '/admin', label: 'Statistika' },
        { href: '/admin/clubs', label: 'Klublar' },
        { href: '/admin/users', label: 'Userlar' },
        { href: '/admin/club-owners', label: 'Klub egalari' },
        { href: '/admin/admins', label: 'Adminlar' },
      ];
    }
    if (role === 'clubOwner') {
      return [
        { href: '/owner', label: 'Mening klubim' },
        { href: '/owner/bookings', label: 'Bronlar' },
        { href: '/subscriptions', label: 'Obuna' },
      ];
    }
    if (role === 'user') {
      return [
        { href: '/clubs', label: 'Xarita' },
        { href: '/profile', label: 'Profil' },
        { href: '/subscriptions', label: 'Obuna' },
      ];
    }
    return [{ href: '/clubs', label: 'Xarita' }];
  })();

  function handleLogout() {
    logout();
    setOpen(false);
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">P</span>
          PCplace
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href as never}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-border/60 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : user ? (
            <>
              <span className="text-sm text-muted">
                {user.fullName || user.email} · <span className="text-primary">{role ? roleLabel[role] : ''}</span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition hover:bg-border/60"
              >
                Chiqish
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-border/60">
                Kirish
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menyu"
        >
          <span className="sr-only">Menyu</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="block h-0.5 w-5 bg-foreground" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href as never}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-border/60"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-border/60">
                Chiqish
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-border/60">
                  Kirish
                </Link>
                <Link href="/register" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-border/60">
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
