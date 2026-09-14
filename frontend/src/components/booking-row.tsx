import { Badge } from '@/components/ui';
import type { Booking, BookingStatus } from '@/types';
import type { ResolvedRefs } from '@/lib/resolve-bookings';

const statusTone: Record<BookingStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'default',
  cancelled: 'danger',
};

const statusLabel: Record<BookingStatus, string> = {
  pending: 'Kutilmoqda',
  confirmed: 'Tasdiqlangan',
  completed: 'Yakunlangan',
  cancelled: 'Bekor qilingan',
};

function idOf(value: string | { _id: string }): string {
  return typeof value === 'string' ? value : value._id;
}

export function BookingRow({ booking, refs, actions }: { booking: Booking; refs: ResolvedRefs; actions?: React.ReactNode }) {
  const club = refs.clubs[idOf(booking.club)];
  const room = refs.rooms[idOf(booking.room)];
  const pc = refs.pcs[idOf(booking.pc)];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-bold text-[var(--foreground)]">{club?.name ?? 'Klub'}</p>
          <p className="text-sm text-[var(--muted)]">
            {room?.name ?? 'Xona'} · {pc?.label ?? 'PC'} · {booking.hours} soat
          </p>
        </div>
        <Badge tone={statusTone[booking.status]}>{statusLabel[booking.status]}</Badge>
      </div>

      {booking.snacks.length > 0 && (
        <ul className="mb-2 text-xs text-[var(--muted)]">
          {booking.snacks.map((item, i) => {
            const snackId = idOf(item.snack as never);
            const snack = refs.snacks[snackId];
            return (
              <li key={i}>
                {snack?.name ?? 'Mahsulot'} × {item.quantity} — {(item.unitPrice * item.quantity).toLocaleString()} so&apos;m
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-[var(--foreground)]">{booking.totalPrice.toLocaleString()} so&apos;m</span>
        <span className="text-xs text-[var(--muted)]">{new Date(booking.createdAt).toLocaleString('uz-UZ')}</span>
      </div>

      {actions && <div className="mt-3 flex gap-2">{actions}</div>}
    </div>
  );
}
