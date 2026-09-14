'use client';

import { useEffect, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { api } from '@/lib/api';
import { resolveBookingRefs, ResolvedRefs } from '@/lib/resolve-bookings';
import { BookingRow } from '@/components/booking-row';
import { Button, EmptyState, PageHeader, Spinner } from '@/components/ui';
import type { Booking } from '@/types';

function OwnerBookingsContent() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [refs, setRefs] = useState<ResolvedRefs | null>(null);

  function load() {
    api
      .get<Booking[]>('/bookings/club')
      .then(async (data) => {
        setBookings(data);
        const resolved = await resolveBookingRefs(data);
        setRefs(resolved);
      })
      .catch(() => setBookings([]));
  }
  useEffect(load, []);

  async function updateStatus(id: string, status: Booking['status']) {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      load();
    } catch (e) {
      alert("Xatolik yuz berdi");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader title="Bronlar" subtitle="Klubingizga qilingan barcha bronlar ro'yxati" />

      {!bookings || !refs ? (
        <Spinner />
      ) : bookings.length === 0 ? (
        <EmptyState title="Hali bronlar yo'q" />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <BookingRow
              key={b._id}
              booking={b}
              refs={refs}
              actions={
                <>
                  {b.status === 'pending' && (
                    <>
                      <Button onClick={() => updateStatus(b._id, 'confirmed')}>
                        Tasdiqlash
                      </Button>
                      <Button variant="danger" onClick={() => updateStatus(b._id, 'cancelled')}>
                        Bekor qilish
                      </Button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <Button onClick={() => updateStatus(b._id, 'completed')}>
                      Yakunlash
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
