import Link from 'next/link';
import { Gamepad2, MapPin, Star, Zap } from 'lucide-react';
import type { Club } from '@/types';

export function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club._id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15),0_16px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Top accent line (visible on hover) */}
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Image / placeholder */}
      <div className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden bg-[var(--surface2)]">
        {/* Gaming grid background placeholder */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />

        {club.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={club.imageUrl}
            alt={club.name}
            className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="z-0 flex flex-col items-center justify-center text-[var(--primary)]/30 transition-transform duration-500 group-hover:scale-110 group-hover:text-[var(--primary)]/50">
            <Gamepad2 size={48} strokeWidth={1.5} />
          </div>
        )}

        {/* TOP badge */}
        {club.isPromoted && (
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--primary)] shadow-[0_0_12px_var(--primary-glow)] backdrop-blur-md">
            <Zap size={10} className="fill-[var(--primary)] text-[var(--primary)]" /> TOP
          </div>
        )}

        {/* Gradient overlay at bottom for smooth transition */}
        <div className="absolute inset-x-0 bottom-0 z-0 h-16 bg-gradient-to-t from-[var(--surface)] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 pt-2">
        <h3 className="line-clamp-1 font-bold text-lg tracking-tight text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--primary)]">
          {club.name}
        </h3>

        <div className="mt-1.5 flex items-start gap-1.5 text-xs text-[var(--muted)]">
          <MapPin size={14} className="mt-0.5 shrink-0 text-[var(--primary)]/70" />
          <span className="line-clamp-2 leading-relaxed">{club.address}</span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="fill-[var(--accent)] text-[var(--accent)]" />
            <span className="font-semibold text-[var(--accent)]">
              {club.ratingAverage?.toFixed(1) ?? '0.0'}
            </span>
            <span className="text-xs text-[var(--muted)]">({club.ratingCount} izoh)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
