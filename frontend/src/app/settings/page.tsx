'use client';

import { CheckCircle2, Link2, Monitor, Moon, Palette, Sun, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { Button, Card, ErrorText, Field, Input, PageHeader } from '@/components/ui';

const themeDescription = {
  light: 'Yorug\' interfeys faol',
  dark: 'Qorong\'i interfeys faol',
  system: 'Qurilma mavzusiga avtomatik moslashadi',
};

function SettingsContent() {
  const { theme } = useTheme();
  const { user, refreshMe } = useAuth();
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saveMsg, setSaveMsg] = useState('');
  const [saveOk, setSaveOk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [botCode, setBotCode] = useState<{ code: string; expiresInMinutes: number } | null>(null);
  const [botLoading, setBotLoading] = useState(false);
  const [botError, setBotError] = useState('');

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSaveMsg('');
    setSaving(true);
    try {
      await api.patch('/users/me', { fullName, phone: phone || undefined });
      await refreshMe();
      setSaveOk(true);
      setSaveMsg('Ma’lumotlar saqlandi');
    } catch (err) {
      setSaveOk(false);
      setSaveMsg(err instanceof ApiError ? err.message : 'Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  }

  async function getBotCode() {
    setBotError('');
    setBotLoading(true);
    try {
      setBotCode(await api.post<{ code: string; expiresInMinutes: number }>('/auth/bot-code'));
    } catch (err) {
      setBotError(err instanceof ApiError ? err.message : 'Kod yaratilmadi');
    } finally {
      setBotLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader title="Sozlamalar" subtitle="Ilova ko‘rinishini o‘zingizga qulay qilib moslang." />
      <div className="grid max-w-2xl gap-5">
        <Card className="p-6 sm:p-7">
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <UserRound size={23} />
            </div>
            <div>
              <h2 className="font-bold">Akkaunt ma’lumotlari</h2>
              <p className="mt-1 text-sm text-muted">Ism va telefon raqamingizni yangilang.</p>
            </div>
          </div>
          <form onSubmit={saveProfile} className="max-w-lg">
            <Field label="To‘liq ism">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Field>
            <Field label="Telefon">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
            </Field>
            <Button type="submit" disabled={saving}>{saving ? 'Saqlanmoqda…' : 'Saqlash'}</Button>
            {saveMsg && <p className={`mt-3 flex items-center gap-1.5 text-sm ${saveOk ? 'text-emerald-600' : 'text-red-600'}`}>{saveOk && <CheckCircle2 size={16} />}{saveMsg}</p>}
          </form>
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent">
              <Link2 size={23} />
            </div>
            <div>
              <h2 className="font-bold">Telegram bot</h2>
              <p className="mt-1 text-sm text-muted">Bronlar haqida tezkor xabarlar olish uchun akkauntingizni ulang.</p>
            </div>
          </div>
          {user?.telegramId ? (
            <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3.5 py-3 text-sm font-medium text-emerald-600"><CheckCircle2 size={17} /> Telegram akkaunt bog‘langan</p>
          ) : (
            <>
              <Button onClick={getBotCode} disabled={botLoading} variant="secondary">{botLoading ? 'Yaratilmoqda…' : 'Ulanish kodini olish'}</Button>
              <ErrorText>{botError}</ErrorText>
              {botCode && <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-4 text-center"><p className="text-3xl font-extrabold tracking-[.22em] text-primary">{botCode.code}</p><p className="mt-2 text-xs text-muted">Bu kodni Telegram botga yuboring. {botCode.expiresInMinutes} daqiqa amal qiladi.</p></div>}
            </>
          )}
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="mb-6 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Palette size={23} />
          </div>
          <div>
            <h2 className="font-bold">Interfeys mavzusi</h2>
            <p className="mt-1 text-sm text-muted">Yorug‘, qorong‘i yoki qurilma sozlamasini tanlang.</p>
          </div>
        </div>

        <ThemeSwitcher />

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-border/70 bg-slate-50/70 px-3.5 py-3 text-sm text-muted">
          <Icon size={16} className="shrink-0 text-primary" />
          {themeDescription[theme]}
        </div>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RequireRole roles={['user', 'clubOwner', 'admin']}>
      <SettingsContent />
    </RequireRole>
  );
}
