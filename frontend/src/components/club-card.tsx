import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { Badge } from '@/components/ui';
import { RatingBadge } from '@/components/star-rating';
import type { Club } from '@/types';

export function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club._id}`}
      className="group block overflow-hidden rounded-[1.25rem] border border-border bg-surface shadow-[0_12px_30px_-22px_rgba(29,42,75,.4)] transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_35px_-22px_rgba(56,47,157,.45)]"
    >
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 to-accent/15">
        {club.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={club.imageUrl} alt={club.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <Gamepad2 size={40} className="text-primary/60" />
        )}
      </div>
      <div className="p-4.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold tracking-tight">{club.name}</h3>
          {club.isPromoted && <Badge tone="warning">TOP</Badge>}
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-muted">{club.address}</p>
        <p className="mt-2 text-sm font-medium">
          <RatingBadge value={club.ratingAverage} /> <span className="text-muted">({club.ratingCount} izoh)</span>
        </p>
      </div>
    </Link>
  );
}
