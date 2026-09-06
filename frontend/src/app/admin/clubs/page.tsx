'use client';

import { FormEvent, useEffect, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { api, ApiError } from '@/lib/api';
import { Badge, Button, Card, EmptyState, ErrorText, Field, Input, PageHeader, Select, Spinner } from '@/components/ui';
import { RatingBadge } from '@/components/star-rating';
import type { Club, ClubOwner, ClubStatus, Room, RoomType } from '@/types';

const roomTypeLabel: Record<RoomType, string> = { vip: 'VIP xona', umumiy: 'Umumiy zal' };

const statusTone: Record<ClubStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  pending: 'warning',
  approved: 'success',
  blocked: 'danger',
};
const statusLabel: Record<ClubStatus, string> = {
  pending: 'Tekshirilmoqda',
  approved: 'Tasdiqlangan',
  blocked: 'Bloklangan',
};

function CreateClubForm({ owners, onCreated, onCancel }: { owners: ClubOwner[]; onCreated: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('41.2995');
  const [lng, setLng] = useState('69.2401');
  const [imageUrl, setImageUrl] = useState('');
  const [ownerId, setOwnerId] = useState(owners[0]?._id ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!ownerId) {
      setError('Klub egasi tanlanmagan');
      return;
    }
    setLoading(true);
    try {
      await api.post('/clubs', {
        name,
        address,
        location: { lat: Number(lat), lng: Number(lng) },
        imageUrl: imageUrl || undefined,
        owner: ownerId,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Klub yaratilmadi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="mb-3 font-semibold">Yangi klub qo&apos;shish</h2>
      {owners.length === 0 ? (
        <EmptyState title="Avval klub egasi yarating" hint="Klub ma'lum bir egaga bog'lanishi kerak — 'Klub egalari' bo'limidan qo'shing." />
      ) : (
        <form onSubmit={submit}>
          <ErrorText>{error}</ErrorText>
          <Field label="Klub egasi">
            <Select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
              {owners.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.fullName} ({o.email})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Nomi">
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Manzil">
            <Input required value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude">
              <Input required type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
            </Field>
            <Field label="Longitude">
              <Input required type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />
            </Field>
          </div>
          <Field label="Rasm URL (ixtiyoriy)">
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Yaratilmoqda…' : 'Yaratish'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Bekor qilish
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

function EditClubForm({ club, onSaved, onCancel }: { club: Club; onSaved: (c: Club) => void; onCancel: () => void }) {
  const [name, setName] = useState(club.name);
  const [address, setAddress] = useState(club.address);
  const [lat, setLat] = useState(String(club.location.lat));
  const [lng, setLng] = useState(String(club.location.lng));
  const [imageUrl, setImageUrl] = useState(club.imageUrl ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const updated = await api.patch<Club>(`/clubs/${club._id}`, {
        name,
        address,
        location: { lat: Number(lat), lng: Number(lng) },
        imageUrl: imageUrl || undefined,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Saqlab bo‘lmadi');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 rounded-lg bg-border/30 p-3">
      <ErrorText>{error}</ErrorText>
      <Field label="Nomi">
        <Input required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Manzil">
        <Input required value={address} onChange={(e) => setAddress(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Latitude">
          <Input required type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
        </Field>
        <Field label="Longitude">
          <Input required type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />
        </Field>
      </div>
      <Field label="Rasm URL">
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
      </Field>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saqlanmoqda…' : 'Saqlash'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Bekor qilish
        </Button>
      </div>
    </form>
  );
}

function AdminRoomsManager({ clubId }: { clubId: string }) {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<RoomType>('umumiy');
  const [price, setPrice] = useState('20000');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<RoomType>('umumiy');
  const [editPrice, setEditPrice] = useState('');

  function load() {
    api.get<Room[]>(`/rooms?club=${clubId}`).then(setRooms).catch(() => setRooms([]));
  }
  useEffect(load, [clubId]);

  async function addRoom(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/rooms', { club: clubId, name, type, pricePerHour: Number(price) });
      setName('');
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Xona qo&apos;shilmadi');
    }
  }

  function startEdit(room: Room) {
    setEditingId(room._id);
    setEditName(room.name);
    setEditType(room.type);
    setEditPrice(String(room.pricePerHour));
    setError('');
  }

  async function saveEdit(id: string) {
    setError('');
    try {
      await api.patch(`/rooms/${id}`, { name: editName, type: editType, pricePerHour: Number(editPrice) });
      setEditingId(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Tahrirlashda xatolik');
    }
  }

  async function removeRoom(id: string) {
    try {
      await api.delete(`/rooms/${id}`);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'O&apos;chirib bo&apos;lmadi');
    }
  }

  return (
    <div className="mt-3 rounded-lg bg-border/30 p-3">
      <h3 className="mb-2 text-sm font-semibold">Xonalar</h3>
      <ErrorText>{error}</ErrorText>
      <form onSubmit={addRoom} className="mb-3 flex flex-wrap items-end gap-2">
        <div className="w-40">
          <Input required placeholder="Xona nomi" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="w-32">
          <Select value={type} onChange={(e) => setType(e.target.value as RoomType)}>
            <option value="umumiy">Umumiy zal</option>
            <option value="vip">VIP xona</option>
          </Select>
        </div>
        <div className="w-28">
          <Input required type="number" min={0} placeholder="so&apos;m/soat" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <Button type="submit">Qo&apos;shish</Button>
      </form>

      {rooms === null ? (
        <Spinner />
      ) : rooms.length === 0 ? (
        <EmptyState title="Xonalar qo&apos;shilmagan" />
      ) : (
        <ul className="space-y-2">
          {rooms.map((r) => (
            <li key={r._id} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              {editingId === r._id ? (
                <div className="flex flex-wrap items-end gap-2">
                  <Input required placeholder="Nomi" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-40" />
                  <Select value={editType} onChange={(e) => setEditType(e.target.value as RoomType)} className="w-32">
                    <option value="umumiy">Umumiy zal</option>
                    <option value="vip">VIP xona</option>
                  </Select>
                  <Input
                    required
                    type="number"
                    min={0}
                    placeholder="so&apos;m/soat"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-28"
                  />
                  <Button onClick={() => saveEdit(r._id)}>Saqlash</Button>
                  <Button variant="secondary" onClick={() => setEditingId(null)}>Bekor</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>
                    <strong>{r.name}</strong> · <Badge tone={r.type === 'vip' ? 'warning' : 'default'}>{roomTypeLabel[r.type]}</Badge>{' '}
                    · {r.pricePerHour.toLocaleString()} so&apos;m/soat
                  </span>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => startEdit(r)}>
                      Tahrirlash
                    </Button>
                    <Button variant="danger" onClick={() => removeRoom(r._id)}>
                      O&apos;chirish
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AdminClubsContent() {
  const [clubs, setClubs] = useState<Club[] | null>(null);
  const [owners, setOwners] = useState<ClubOwner[]>([]);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roomsOpenId, setRoomsOpenId] = useState<string | null>(null);

  function load() {
    api.get<Club[]>('/clubs/all').then(setClubs).catch(() => setClubs([]));
  }
  useEffect(load, []);
  useEffect(() => {
    api.get<ClubOwner[]>('/club-owners').then(setOwners).catch(() => setOwners([]));
  }, []);

  async function setStatus(id: string, status: ClubStatus) {
    setError('');
    try {
      await api.patch(`/clubs/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Holatni o‘zgartirib bo‘lmadi');
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        title="Klublar"
        subtitle="Yangi klublarni tasdiqlang, tahrirlang yoki qoidabuzarlarni bloklang."
        action={
          <Button variant="secondary" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Bekor qilish' : "+ Yangi klub"}
          </Button>
        }
      />
      <ErrorText>{error}</ErrorText>

      {showCreate && (
        <CreateClubForm
          owners={owners}
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {clubs === null ? (
        <Spinner />
      ) : clubs.length === 0 ? (
        <EmptyState title="Hali klub qo'shilmagan" />
      ) : (
        <div className="space-y-3">
          {clubs.map((club) => (
            <Card key={club._id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{club.name}</p>
                  <p className="text-sm text-muted">{club.address}</p>
                  <p className="mt-1 text-xs text-muted">
                    <RatingBadge value={club.ratingAverage} count={club.ratingCount} size={12} />
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={statusTone[club.status]}>{statusLabel[club.status]}</Badge>
                  {club.status !== 'approved' && (
                    <Button onClick={() => setStatus(club._id, 'approved')}>Tasdiqlash</Button>
                  )}
                  {club.status !== 'blocked' && (
                    <Button variant="danger" onClick={() => setStatus(club._id, 'blocked')}>
                      Bloklash
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => setEditingId(editingId === club._id ? null : club._id)}>
                    {editingId === club._id ? 'Yopish' : 'Tahrirlash'}
                  </Button>
                  <Button variant="secondary" onClick={() => setRoomsOpenId(roomsOpenId === club._id ? null : club._id)}>
                    {roomsOpenId === club._id ? 'Xonalarni yopish' : 'Xonalar'}
                  </Button>
                </div>
              </div>

              {editingId === club._id && (
                <EditClubForm
                  club={club}
                  onCancel={() => setEditingId(null)}
                  onSaved={(updated) => {
                    setClubs((prev) => (prev ? prev.map((c) => (c._id === updated._id ? updated : c)) : prev));
                    setEditingId(null);
                  }}
                />
              )}

              {roomsOpenId === club._id && <AdminRoomsManager clubId={club._id} />}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminClubsPage() {
  return (
    <RequireRole roles={['admin']}>
      <AdminClubsContent />
    </RequireRole>
  );
}
