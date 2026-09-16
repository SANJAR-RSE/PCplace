'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import Link from 'next/link';
import { RatingBadge } from '@/components/star-rating';
import type { Club } from '@/types';

// Leaflet default icons setup for Next.js
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

export function ClubsMap({ clubs, height = 400 }: { clubs: Club[]; height?: number }) {
  const initialCenter: [number, number] = clubs[0] ? [clubs[0].location.lat, clubs[0].location.lng] : TASHKENT;

  return (
    <>
      {/* Inline styles to perfectly invert the standard OpenStreetMap tiles into a Dark/Gaming aesthetic */}
      <style>{`
        .dark-map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .leaflet-popup-content-wrapper {
          background-color: var(--surface2) !important;
          color: var(--foreground) !important;
          border: 1px solid var(--border);
          border-radius: 12px !important;
        }
        .leaflet-popup-tip {
          background-color: var(--surface2) !important;
          border: 1px solid var(--border);
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: var(--muted) !important;
        }
      `}</style>
      
      <div 
        style={{ height }} 
        className="relative z-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <MapContainer center={initialCenter} zoom={12} scrollWheelZoom className="h-full w-full">
          <TileLayer
            className="dark-map-tiles"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds clubs={clubs} />
          {clubs.map((club) => (
            <Marker key={club._id} position={[club.location.lat, club.location.lng]} icon={markerIcon}>
              <Popup>
                <div className="min-w-[160px] p-1">
                  <p className="font-bold text-[var(--foreground)] text-sm mb-1">{club.name}</p>
                  <p className="text-xs text-[var(--muted)] mb-2 leading-relaxed">{club.address}</p>
                  <div className="mb-3">
                    <RatingBadge value={club.ratingAverage} count={club.ratingCount} size={12} />
                  </div>
                  <Link 
                    href={`/clubs/${club._id}`} 
                    className="block w-full rounded-lg bg-[var(--primary)]/10 px-3 py-1.5 text-center text-xs font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
                  >
                    Batafsil ko'rish
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}
