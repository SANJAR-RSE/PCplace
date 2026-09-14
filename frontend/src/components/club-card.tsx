import Link from 'next/link';
import { Gamepad2, MapPin, Star } from 'lucide-react';
import type { Club } from '@/types';

export function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club._id}`}
      className="group relative block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15),0_16px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Top accent line (visible on hover) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-60" />

      {/* Image / placeholder */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--primary)]/10 via-[var(--surface2)] to-[var(--accent)]/5">
        {club.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={club.imageUrl}
            alt={club.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--primary)]/40">
            <Gamepad2 size={36} />
          </div>
        )}

        {/* TOP badge */}
        {club.isPromoted && (
          <div className="absolute right-3 top-3 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)] backdrop-blur-sm">
            ⚡ TOP
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--surface)] to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold tracking-tight text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--primary)]">
            {club.name}
          </h3>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <MapPin size={11} className="shrink-0" />
          <span className="line-clamp-1">{club.address}</span>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-amber-400">
            {club.ratingAverage?.toFixed(1) ?? '—'}
          </span>
          <span className="text-xs text-[var(--muted)]">({club.ratingCount} izoh)</span>
        </div>
      </div>
    </Link>
  );
}
