'use client';

import { FormEvent, useEffect, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { resolveBookingRefs, ResolvedRefs } from '@/lib/resolve-bookings';
import { BookingRow } from '@/components/booking-row';
import { Button, Card, EmptyState, ErrorText, Field, Input, PageHeader, Spinner, Textarea } from '@/components/ui';
import type { Booking } from '@/types';

function ReviewForm({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/reviews', { booking: bookingId, rating, comment: comment || undefined });
      onDone();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        onDone(); // allaqachon izoh qoldirilgan — formani yopamiz
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Izoh yuborilmadi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-2 rounded-lg bg-border/30 p-3">
      <ErrorText>{error}</ErrorText>
      <div className="mb-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} className="text-xl leading-none">
            {n <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      <Textarea rows={2} placeholder="Izoh (ixtiyoriy)" value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? 'Yuborilmoqda…' : 'Izohni yuborish'}
      </Button>
    </form>
  );
}

function ProfileContent() {
  const { user, refreshMe } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const [botCode, setBotCode] = useState<{ code: string; expiresInMinutes: number } | null>(null);
  const [botLoading, setBotLoading] = useState(false);

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [refs, setRefs] = useState<ResolvedRefs | null>(null);
  const [reviewOpenFor, setReviewOpenFor] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  function loadBookings() {
    api
      .get<Booking[]>('/bookings/mine')
      .then(async (list) => {
        setBookings(list);
        setRefs(await resolveBookingRefs(list));
      })
      .catch(() => setBookings([]));
  }

  useEffect(loadBookings, []);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSaveMsg('');
    setSaving(true);
    try {
      await api.patch('/users/me', { fullName, phone: phone || undefined });
      await refreshMe();
      setSaveMsg('Saqlandi ✅');
    } catch (err) {
      setSaveMsg(err instanceof ApiError ? err.message : 'Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  }

  async function getBotCode() {
    setBotLoading(true);
    try {
      const res = await api.post<{ code: string; expiresInMinutes: number }>('/auth/bot-code');
      setBotCode(res);
    } catch {
      // jim
    } finally {
      setBotLoading(false);
    }
  }

  async function cancelBooking(id: string) {
    setActionError('');
    try {
      await api.patch(`/bookings/${id}/cancel`);
      loadBookings();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Bekor qilib bo‘lmadi');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader title="Profil" subtitle={user?.email} />

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Shaxsiy ma&apos;lumotlar</h2>
          <form onSubmit={saveProfile}>
            <Field label="To'liq ism">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Field>
            <Field label="Telefon">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
            </Field>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saqlanmoqda…' : 'Saqlash'}
            </Button>
            {saveMsg && <p className="mt-2 text-sm text-muted">{saveMsg}</p>}
          </form>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">Telegram botga ulanish</h2>
          <p className="mb-3 text-sm text-muted">
            Kod oling va uni Telegram botga yuboring — akkountingiz avtomatik bog&apos;lanadi.
          </p>
          <Button onClick={getBotCode} disabled={botLoading} variant="secondary">
            {botLoading ? 'Yaratilmoqda…' : 'Kod olish'}
          </Button>
          {botCode && (
            <div className="mt-3 rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-2xl font-bold tracking-widest text-primary">{botCode.code}</p>
              <p className="mt-1 text-xs text-muted">{botCode.expiresInMinutes} daqiqa amal qiladi</p>
            </div>
          )}
          {user?.telegramId && <p className="mt-3 text-sm text-emerald-600">✅ Telegram akkount bog&apos;langan</p>}
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">Bronlarim</h2>
        <ErrorText>{actionError}</ErrorText>
        {bookings === null || refs === null ? (
          <Spinner />
        ) : bookings.length === 0 ? (
          <EmptyState title="Hali bron qilmagansiz" hint="Xaritadan klub tanlab, bron qiling." />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id}>
                <BookingRow
                  booking={b}
                  refs={refs}
                  actions={
                    <>
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <Button variant="danger" onClick={() => cancelBooking(b._id)}>
                          Bekor qilish
                        </Button>
                      )}
                      {(b.status === 'confirmed' || b.status === 'completed') && reviewOpenFor !== b._id && (
                        <Button variant="secondary" onClick={() => setReviewOpenFor(b._id)}>
                          Izoh qoldirish
                        </Button>
                      )}
                    </>
                  }
                />
                {reviewOpenFor === b._id && (
                  <ReviewForm bookingId={b._id} onDone={() => setReviewOpenFor(null)} />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireRole roles={['user']}>
      <ProfileContent />
    </RequireRole>
  );
}
