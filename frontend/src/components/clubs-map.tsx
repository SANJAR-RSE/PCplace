'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import Link from 'next/link';
import { RatingBadge } from '@/components/star-rating';
import type { Club } from '@/types';

// Next.js bundlingda leaflet'ning default marker rasm yo'llari singan bo'ladi — qo'lda tuzatamiz.
const markerIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const TASHKENT: [number, number] = [41.2995, 69.2401];

function FitBounds({ clubs }: { clubs: Club[] }) {
  const map = useMap();
  useEffect(() => {
    if (clubs.length === 0) return;
    const bounds = L.latLngBounds(clubs.map((c) => [c.location.lat, c.location.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [clubs, map]);
  return null;
}

export function ClubsMap({ clubs, height = 420 }: { clubs: Club[]; height?: number }) {
  // MapContainer faqat birinchi renderdagi center/zoom qiymatidan foydalanadi — keyingi
  // o'zgarishlarni FitBounds orqali boshqaramiz, shuning uchun bu yerda ref shart emas.
  const initialCenter: [number, number] = clubs[0] ? [clubs[0].location.lat, clubs[0].location.lng] : TASHKENT;

  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl border border-border">
      <MapContainer center={initialCenter} zoom={12} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds clubs={clubs} />
        {clubs.map((club) => (
          <Marker key={club._id} position={[club.location.lat, club.location.lng]} icon={markerIcon}>
            <Popup>
              <div className="min-w-[160px]">
                <p className="font-semibold">{club.name}</p>
                <p className="text-xs text-gray-500">{club.address}</p>
                <p className="mt-1 text-xs">
                  <RatingBadge value={club.ratingAverage} count={club.ratingCount} size={12} />
                </p>
                <Link href={`/clubs/${club._id}`} className="mt-2 inline-block text-xs font-semibold text-indigo-600">
                  Ko&apos;rish →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
