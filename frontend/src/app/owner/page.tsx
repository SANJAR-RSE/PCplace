'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireRole } from '@/components/require-role';
import { api, ApiError } from '@/lib/api';
import { Badge, Button, Card, EmptyState, ErrorText, Field, Input, PageHeader, Spinner } from '@/components/ui';
import { RatingBadge } from '@/components/star-rating';
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

function CreateClubForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('41.2995');
  const [lng, setLng] = useState('69.2401');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/clubs', {
        name,
        address,
        location: { lat: Number(lat), lng: Number(lng) },
        imageUrl: imageUrl || undefined,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Klub yaratilmadi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-3 font-semibold">Yangi klub qo&apos;shish</h2>
      <p className="mb-3 text-sm text-muted">Klub admin tomonidan tasdiqlangach xaritada ko&apos;rinadi.</p>
      <form onSubmit={submit}>
        <ErrorText>{error}</ErrorText>
        <Field label="Nomi">
          <Input required value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Manzil">
          <Input required value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude">
            <Input required type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
          </Field>
          <Field label="Longitude">
            <Input required type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />
          </Field>
        </div>
        <Field label="Rasm URL (ixtiyoriy)">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
        </Field>
        <Button type="submit" disabled={loading}>
          {loading ? 'Yaratilmoqda…' : 'Yaratish'}
        </Button>
      </form>
    </Card>
  );
}

function OwnerContent() {
  const [clubs, setClubs] = useState<Club[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  function load() {
    api
      .get<Club[]>('/clubs/mine')
      .then(setClubs)
      .catch(() => setClubs([]));
  }
  useEffect(load, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        title="Mening klublarim"
        subtitle="Xona, PC va snacklarni boshqarish uchun klubni tanlang."
        action={
          <Button variant="secondary" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Bekor qilish' : '+ Yangi klub'}
          </Button>
        }
      />

      {showCreate && (
        <div className="mb-6">
          <CreateClubForm
            onCreated={() => {
              setShowCreate(false);
              load();
            }}
          />
        </div>
      )}

      {clubs === null ? (
        <Spinner />
      ) : clubs.length === 0 ? (
        <EmptyState title="Hali klubingiz yo'q" hint="Yuqoridagi tugma orqali birinchi klubingizni qo'shing." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {clubs.map((club) => (
            <Link key={club._id} href={`/owner/clubs/${club._id}`} className="block rounded-xl border border-border p-4 transition hover:border-primary/50">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold">{club.name}</span>
                <Badge tone={statusTone[club.status]}>{statusLabel[club.status]}</Badge>
              </div>
              <p className="text-sm text-muted">{club.address}</p>
              <p className="mt-2 text-sm">
                <RatingBadge value={club.ratingAverage} count={club.ratingCount} />
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OwnerPage() {
  return (
    <RequireRole roles={['clubOwner']}>
      <OwnerContent />
    </RequireRole>
  );
}
