'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Search, Map as MapIcon, Grid as GridIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { ClubCard } from '@/components/club-card';
import { EmptyState, Spinner } from '@/components/ui';
import type { Club } from '@/types';

const ClubsMap = dynamic(() => import('@/components/clubs-map').then((m) => m.ClubsMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-[400px] place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <Spinner />
    </div>
  ),
});

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[] | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

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
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[var(--surface)] border-b border-[var(--border)]">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-[var(--primary)]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 text-center">
          <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--foreground)]">
            O'yiningizni <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--neon-blue)] bg-clip-text text-transparent">keyingi bosqichga</span> olib chiqing
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--muted)]">
            O'zingizga eng yaqin va qulay bo'lgan yuqori darajadagi kompyuter klublarini toping, joy band qiling va o'yindan zavqlaning.
          </p>

          {/* Big Search Bar */}
          <div className="mx-auto max-w-2xl relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--primary)]/40 to-[var(--neon-blue)]/40 opacity-20 blur transition duration-500 group-hover:opacity-40" />
            <div className="relative flex items-center bg-[var(--surface2)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl">
              <div className="pl-5 flex items-center justify-center text-[var(--primary)]">
                <Search size={22} />
              </div>
              <input
                className="w-full bg-transparent py-4 pl-4 pr-4 text-base text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                placeholder="Klub nomi yoki manzilini kiriting..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10">
        {error && (
          <p className="mb-8 rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}

        {/* Controls Section */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            {filtered.length} ta klub topildi
          </h2>
          
          <div className="flex rounded-lg bg-[var(--surface2)] p-1 border border-[var(--border)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-[var(--primary)]/20 text-[var(--primary)] shadow-sm' 
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <GridIcon size={16} /> Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === 'map' 
                  ? 'bg-[var(--primary)]/20 text-[var(--primary)] shadow-sm' 
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <MapIcon size={16} /> Xarita
            </button>
          </div>
        </div>

        {/* Content Section */}
        {!clubs ? (
          <div className="flex justify-center py-24">
            <Spinner />
          </div>
        ) : clubs.length === 0 ? (
          <EmptyState title="Hozircha hamkor klublar yo'q" hint="Tez orada yangi klublar qo'shiladi." />
        ) : filtered.length === 0 ? (
          <EmptyState title="Hech narsa topilmadi" hint="Boshqa nom bilan izlab ko'ring." />
        ) : (
          <div className="fade-in-up">
            {viewMode === 'grid' ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((club) => (
                  <ClubCard key={club._id} club={club} />
                ))}
              </div>
            ) : (
              <ClubsMap clubs={filtered} height={500} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
