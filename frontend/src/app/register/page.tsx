'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Button, Card, ErrorText, Field, Input } from '@/components/ui';

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
      setError(err instanceof ApiError ? err.message : 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <h1 className="mb-1 text-2xl font-bold">Ro&apos;yxatdan o&apos;tish</h1>
        <p className="mb-6 text-sm text-muted">
          Faqat foydalanuvchilar shu yerda ro&apos;yxatdan o&apos;tadi. Telegram botga kirish uchun profilingizdan kod olasiz.
        </p>

        <form onSubmit={onSubmit}>
          <ErrorText>{error}</ErrorText>
          <Field label="To'liq ism">
            <Input required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ism Familiya" />
          </Field>
          <Field label="Email">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="siz@misol.com" />
          </Field>
          <Field label="Telefon (ixtiyoriy)">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
          </Field>
          <Field label="Parol">
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="kamida 6 belgi" />
          </Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Yaratilmoqda…' : 'Ro‘yxatdan o‘tish'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Akkountingiz bormi?{' '}
          <Link href="/login" className="font-semibold text-primary">
            Kirish
          </Link>
        </p>
      </Card>
    </div>
  );
}
