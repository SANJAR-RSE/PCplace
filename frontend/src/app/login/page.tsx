'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Button, Card, ErrorText, Field, Input } from '@/components/ui';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
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
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <Card className="w-full">
        <h1 className="mb-1 text-2xl font-bold">Tizimga kirish</h1>
        <p className="mb-6 text-sm text-muted">User, klub egasi yoki admin — barchasi shu orqali kiradi.</p>

        <form onSubmit={onSubmit}>
          <ErrorText>{error}</ErrorText>
          <Field label="Email">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="siz@misol.com" />
          </Field>
          <Field label="Parol">
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
          </Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Tekshirilmoqda…' : 'Kirish'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Akkountingiz yo&apos;qmi?{' '}
          <Link href="/register" className="font-semibold text-primary">
            Ro&apos;yxatdan o&apos;ting
          </Link>
        </p>
      </Card>
    </div>
  );
}
