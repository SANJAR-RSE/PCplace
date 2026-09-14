'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Send, MessageSquare } from 'lucide-react';
import { RequireRole } from '@/components/require-role';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { resolveBookingRefs, ResolvedRefs } from '@/lib/resolve-bookings';
import { BookingRow } from '@/components/booking-row';
import { StarPicker } from '@/components/star-rating';
import {
  Button, Card, EmptyState, ErrorText, Field, Input, PageHeader, Spinner, Textarea,
} from '@/components/ui';
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
      if (err instanceof ApiError && err.status === 409) { onDone(); return; }
      setError(err instanceof ApiError ? err.message : 'Izoh yuborilmadi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 rounded-xl border border-[var(--primary)]/15 bg-[var(--primary)]/5 p-4">
      <ErrorText>{error}</ErrorText>
      <div className="mb-3">
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <Textarea rows={2} placeholder="Izoh (ixtiyoriy)" value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button type="submit" disabled={loading} className="mt-3">
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
  const [saveOk, setSaveOk] = useState(false);
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
      setSaveOk(true);
      setSaveMsg('Saqlandi');
    } catch (err) {
      setSaveOk(false);
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
    } catch { /* jim */ } finally {
      setBotLoading(false);
    }
  }

  async function cancelBooking(id: string) {
    setActionError('');
    try {
      await api.patch(`/bookings/${id}/cancel`);
      loadBookings();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Bekor qilib bo'lmadi");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader title="Profil" subtitle={user?.email} />

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        {/* Personal info */}
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <span className="text-lg font-black">{(user?.fullName || user?.email)?.[0]?.toUpperCase()}</span>
            </div>
            <h2 className="font-bold text-[var(--foreground)]">Shaxsiy ma&apos;lumotlar</h2>
          </div>
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
            {saveMsg && (
              <p className={`mt-2 flex items-center gap-1.5 text-sm ${saveOk ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}`}>
                {saveOk && <CheckCircle2 size={14} />}
                {saveMsg}
              </p>
            )}
          </form>
        </Card>

        {/* Telegram bot */}
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--neon-blue)]/10 text-[var(--neon-blue)]">
              <Send size={18} />
            </div>
            <h2 className="font-bold text-[var(--foreground)]">Telegram botga ulanish</h2>
          </div>
          <p className="mb-4 text-sm text-[var(--muted)]">
            Kod oling va uni Telegram botga yuboring — akkountingiz avtomatik bog&apos;lanadi.
          </p>
          <Button onClick={getBotCode} disabled={botLoading} variant="secondary">
            {botLoading ? 'Yaratilmoqda…' : 'Kod olish'}
          </Button>
          {botCode && (
            <div className="mt-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4 text-center">
              <p className="font-mono text-3xl font-black tracking-[.22em] text-[var(--primary)] text-glow-primary">
                {botCode.code}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">{botCode.expiresInMinutes} daqiqa amal qiladi</p>
            </div>
          )}
          {user?.telegramId && (
            <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
              <CheckCircle2 size={16} /> Telegram akkount bog&apos;langan
            </p>
          )}
        </Card>
      </div>

      {/* Bookings */}
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <MessageSquare size={18} />
          </div>
          <h2 className="font-bold text-[var(--foreground)]">Bronlarim</h2>
        </div>
        <ErrorText>{actionError}</ErrorText>
        {bookings === null || refs === null ? (
          <div className="flex justify-center py-6"><Spinner /></div>
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
                        <Button variant="danger" onClick={() => cancelBooking(b._id)}>Bekor qilish</Button>
                      )}
                      {(b.status === 'confirmed' || b.status === 'completed') && reviewOpenFor !== b._id && (
                        <Button variant="secondary" onClick={() => setReviewOpenFor(b._id)}>Izoh qoldirish</Button>
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
