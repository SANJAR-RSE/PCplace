'use client';

import { useEffect, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { api, ApiError } from '@/lib/api';
import { Badge, Button, Card, EmptyState, ErrorText, PageHeader, Spinner } from '@/components/ui';
import type { Club, ClubStatus } from '@/types';

const statusTone: Record<ClubStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  approved: 'success',
  blocked: 'danger',
};
const statusLabel: Record<ClubStatus, string> = {
  pending: 'Tekshirilmoqda',
  approved: 'Tasdiqlangan',
  blocked: 'Bloklangan',
};

function AdminClubsContent() {
  const [clubs, setClubs] = useState<Club[] | null>(null);
  const [error, setError] = useState('');

  function load() {
    api.get<Club[]>('/clubs/all').then(setClubs).catch(() => setClubs([]));
  }
  useEffect(load, []);

  async function setStatus(id: string, status: ClubStatus) {
    setError('');
    try {
      await api.patch(`/clubs/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Holatni o‘zgartirib bo‘lmadi');
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader title="Klublar" subtitle="Yangi klublarni tasdiqlang yoki qoidabuzarlarni bloklang." />
      <ErrorText>{error}</ErrorText>

      {clubs === null ? (
        <Spinner />
      ) : clubs.length === 0 ? (
        <EmptyState title="Hali klub qo'shilmagan" />
      ) : (
        <div className="space-y-3">
          {clubs.map((club) => (
            <Card key={club._id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{club.name}</p>
                  <p className="text-sm text-muted">{club.address}</p>
                  <p className="mt-1 text-xs text-muted">⭐ {club.ratingAverage.toFixed(1)} ({club.ratingCount})</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={statusTone[club.status]}>{statusLabel[club.status]}</Badge>
                  {club.status !== 'approved' && (
                    <Button onClick={() => setStatus(club._id, 'approved')}>Tasdiqlash</Button>
                  )}
                  {club.status !== 'blocked' && (
                    <Button variant="danger" onClick={() => setStatus(club._id, 'blocked')}>
                      Bloklash
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminClubsPage() {
  return (
    <RequireRole roles={['admin']}>
      <AdminClubsContent />
    </RequireRole>
  );
}
