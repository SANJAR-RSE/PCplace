'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Button, ErrorText, Field, Input } from '@/components/ui';
import { Gamepad2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(fullName, email, password, phone || undefined);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[var(--accent)]/5 blur-3xl" />

      <div className="animate-fade-in-up relative w-full max-w-md">
        {/* Top neon glow line */}
        <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60" />

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] shadow-[0_0_32px_var(--primary-glow)]">
              <Gamepad2 size={28} className="text-white" />
              <span className="absolute -inset-[1px] rounded-2xl border border-[var(--primary)]/50" />
            </div>
            <h1 className="bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)]/70 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
              Ro&apos;yxatdan o&apos;tish
            </h1>
            <p className="mt-1.5 text-sm text-[var(--muted)]">
              Telegram botga kirish uchun profilingizdan kod olasiz.
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <ErrorText>{error}</ErrorText>
            <Field label="To'liq ism">
              <Input
                required
                minLength={2}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ism Familiya"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="siz@misol.com"
              />
            </Field>
            <Field label="Telefon (ixtiyoriy)">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
              />
            </Field>
            <Field label="Parol">
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="kamida 6 belgi"
              />
            </Field>
            <Button type="submit" disabled={loading} className="mt-2 w-full gap-3">
              {loading ? (
                "Yaratilmoqda…"
              ) : (
                <>
                  Ro&apos;yxatdan o&apos;tish
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 border-t border-[var(--border)] pt-5 text-center">
            <p className="text-sm text-[var(--muted)]">
              Akkountingiz bormi?{' '}
              <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
                Kirish
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          PCplace — kompyuterhona bron qilish platformasi
        </p>
      </div>
    </div>
  );
}
