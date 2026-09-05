'use client';

import { useEffect, useState } from 'react';
import { Building2, CalendarCheck2, Gamepad2, User as UserIcon } from 'lucide-react';
import { RequireRole } from '@/components/require-role';
import { api } from '@/lib/api';
import { Card, PageHeader, Spinner } from '@/components/ui';
import type { AdminStats } from '@/types';

const tiles: { key: keyof AdminStats; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'usersCount', label: 'Foydalanuvchilar', icon: UserIcon },
  { key: 'ownersCount', label: 'Klub egalari', icon: Building2 },
  { key: 'clubsCount', label: 'Klublar', icon: Gamepad2 },
  { key: 'bookingsCount', label: 'Bronlar', icon: CalendarCheck2 },
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
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <t.icon size={20} />
              </div>
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
