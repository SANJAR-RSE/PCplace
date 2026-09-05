'use client';

import { FormEvent, use, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { RequireRole } from '@/components/require-role';
import { api, ApiError } from '@/lib/api';
import { Badge, Button, Card, EmptyState, ErrorText, Field, Input, PageHeader, Select, Spinner } from '@/components/ui';
import type { Club, Pc, PcStatus, Room, RoomType, Snack } from '@/types';

const roomTypeLabel: Record<RoomType, string> = { vip: 'VIP xona', umumiy: 'Umumiy zal' };
const pcStatusLabel: Record<PcStatus, string> = { bosh: 'Bo‘sh', band: 'Band', texnik_xizmat: 'Texnik xizmat' };

function ClubInfoForm({ club, onSaved }: { club: Club; onSaved: (c: Club) => void }) {
  const [name, setName] = useState(club.name);
  const [address, setAddress] = useState(club.address);
  const [lat, setLat] = useState(String(club.location.lat));
  const [lng, setLng] = useState(String(club.location.lng));
  const [imageUrl, setImageUrl] = useState(club.imageUrl ?? '');
  const [msg, setMsg] = useState('');
  const [msgOk, setMsgOk] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const updated = await api.patch<Club>(`/clubs/${club._id}`, {
        name,
        address,
        location: { lat: Number(lat), lng: Number(lng) },
        imageUrl: imageUrl || undefined,
      });
      onSaved(updated);
      setMsgOk(true);
      setMsg('Saqlandi');
    } catch (err) {
      setMsgOk(false);
      setMsg(err instanceof ApiError ? err.message : 'Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-3 font-semibold">Klub ma&apos;lumotlari</h2>
      <form onSubmit={submit}>
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
        <Button type="submit" disabled={saving}>
          {saving ? 'Saqlanmoqda…' : 'Saqlash'}
        </Button>
        {msg && (
          <span className="ml-3 inline-flex items-center gap-1 text-sm text-muted">
            {msgOk && <CheckCircle2 size={14} className="text-emerald-600" />}
            {msg}
          </span>
        )}
      </form>
    </Card>
  );
}

function RoomsManager({ clubId }: { clubId: string }) {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<RoomType>('umumiy');
  const [price, setPrice] = useState('20000');
  const [error, setError] = useState('');

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
      setError(err instanceof ApiError ? err.message : 'Xona qo‘shilmadi');
    }
  }

  async function removeRoom(id: string) {
    try {
      await api.delete(`/rooms/${id}`);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'O‘chirib bo‘lmadi');
    }
  }

  return (
    <Card>
      <h2 className="mb-3 font-semibold">Xonalar</h2>
      <ErrorText>{error}</ErrorText>
      <form onSubmit={addRoom} className="mb-4 flex flex-wrap items-end gap-2">
        <div className="w-40">
          <Input required placeholder="Xona nomi" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="w-36">
          <Select value={type} onChange={(e) => setType(e.target.value as RoomType)}>
            <option value="umumiy">Umumiy zal</option>
            <option value="vip">VIP xona</option>
          </Select>
        </div>
        <div className="w-32">
          <Input required type="number" min={0} placeholder="so'm/soat" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <Button type="submit">Qo&apos;shish</Button>
      </form>

      {rooms === null ? (
        <Spinner />
      ) : rooms.length === 0 ? (
        <EmptyState title="Xonalar qo'shilmagan" />
      ) : (
        <ul className="space-y-2">
          {rooms.map((r) => (
            <li key={r._id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
              <span>
                <strong>{r.name}</strong> · <Badge tone={r.type === 'vip' ? 'warning' : 'default'}>{roomTypeLabel[r.type]}</Badge>{' '}
                · {r.pricePerHour.toLocaleString()} so&apos;m/soat
              </span>
              <Button variant="danger" onClick={() => removeRoom(r._id)}>
                O&apos;chirish
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function PcsManager({ clubId }: { clubId: string }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState('');
  const [pcs, setPcs] = useState<Pc[] | null>(null);
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Room[]>(`/rooms?club=${clubId}`).then((list) => {
      setRooms(list);
      if (list.length > 0) setRoomId(list[0]._id);
    });
  }, [clubId]);

  function loadPcs(rid: string) {
    if (!rid) return;
    api.get<Pc[]>(`/pcs?room=${rid}`).then(setPcs).catch(() => setPcs([]));
  }
  useEffect(() => loadPcs(roomId), [roomId]);

  async function addPc(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/pcs', { club: clubId, room: roomId, label });
      setLabel('');
      loadPcs(roomId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'PC qo‘shilmadi');
    }
  }

  async function setStatus(pc: Pc, status: PcStatus) {
    try {
      await api.patch(`/pcs/${pc._id}`, { status });
      loadPcs(roomId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Yangilanmadi');
    }
  }

  async function removePc(id: string) {
    try {
      await api.delete(`/pcs/${id}`);
      loadPcs(roomId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'O‘chirib bo‘lmadi');
    }
  }

  return (
    <Card>
      <h2 className="mb-3 font-semibold">Kompyuterlar (PC)</h2>
      {rooms.length === 0 ? (
        <EmptyState title="Avval xona qo'shing" hint="PC qo'shish uchun kamida bitta xona kerak." />
      ) : (
        <>
          <div className="mb-4 max-w-xs">
            <Select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              {rooms.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </Select>
          </div>

          <ErrorText>{error}</ErrorText>
          <form onSubmit={addPc} className="mb-4 flex items-end gap-2">
            <div className="w-40">
              <Input required placeholder="Masalan PC-01" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <Button type="submit">Qo&apos;shish</Button>
          </form>

          {pcs === null ? (
            <Spinner />
          ) : pcs.length === 0 ? (
            <EmptyState title="Bu xonada PC yo'q" />
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {pcs.map((pc) => (
                <div key={pc._id} className="rounded-lg border border-border p-2 text-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{pc.label}</span>
                    <Button variant="ghost" className="px-1.5 py-0.5 text-red-500" onClick={() => removePc(pc._id)}>
                      <X size={14} />
                    </Button>
                  </div>
                  <Select value={pc.status} onChange={(e) => setStatus(pc, e.target.value as PcStatus)} className="py-1 text-xs">
                    {(Object.keys(pcStatusLabel) as PcStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {pcStatusLabel[s]}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function SnacksManager({ clubId }: { clubId: string }) {
  const [snacks, setSnacks] = useState<Snack[] | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('10000');
  const [error, setError] = useState('');

  function load() {
    api.get<Snack[]>(`/snacks/mine?club=${clubId}`).then(setSnacks).catch(() => setSnacks([]));
  }
  useEffect(load, [clubId]);

  async function addSnack(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/snacks', { club: clubId, name, price: Number(price) });
      setName('');
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Qo‘shilmadi');
    }
  }

  async function toggleAvailable(snack: Snack) {
    try {
      await api.patch(`/snacks/${snack._id}`, { isAvailable: !snack.isAvailable });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Yangilanmadi');
    }
  }

  async function removeSnack(id: string) {
    try {
      await api.delete(`/snacks/${id}`);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'O‘chirib bo‘lmadi');
    }
  }

  return (
    <Card>
      <h2 className="mb-3 font-semibold">Snacks / qo&apos;shimcha xizmatlar</h2>
      <ErrorText>{error}</ErrorText>
      <form onSubmit={addSnack} className="mb-4 flex items-end gap-2">
        <div className="w-40">
          <Input required placeholder="Masalan Lays" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="w-32">
          <Input required type="number" min={0} placeholder="narxi" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <Button type="submit">Qo&apos;shish</Button>
      </form>

      {snacks === null ? (
        <Spinner />
      ) : snacks.length === 0 ? (
        <EmptyState title="Mahsulotlar qo'shilmagan" />
      ) : (
        <ul className="space-y-2">
          {snacks.map((s) => (
            <li key={s._id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
              <span>
                {s.name} · {s.price.toLocaleString()} so&apos;m{' '}
                <Badge tone={s.isAvailable ? 'success' : 'default'}>{s.isAvailable ? 'faol' : 'o‘chirilgan'}</Badge>
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => toggleAvailable(s)}>
                  {s.isAvailable ? 'O‘chirish' : 'Yoqish'}
                </Button>
                <Button variant="danger" onClick={() => removeSnack(s._id)}>
                  O&apos;chirish
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function ClubManageContent({ id }: { id: string }) {
  const [club, setClub] = useState<Club | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get<Club>(`/clubs/${id}`)
      .then(setClub)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <EmptyState title="Klub topilmadi" />;
  if (!club) return <Spinner />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <PageHeader title={club.name} subtitle="Klub, xona, PC va snacklarni shu yerdan boshqaring." />
      <ClubInfoForm club={club} onSaved={setClub} />
      <RoomsManager clubId={id} />
      <PcsManager clubId={id} />
      <SnacksManager clubId={id} />
    </div>
  );
}

export default function OwnerClubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RequireRole roles={['clubOwner']}>
      <ClubManageContent id={id} />
    </RequireRole>
  );
}
