'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Spinner } from '@/components/ui';

// Bosh sahifa — rolga qarab tegishli bo'limga yo'naltiradi.
// Marketing/landing sahifasi alohida (`landing/`) statik loyihada joylashgan.
export default function HomePage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (role === 'admin') router.replace('/admin');
    else if (role === 'clubOwner') router.replace('/owner');
    else router.replace('/clubs');
  }, [role, loading, router]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
