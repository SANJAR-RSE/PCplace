'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { ClubCard } from '@/components/club-card';
import { EmptyState, PageHeader, Spinner } from '@/components/ui';
import type { Club } from '@/types';

const ClubsMap = dynamic(() => import('@/components/clubs-map').then((m) => m.ClubsMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
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
      .catch(() => setError("Klublar ro'yxatini yuklab bo'lmadi"));
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
        subtitle="Yaqiningizdagi hamkor klublarni toping, bo'sh joy va narxlarni solishtiring."
      />

      {/* Search bar */}
      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface2)] py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--muted)]/50 hover:border-[var(--primary)]/40 focus:border-[var(--primary)] focus:ring-3 focus:ring-[var(--primary)]/20"
            placeholder="Nomi yoki manzil bo'yicha qidirish…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-2.5 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

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
