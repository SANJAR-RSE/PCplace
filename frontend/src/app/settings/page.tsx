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
  light: "Yorug' interfeys faol",
  dark: "Qorong'i interfeys faol",
  system: 'Qurilma mavzusiga avtomatik moslashadi',
};

function SectionIcon({ icon: Icon, color }: { icon: typeof Sun; color: string }) {
  return (
    <div className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}>
      <Icon size={20} />
    </div>
  );
}

function SettingsContent() {
  const { theme } = useTheme();
  const { user, refreshMe } = useAuth();
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
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
      setSaveMsg("Ma'lumotlar saqlandi");
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
      <PageHeader title="Sozlamalar" subtitle="Ilova ko'rinishini o'zingizga qulay qilib moslang." />

      <div className="grid max-w-2xl gap-5">
        {/* Account info */}
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-4">
            <SectionIcon icon={UserRound} color="bg-[var(--primary)]/10 text-[var(--primary)]" />
            <div>
              <h2 className="font-bold text-[var(--foreground)]">Akkaunt ma&apos;lumotlari</h2>
              <p className="mt-0.5 text-sm text-[var(--muted)]">Ism va telefon raqamingizni yangilang.</p>
            </div>
          </div>
          <form onSubmit={saveProfile} className="max-w-lg">
            <Field label="To'liq ism">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Field>
            <Field label="Telefon">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
            </Field>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saqlanmoqda…' : 'Saqlash'}
            </Button>
            {saveMsg && (
              <p className={`mt-3 flex items-center gap-1.5 text-sm ${saveOk ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}`}>
                {saveOk && <CheckCircle2 size={16} />}
                {saveMsg}
              </p>
            )}
          </form>
        </Card>

        {/* Telegram bot */}
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-4">
            <SectionIcon icon={Link2} color="bg-[#38bdf8]/10 text-[#38bdf8]" />
            <div>
              <h2 className="font-bold text-[var(--foreground)]">Telegram bot</h2>
              <p className="mt-0.5 text-sm text-[var(--muted)]">Bronlar haqida tezkor xabarlar olish uchun akkauntingizni ulang.</p>
            </div>
          </div>

          {user?.telegramId ? (
            <div className="flex items-center gap-2 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/8 px-4 py-3 text-sm font-medium text-[var(--accent)]">
              <CheckCircle2 size={17} /> Telegram akkaunt bog&apos;langan
            </div>
          ) : (
            <>
              <Button onClick={getBotCode} disabled={botLoading} variant="secondary">
                {botLoading ? 'Yaratilmoqda…' : 'Ulanish kodini olish'}
              </Button>
              <ErrorText>{botError}</ErrorText>
              {botCode && (
                <div className="mt-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-5 text-center">
                  <p className="font-mono text-3xl font-black tracking-[.22em] text-[var(--primary)] text-glow-primary">
                    {botCode.code}
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    Bu kodni Telegram botga yuboring. {botCode.expiresInMinutes} daqiqa amal qiladi.
                  </p>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Theme */}
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-4">
            <SectionIcon icon={Palette} color="bg-amber-500/10 text-amber-400" />
            <div>
              <h2 className="font-bold text-[var(--foreground)]">Interfeys mavzusi</h2>
              <p className="mt-0.5 text-sm text-[var(--muted)]">Yorug&apos;, qorong&apos;i yoki qurilma sozlamasini tanlang.</p>
            </div>
          </div>

          <ThemeSwitcher />

          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-sm text-[var(--muted)]">
            <ThemeIcon size={16} className="shrink-0 text-[var(--primary)]" />
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
