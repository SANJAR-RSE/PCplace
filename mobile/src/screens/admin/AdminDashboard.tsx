import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { api } from '../../api';
import { theme } from '../../theme';
import { Users, Gamepad2, Calendar, TrendingUp } from 'lucide-react-native';

type Stats = {
  totalUsers: number;
  totalClubs: number;
  totalOwners: number;
  totalBookings: number;
  pendingClubs?: number;
};

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.get<Stats>('/admins/stats');
      setStats(data);
    } catch { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchStats(); }} tintColor={theme.colors.primary} />}
    >
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Tizim statistikasi</Text>

      <View style={styles.grid}>
        <StatCard icon={<Users size={22} color={theme.colors.primary} />} label="Foydalanuvchilar" value={stats?.totalUsers ?? 0} color={theme.colors.primary} />
        <StatCard icon={<Gamepad2 size={22} color={theme.colors.accent} />} label="Klublar" value={stats?.totalClubs ?? 0} color={theme.colors.accent} />
        <StatCard icon={<TrendingUp size={22} color="#f59e0b" />} label="Klub Egalari" value={stats?.totalOwners ?? 0} color="#f59e0b" />
        <StatCard icon={<Calendar size={22} color="#a78bfa" />} label="Barcha Bronlar" value={stats?.totalBookings ?? 0} color="#a78bfa" />
      </View>

      {stats?.pendingClubs ? (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>⚠️ {stats.pendingClubs} ta klub tasdiqlashni kutmoqda</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <View style={[styles.statCard, { borderColor: color + '30' }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>{icon}</View>
      <Text style={[styles.statValue, { color }]}>{value.toLocaleString()}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: theme.colors.text },
  subtitle: { color: theme.colors.textMuted, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', backgroundColor: theme.colors.surface, borderWidth: 1,
    borderRadius: 16, padding: 16, alignItems: 'center', gap: 8,
  },
  statIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '900' },
  statLabel: { color: theme.colors.textMuted, fontSize: 13, textAlign: 'center' },
  alertBox: {
    backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 12, padding: 14,
  },
  alertText: { color: '#f59e0b', fontSize: 14, fontWeight: '600' },
});
