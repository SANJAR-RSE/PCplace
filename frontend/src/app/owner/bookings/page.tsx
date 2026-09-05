'use client';

import { useEffect, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { api, ApiError } from '@/lib/api';
import { resolveBookingRefs, ResolvedRefs } from '@/lib/resolve-bookings';
import { BookingRow } from '@/components/booking-row';
import { Button, EmptyState, ErrorText, PageHeader, Spinner } from '@/components/ui';
import type { Booking } from '@/types';

function OwnerBookingsContent() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [refs, setRefs] = useState<ResolvedRefs | null>(null);
  const [error, setError] = useState('');

  function load() {
    api
      .get<Booking[]>('/bookings/incoming')
      .then(async (list) => {
        setBookings(list);
        setRefs(await resolveBookingRefs(list));
      })
      .catch(() => setBookings([]));
  }
  useEffect(load, []);

  async function act(id: string, action: 'confirm' | 'complete' | 'cancel-by-owner') {
    setError('');
    try {
      await api.patch(`/bookings/${id}/${action}`);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Amalni bajarib bo‘lmadi');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader title="Kelgan bronlar" subtitle="Klublaringizga tushgan bronlarni shu yerdan boshqaring." />
      <ErrorText>{error}</ErrorText>

      {bookings === null || refs === null ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <EmptyState title="Hozircha bron yo'q" />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <BookingRow
              key={b._id}
              booking={b}
              refs={refs}
              actions={
                <>
                  {b.status === 'pending' && (
                    <Button onClick={() => act(b._id, 'confirm')}>Tasdiqlash</Button>
                  )}
                  {b.status === 'confirmed' && (
                    <Button onClick={() => act(b._id, 'complete')}>Yakunlash</Button>
                  )}
                  {(b.status === 'pending' || b.status === 'confirmed') && (
                    <Button variant="danger" onClick={() => act(b._id, 'cancel-by-owner')}>
                      Bekor qilish
                    </Button>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OwnerBookingsPage() {
  return (
    <RequireRole roles={['clubOwner']}>
      <OwnerBookingsContent />
    </RequireRole>
  );
}
