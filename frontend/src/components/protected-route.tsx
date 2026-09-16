'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldX } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button, Spinner } from '@/components/ui';
import type { Role } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Kirish uchun ruxsat etilgan rollar. Bo'sh bo'lsa — faqat login tekshiriladi. */
  roles?: Role[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { role, loading } = useAuth();
  const router = useRouter();

  const isLoggedIn = !!role;
  const hasAccess = isLoggedIn && (roles ? roles.includes(role) : true);

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      const from = typeof window !== 'undefined' ? window.location.pathname : '';
      router.replace(`/login${from && from !== '/login' ? `?from=${encodeURIComponent(from)}` : ''}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isLoggedIn]);

  // Yuklanmoqda — neon spinner
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Spinner />
        <p className="text-sm text-[var(--muted)]">Tekshirilmoqda...</p>
      </div>
    );
  }

  // Login qilinmagan — yuklanishini kutib turgan paytda yoki redirect oldidan
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Spinner />
      </div>
    );
  }

  // Login qilingan, lekin roli mos kelmaydi
  if (!hasAccess) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        {/* Neon glow background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="h-[400px] w-[400px] rounded-full bg-[var(--danger)]/10 blur-[120px]" />
        </div>

        <div className="relative z-10">
          {/* Shield icon */}
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 shadow-[0_0_30px_rgba(255,77,109,0.2)]">
            <ShieldX size={36} className="text-[var(--danger)]" />
          </div>

          <h2 className="mb-2 text-2xl font-extrabold text-[var(--foreground)]">
            Ruxsat yo&apos;q
          </h2>
          <p className="mb-8 text-[var(--muted)]">
            Bu sahifaga kirish uchun sizda yetarli huquq mavjud emas.
          </p>

          <Button onClick={() => router.push('/clubs')}>
            Bosh sahifaga qaytish
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
