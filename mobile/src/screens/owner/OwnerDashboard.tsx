import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl,
} from 'react-native';
import { api } from '../../api';
import { theme } from '../../theme';
import { Gamepad2, Calendar, TrendingUp } from 'lucide-react-native';

type IncomingBooking = {
  _id: string;
  club: { name: string } | string;
  user: { fullName?: string; email: string } | string;
  pc: { label: string } | string;
  hours: number;
  totalPrice: number;
  status: string;
  startTime: string;
};

type Club = { _id: string; name: string; status: string };

export function OwnerDashboard() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [bookings, setBookings] = useState<IncomingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [clubsData, bookingsData] = await Promise.all([
        api.get<Club[]>('/clubs/mine'),
        api.get<IncomingBooking[]>('/bookings/incoming'),
      ]);
      setClubs(clubsData);
      setBookings(bookingsData);
    } catch { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;

  const pending = bookings.filter(b => b.status === 'pending').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const revenue = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.totalPrice, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={theme.colors.primary} />}
    >
      <Text style={styles.title}>Mening Dashboardim</Text>

      <View style={styles.grid}>
        <StatCard color={theme.colors.primary} icon={<Gamepad2 size={20} color={theme.colors.primary} />} label="Klublarim" value={clubs.length} />
        <StatCard color="#f59e0b" icon={<Calendar size={20} color="#f59e0b" />} label="Kutilmoqda" value={pending} />
        <StatCard color={theme.colors.accent} icon={<Calendar size={20} color={theme.colors.accent} />} label="Tasdiqlangan" value={confirmed} />
        <StatCard color="#a78bfa" icon={<TrendingUp size={20} color="#a78bfa" />} label="Daromad" value={revenue} isCurrency />
      </View>

      {pending > 0 && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>⏳ {pending} ta bron tasdiqlashni kutmoqda</Text>
        </View>
      )}

      {clubs.map(c => (
        <View key={c._id} style={styles.clubItem}>
          <Gamepad2 size={16} color={c.status === 'approved' ? theme.colors.accent : '#f59e0b'} />
          <Text style={styles.clubName}>{c.name}</Text>
          <Text style={[styles.clubStatus, { color: c.status === 'approved' ? theme.colors.accent : '#f59e0b' }]}>
            {c.status === 'approved' ? 'Faol' : c.status === 'pending' ? 'Kutilmoqda' : 'Bloklangan'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function StatCard({ color, icon, label, value, isCurrency }: { color: string; icon: React.ReactNode; label: string; value: number; isCurrency?: boolean }) {
  return (
    <View style={[styles.statCard, { borderColor: color + '30' }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>{icon}</View>
      <Text style={[styles.statValue, { color }]}>
        {isCurrency ? `${value.toLocaleString()} so'm` : value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: theme.colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', backgroundColor: theme.colors.surface, borderWidth: 1,
    borderRadius: 16, padding: 14, alignItems: 'center', gap: 6,
  },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', textAlign: 'center' },
  statLabel: { color: theme.colors.textMuted, fontSize: 12, textAlign: 'center' },
  alertBox: {
    backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 12, padding: 14,
  },
  alertText: { color: '#f59e0b', fontSize: 14, fontWeight: '600' },
  clubItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: 12, padding: 12,
  },
  clubName: { flex: 1, color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  clubStatus: { fontSize: 13, fontWeight: '700' },
});
