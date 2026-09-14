'use client';

import { use, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { RequireRole } from '@/components/require-role';
import { api, ApiError } from '@/lib/api';
import { Badge, Button, Card, EmptyState, ErrorText, Field, Input, PageHeader, Select, Spinner } from '@/components/ui';
import type { Club, Pc, Room, RoomType, Snack } from '@/types';

function SaveMsg({ error, ok }: { error?: string; ok?: boolean }) {
  if (error) return <p className="mt-2 text-sm text-[var(--danger)]">{error}</p>;
  if (ok)
    return (
      <p className="mt-2 flex items-center gap-1 text-sm text-[var(--accent)]">
        <span className="text-[var(--accent)]"><CheckCircle2 size={16} /></span> Saqlandi
      </p>
    );
  return null;
}

function ClubInfoForm({ club }: { club: Club }) {
  const [name, setName] = useState(club.name);
  const [address, setAddress] = useState(club.address);
  const [lat, setLat] = useState(String(club.location.lat));
  const [lng, setLng] = useState(String(club.location.lng));
  const [imageUrl, setImageUrl] = useState(club.imageUrl ?? '');
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setOk(false);
    setSaving(true);
    try {
      await api.patch(`/clubs/${club._id}`, {
        name,
        address,
        location: { lat: Number(lat), lng: Number(lng) },
        imageUrl: imageUrl || undefined,
      });
      setOk(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Saqlab bo‘lmadi');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="mb-4 font-semibold text-[var(--foreground)]">Asosiy ma&apos;lumotlar</h2>
      <form onSubmit={submit}>
        <Field label="Klub nomi">
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
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </Field>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saqlanmoqda…' : 'Saqlash'}
        </Button>
        <SaveMsg error={error} ok={ok} />
      </form>
    </Card>
  );
}

const roomTypeLabel: Record<RoomType, string> = { vip: 'VIP xona', umumiy: 'Umumiy zal' };

function RoomsManager({ clubId, onRoomsChange }: { clubId: string; onRoomsChange: (r: Room[]) => void }) {
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
    api.get<Room[]>(`/rooms?club=${clubId}`).then((r) => {
      setRooms(r);
      onRoomsChange(r);
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setError(err instanceof ApiError ? err.message : 'Saqlanmadi');
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
    <Card className="mb-6">
      <h2 className="mb-4 font-semibold text-[var(--foreground)]">Xonalar</h2>
      <ErrorText>{error}</ErrorText>
      <form onSubmit={addRoom} className="mb-4 flex flex-wrap items-end gap-2">
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

      {!rooms ? (
        <Spinner />
      ) : rooms.length === 0 ? (
        <EmptyState title="Hali xonalar yo'q" />
      ) : (
        <ul className="space-y-2">
          {rooms.map((r) => (
            <li key={r._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]">
              {editingId === r._id ? (
                <div className="flex flex-wrap items-end gap-2">
                  <Input required placeholder="Nomi" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-40" />
                  <Select value={editType} onChange={(e) => setEditType(e.target.value as RoomType)} className="w-32">
                    <option value="umumiy">Umumiy zal</option>
                    <option value="vip">VIP xona</option>
                  </Select>
                  <Input required type="number" min={0} value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-28" />
                  <Button onClick={() => saveEdit(r._id)}>Saqlash</Button>
                  <Button variant="secondary" onClick={() => setEditingId(null)}>Bekor</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>
                    <strong>{r.name}</strong> · <Badge tone={r.type === 'vip' ? 'warning' : 'default'}>{roomTypeLabel[r.type]}</Badge>{' '}
                    · <span className="text-[var(--muted)]">{r.pricePerHour.toLocaleString()} so&apos;m/soat</span>
                  </span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEdit(r)} className="font-medium text-[var(--primary)] hover:underline">
                      Tahrir
                    </button>
                    <button type="button" onClick={() => removeRoom(r._id)} className="font-medium text-[var(--danger)] hover:underline">
                      O&apos;chirish
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function PcsManager({ rooms }: { rooms: Room[] }) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?._id ?? '');
  const [pcs, setPcs] = useState<Pc[] | null>(null);
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  function load() {
    if (!selectedRoomId) return;
    api.get<Pc[]>(`/pcs?room=${selectedRoomId}`).then(setPcs).catch(() => setPcs([]));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [selectedRoomId]);

  useEffect(() => {
    if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0]._id);
    }
  }, [rooms, selectedRoomId]);

  async function addPc(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/pcs', { room: selectedRoomId, label, specs: {} });
      setLabel('');
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Qo&apos;shilmadi');
    }
  }

  async function setStatus(id: string, status: Pc['status']) {
    try {
      await api.patch(`/pcs/${id}`, { status });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Holat o&apos;zgarmadi');
    }
  }

  async function removePc(id: string) {
    try {
      await api.delete(`/pcs/${id}`);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'O&apos;chirilmadi');
    }
  }

  if (rooms.length === 0) return null;

  return (
    <Card className="mb-6">
      <h2 className="mb-4 font-semibold text-[var(--foreground)]">Kompyuterlar</h2>
      <ErrorText>{error}</ErrorText>

      <div className="mb-4 max-w-sm">
        <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">Xonani tanlang:</label>
        <Select value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)}>
          {rooms.map((r) => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </Select>
      </div>

      <form onSubmit={addPc} className="mb-4 flex items-end gap-2">
        <div className="w-40">
          <Input required placeholder="PC Nomi (masalan, PC-01)" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <Button type="submit">Qo&apos;shish</Button>
      </form>

      {!pcs ? (
        <Spinner />
      ) : pcs.length === 0 ? (
        <EmptyState title="Bu xonada PC yo'q" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {pcs.map((pc) => (
            <div key={pc._id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-semibold text-[var(--foreground)]">{pc.label}</span>
                <button type="button" onClick={() => removePc(pc._id)} className="text-xs font-medium text-[var(--danger)] hover:underline">
                  O&apos;chirish
                </button>
              </div>
              <div className="mt-2">
                <Select value={pc.status} onChange={(e) => setStatus(pc._id, e.target.value as Pc['status'])}>
                  <option value="bosh">Bo&apos;sh</option>
                  <option value="band">Band</option>
                  <option value="texnik_xizmat">Texnik xizmat</option>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function SnacksManager({ clubId }: { clubId: string }) {
  const [snacks, setSnacks] = useState<Snack[] | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  function load() {
    api.get<Snack[]>(`/snacks?club=${clubId}`).then(setSnacks).catch(() => setSnacks([]));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [clubId]);

  async function addSnack(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/snacks', { club: clubId, name, price: Number(price) });
      setName('');
      setPrice('');
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Qo&apos;shilmadi');
    }
  }

  async function toggleAvail(id: string, isAvailable: boolean) {
    try {
      await api.patch(`/snacks/${id}`, { isAvailable: !isAvailable });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'O&apos;zgarmadi');
    }
  }

  async function removeSnack(id: string) {
    try {
      await api.delete(`/snacks/${id}`);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'O&apos;chirilmadi');
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="mb-4 font-semibold text-[var(--foreground)]">Snack / Ichimliklar</h2>
      <ErrorText>{error}</ErrorText>

      <form onSubmit={addSnack} className="mb-4 flex items-end gap-2">
        <div className="flex-1 max-w-[200px]">
          <Input required placeholder="Nomi (Cola 0.5)" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="w-28">
          <Input required type="number" min={0} placeholder="Narxi" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <Button type="submit">Qo&apos;shish</Button>
      </form>

      {!snacks ? (
        <Spinner />
      ) : snacks.length === 0 ? (
        <EmptyState title="Mahsulotlar yo'q" />
      ) : (
        <ul className="space-y-2">
          {snacks.map((s) => (
            <li key={s._id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
              <span className={s.isAvailable ? 'text-[var(--foreground)]' : 'text-[var(--muted)] line-through'}>
                <strong>{s.name}</strong> · {s.price.toLocaleString()} so&apos;m
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs text-[var(--muted)]">
                  <input type="checkbox" checked={s.isAvailable} onChange={() => toggleAvail(s._id, s.isAvailable)} />
                  Bor
                </label>
                <button type="button" onClick={() => removeSnack(s._id)} className="font-medium text-[var(--danger)] hover:underline">
                  O&apos;chirish
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function OwnerClubContent({ id }: { id: string }) {
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Club>(`/clubs/${id}`)
      .then(setClub)
      .catch(() => setError('Klub topilmadi'));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <EmptyState title={error} />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4">
        <button onClick={() => router.push('/owner')} className="flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
          <ChevronRight size={16} className="rotate-180" /> Orqaga
        </button>
      </div>

      <PageHeader title={club.name} subtitle="Klub sozlamalari, xonalar va kompyuterlarni boshqarish" />

      <ClubInfoForm club={club} />
      <RoomsManager clubId={club._id} onRoomsChange={setRooms} />
      <PcsManager rooms={rooms} />
      <SnacksManager clubId={club._id} />
    </div>
  );
}

export default function OwnerClubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RequireRole roles={['clubOwner']}>
      <OwnerClubContent id={id} />
    </RequireRole>
  );
}
