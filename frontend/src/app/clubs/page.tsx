'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { ClubCard } from '@/components/club-card';
import { EmptyState, Input, PageHeader, Spinner } from '@/components/ui';
import type { Club } from '@/types';

const ClubsMap = dynamic(() => import('@/components/clubs-map').then((m) => m.ClubsMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center rounded-2xl border border-border">
      <Spinner />
    </div>
  ),
});

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[] | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get<Club[]>('/clubs')
      .then(setClubs)
      .catch(() => setError('Klublar ro‘yxatini yuklab bo‘lmadi'));
  }, []);

  const filtered = useMemo(() => {
    if (!clubs) return [];
    const q = search.trim().toLowerCase();
    const list = q ? clubs.filter((c) => c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)) : clubs;
    return [...list].sort((a, b) => Number(b.isPromoted) - Number(a.isPromoted));
  }, [clubs, search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title="Kompyuterhonalar xaritasi"
        subtitle="Yaqiningizdagi hamkor klublarni toping, bo‘sh joy va narxlarni solishtiring."
      />

      <div className="mb-6 max-w-sm">
        <Input placeholder="Nomi yoki manzil bo'yicha qidirish…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {!clubs ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : clubs.length === 0 ? (
        <EmptyState title="Hozircha hamkor klublar yo'q" hint="Tez orada yangi klublar qo'shiladi." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <ClubsMap clubs={filtered} />
          <div className="grid max-h-[420px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
            {filtered.map((club) => (
              <ClubCard key={club._id} club={club} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
