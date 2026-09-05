'use client';

import { useEffect, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { api } from '@/lib/api';
import { Card, PageHeader, Spinner } from '@/components/ui';
import type { AdminStats } from '@/types';

const tiles: { key: keyof AdminStats; label: string; icon: string }[] = [
  { key: 'usersCount', label: 'Foydalanuvchilar', icon: '👤' },
  { key: 'ownersCount', label: 'Klub egalari', icon: '🏢' },
  { key: 'clubsCount', label: 'Klublar', icon: '🎮' },
  { key: 'bookingsCount', label: 'Bronlar', icon: '📅' },
];

function AdminStatsContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.get<AdminStats>('/admins/stats').then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader title="Statistika" subtitle="Umumiy tizim ko'rsatkichlari" />
      {!stats ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {tiles.map((t) => (
            <Card key={t.key}>
              <div className="text-2xl">{t.icon}</div>
              <p className="mt-2 text-3xl font-extrabold">{stats[t.key]}</p>
              <p className="text-sm text-muted">{t.label}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminStatsPage() {
  return (
    <RequireRole roles={['admin']}>
      <AdminStatsContent />
    </RequireRole>
  );
}
