'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Badge, Button, Card, EmptyState, ErrorText, Field, Input, PageHeader, Spinner } from '@/components/ui';
import { RatingBadge, StarRow } from '@/components/star-rating';
import type { Booking, Club, Pc, Review, Room, Snack } from '@/types';

const roomTypeLabel: Record<string, string> = { vip: 'VIP xona', umumiy: 'Umumiy zal' };
const pcStatusStyle: Record<string, string> = {
  bosh: 'border-emerald-400 bg-emerald-500/10 text-emerald-700',
  band: 'border-red-300 bg-red-500/10 text-red-500 cursor-not-allowed opacity-70',
  texnik_xizmat: 'border-border bg-border/40 text-muted cursor-not-allowed opacity-70',
};

export default function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { role } = useAuth();
  const router = useRouter();

  const [club, setClub] = useState<Club | null>(null);
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loadError, setLoadError] = useState('');

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [pcs, setPcs] = useState<Pc[] | null>(null);
  const [selectedPc, setSelectedPc] = useState<Pc | null>(null);

  const [hours, setHours] = useState(1);
  const [selectedSnacks, setSelectedSnacks] = useState<Record<string, number>>({});

  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<Club>(`/clubs/${id}`),
      api.get<Room[]>(`/rooms?club=${id}`),
      api.get<Review[]>(`/reviews/club/${id}`),
      api.get<Snack[]>(`/snacks?club=${id}`),
    ])
      .then(([c, r, rv, sn]) => {
        setClub(c);
        setRooms(r);
        setReviews(rv);
        setSnacks(sn.filter((s) => s.isAvailable));
      })
      .catch(() => setLoadError('Klub ma’lumotlarini yuklab bo‘lmadi'));
  }, [id]);

  function selectRoom(room: Room) {
    setSelectedRoom(room);
    setSelectedPc(null);
    setPcs(null);
    api
      .get<Pc[]>(`/pcs?room=${room._id}`)
      .then(setPcs)
      .catch(() => setPcs([]));
  }

  const availableSnacks = snacks;

  const roomCost = selectedRoom ? selectedRoom.pricePerHour * hours : 0;
  const snacksCost = useMemo(
    () =>
      Object.entries(selectedSnacks).reduce((sum, [snackId, qty]) => {
        const snack = availableSnacks.find((s) => s._id === snackId);
        return snack ? sum + snack.price * qty : sum;
      }, 0),
    [selectedSnacks, availableSnacks],
  );
  const total = roomCost + snacksCost;

  function toggleSnack(snackId: string, checked: boolean) {
    setSelectedSnacks((prev) => {
      const next = { ...prev };
      if (checked) next[snackId] = 1;
      else delete next[snackId];
      return next;
    });
  }

  function setSnackQty(snackId: string, qty: number) {
    setSelectedSnacks((prev) => ({ ...prev, [snackId]: Math.max(1, qty) }));
  }

  async function confirmBooking() {
    if (!selectedPc) return;
    if (role !== 'user') {
      router.push('/login');
      return;
    }
    setBookingError('');
    setBookingLoading(true);
    try {
      const booking = await api.post<Booking>('/bookings', {
        pc: selectedPc._id,
        hours,
        snacks: Object.entries(selectedSnacks).map(([snack, quantity]) => ({ snack, quantity })),
      });
      setConfirmedBooking(booking);
      if (selectedRoom) selectRoom(selectedRoom); // pc holatini yangilash
    } catch (err) {
      setBookingError(err instanceof ApiError ? err.message : 'Bron qilishda xatolik yuz berdi');
    } finally {
      setBookingLoading(false);
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState title={loadError} />
      </div>
    );
  }

  if (!club || !rooms) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageHeader
        title={club.name}
        subtitle={
          <span className="inline-flex items-center gap-2">
            {club.address} · <RatingBadge value={club.ratingAverage} count={club.ratingCount} size={14} />
          </span>
        }
      />

      {/* 1. Xonalar */}
      <Card className="mb-6">
        <h2 className="mb-3 font-semibold">1. Xonani tanlang</h2>
        {rooms.length === 0 ? (
          <EmptyState title="Bu klubda hali xonalar qo'shilmagan" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <button
                key={room._id}
                onClick={() => selectRoom(room)}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedRoom?._id === room._id ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium">{room.name}</span>
                  <Badge tone={room.type === 'vip' ? 'warning' : 'default'}>{roomTypeLabel[room.type]}</Badge>
                </div>
                <p className="text-sm text-muted">{room.pricePerHour.toLocaleString()} so&apos;m / soat</p>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* 2. PC tanlash */}
      {selectedRoom && (
        <Card className="mb-6">
          <h2 className="mb-3 font-semibold">2. Bo&apos;sh kompyuter tanlang — {selectedRoom.name}</h2>
          {pcs === null ? (
            <Spinner />
          ) : pcs.length === 0 ? (
            <EmptyState title="Bu xonada hali PC qo'shilmagan" />
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
              {pcs.map((pc) => (
                <button
                  key={pc._id}
                  disabled={pc.status !== 'bosh'}
                  onClick={() => setSelectedPc(pc)}
                  className={`rounded-lg border-2 px-2 py-3 text-sm font-medium transition ${pcStatusStyle[pc.status]} ${
                    selectedPc?._id === pc._id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {pc.label}
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 flex gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> bo&apos;sh
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> band
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border" /> texnik xizmatda
            </span>
          </div>
        </Card>
      )}

      {/* 3. Vaqt + snacklar + narx */}
      {selectedPc && selectedRoom && (
        <Card className="mb-6">
          <h2 className="mb-3 font-semibold">3. Vaqt va qo&apos;shimchalar — {selectedPc.label}</h2>

          <Field label="Necha soat o'ynaysiz?">
            <Input
              type="number"
              min={1}
              value={hours}
              onChange={(e) => setHours(Math.max(1, Number(e.target.value) || 1))}
              className="max-w-[140px]"
            />
          </Field>

          {availableSnacks.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-foreground/80">Snacks / qo&apos;shimcha xizmatlar</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {availableSnacks.map((snack) => {
                  const checked = snack._id in selectedSnacks;
                  return (
                    <label
                      key={snack._id}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                        checked ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={checked} onChange={(e) => toggleSnack(snack._id, e.target.checked)} />
                        {snack.name} <span className="text-muted">({snack.price.toLocaleString()} so&apos;m)</span>
                      </span>
                      {checked && (
                        <Input
                          type="number"
                          min={1}
                          value={selectedSnacks[snack._id]}
                          onChange={(e) => setSnackQty(snack._id, Number(e.target.value) || 1)}
                          className="w-16 py-1"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-border/30 p-4 text-sm">
            <div className="flex justify-between">
              <span>Xona narxi ({hours} soat)</span>
              <span>{roomCost.toLocaleString()} so&apos;m</span>
            </div>
            <div className="flex justify-between">
              <span>Snacklar</span>
              <span>{snacksCost.toLocaleString()} so&apos;m</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Jami</span>
              <span>{total.toLocaleString()} so&apos;m</span>
            </div>
          </div>

          <ErrorText>{bookingError}</ErrorText>

          {confirmedBooking ? (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-700">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>
                Bron muvaffaqiyatli yaratildi! To&apos;lov joyida (naqd/karta) amalga oshiriladi.{' '}
                <Link href="/profile" className="font-semibold underline">
                  Profilimda ko&apos;rish
                </Link>
              </span>
            </div>
          ) : (
            <Button className="mt-4 w-full" disabled={bookingLoading} onClick={confirmBooking}>
              {bookingLoading ? 'Yuborilmoqda…' : role === 'user' ? 'Bronni tasdiqlash' : 'Bron qilish uchun kiring'}
            </Button>
          )}
        </Card>
      )}

      {/* Izohlar */}
      <Card>
        <h2 className="mb-3 font-semibold">Izohlar</h2>
        {!reviews || reviews.length === 0 ? (
          <EmptyState title="Hali izohlar yo'q" hint="Bron qilib, safaringizdan so'ng birinchi bo'lib izoh qoldiring." />
        ) : (
          <ul className="space-y-3">
            {reviews.map((rv) => (
              <li key={rv._id} className="rounded-lg border border-border p-3 text-sm">
                <div className="mb-1">
                  <StarRow value={rv.rating} />
                </div>
                {rv.comment && <p className="text-foreground/80">{rv.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
