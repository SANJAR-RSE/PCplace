import { api } from '@/lib/api';
import type { Booking, Club, Pc, Room, Snack } from '@/types';

// Booking'lar backend'dan faqat ObjectId referenslar bilan keladi (populate qilinmagan).
// Ko'rsatish uchun kerakli klub/xona/PC/snack nomlarini alohida so'rovlar bilan yig'ib olamiz.
export interface ResolvedRefs {
  clubs: Record<string, Club>;
  rooms: Record<string, Room>;
  pcs: Record<string, Pc>;
  snacks: Record<string, Snack>;
}

function idOf(value: string | { _id: string }): string {
  return typeof value === 'string' ? value : value._id;
}

export async function resolveBookingRefs(bookings: Booking[]): Promise<ResolvedRefs> {
  const clubIds = [...new Set(bookings.map((b) => idOf(b.club)))];
  const clubs: Record<string, Club> = {};
  await Promise.all(
    clubIds.map(async (id) => {
      try {
        clubs[id] = await api.get<Club>(`/clubs/${id}`);
      } catch {
        // klub o'chirilgan/topilmadi bo'lishi mumkin — jim o'tkazamiz
      }
    }),
  );

  const rooms: Record<string, Room> = {};
  await Promise.all(
    clubIds.map(async (id) => {
      try {
        const list = await api.get<Room[]>(`/rooms?club=${id}`);
        list.forEach((r) => (rooms[r._id] = r));
      } catch {
        // e'tibor bermaymiz
      }
    }),
  );

  const roomIds = [...new Set(bookings.map((b) => idOf(b.room)))];
  const pcs: Record<string, Pc> = {};
  await Promise.all(
    roomIds.map(async (id) => {
      try {
        const list = await api.get<Pc[]>(`/pcs?room=${id}`);
        list.forEach((p) => (pcs[p._id] = p));
      } catch {
        // e'tibor bermaymiz
      }
    }),
  );

  const snacks: Record<string, Snack> = {};
  await Promise.all(
    clubIds.map(async (id) => {
      try {
        const list = await api.get<Snack[]>(`/snacks?club=${id}`);
        list.forEach((s) => (snacks[s._id] = s));
      } catch {
        // e'tibor bermaymiz
      }
    }),
  );

  return { clubs, rooms, pcs, snacks };
}
