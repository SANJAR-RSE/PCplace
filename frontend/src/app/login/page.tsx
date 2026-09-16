'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Button, ErrorText, Field, Input, Spinner } from '@/components/ui';
import { Gamepad2, ArrowRight } from 'lucide-react';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Login bo'lgandan keyin avvalgi sahifaga qaytish
      const from = searchParams.get('from') ?? '/clubs';
      router.push(from);

    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[var(--accent)]/5 blur-3xl" />

      <div className="animate-fade-in-up relative w-full max-w-md">
        {/* Top neon glow line on card */}
        <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60" />

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] shadow-[0_0_32px_var(--primary-glow)]">
              <Gamepad2 size={28} className="text-white" />
              <span className="absolute -inset-[1px] rounded-2xl border border-[var(--primary)]/50 animate-[neon-pulse_3s_ease-in-out_infinite]" />
            </div>
            <h1 className="bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)]/70 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
              Tizimga kirish
            </h1>
            <p className="mt-1.5 text-sm text-[var(--muted)]">
              User, klub egasi yoki admin — barchasi shu orqali kiradi.
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <ErrorText>{error}</ErrorText>
            <Field label="Email">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="siz@misol.com"
              />
            </Field>
            <Field label="Parol">
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <Button type="submit" disabled={loading} className="mt-2 w-full gap-3">
              {loading ? (
                'Tekshirilmoqda…'
              ) : (
                <>
                  Kirish
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 border-t border-[var(--border)] pt-5 text-center">
            <p className="text-sm text-[var(--muted)]">
              Akkountingiz yo&apos;qmi?{' '}
              <Link href="/register" className="font-semibold text-[var(--primary)] hover:underline">
                Ro&apos;yxatdan o&apos;ting
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          PCplace — kompyuterhona bron qilish platformasi
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner /></div>}>
      <LoginForm />
    </Suspense>
  );
}
