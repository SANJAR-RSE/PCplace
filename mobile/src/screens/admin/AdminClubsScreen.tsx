import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  RefreshControl, TouchableOpacity, Alert,
} from 'react-native';
import { api } from '../../api';
import { theme } from '../../theme';
import { CheckCircle, Clock, XCircle } from 'lucide-react-native';

type Club = {
  _id: string; name: string; address: string;
  status: 'pending' | 'approved' | 'blocked';
  owner?: { fullName?: string; email?: string } | string;
  createdAt?: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Kutilmoqda', approved: 'Tasdiqlangan', blocked: 'Bloklangan',
};
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', approved: theme.colors.accent, blocked: theme.colors.danger,
};

export function AdminClubsScreen() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClubs = useCallback(async () => {
    try {
      const data = await api.get<Club[]>('/clubs/all');
      setClubs(data);
    } catch (err: any) {
      Alert.alert('Xatolik', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchClubs(); }, [fetchClubs]);

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch(`/clubs/${id}/status`, { status });
      fetchClubs();
    } catch (err: any) { Alert.alert('Xatolik', err.message); }
  }

  function renderClub({ item }: { item: Club }) {
    const sc = STATUS_COLORS[item.status];
    const ownerName = typeof item.owner === 'object'
      ? (item.owner?.fullName || item.owner?.email)
      : '';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.clubName} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.badge, { borderColor: sc + '50', backgroundColor: sc + '15' }]}>
            <Text style={[styles.badgeText, { color: sc }]}>{STATUS_LABELS[item.status]}</Text>
          </View>
        </View>
        <Text style={styles.address}>{item.address}</Text>
        {ownerName ? <Text style={styles.owner}>Egasi: {ownerName}</Text> : null}

        <View style={styles.actions}>
          {item.status !== 'approved' && (
            <TouchableOpacity style={styles.approveBtn} onPress={() => updateStatus(item._id, 'approved')}>
              <CheckCircle size={14} color={theme.colors.accent} />
              <Text style={[styles.actionText, { color: theme.colors.accent }]}>Tasdiqlash</Text>
            </TouchableOpacity>
          )}
          {item.status !== 'blocked' && (
            <TouchableOpacity style={styles.blockBtn} onPress={() => updateStatus(item._id, 'blocked')}>
              <XCircle size={14} color={theme.colors.danger} />
              <Text style={[styles.actionText, { color: theme.colors.danger }]}>Bloklash</Text>
            </TouchableOpacity>
          )}
          {item.status === 'blocked' && (
            <TouchableOpacity style={styles.pendingBtn} onPress={() => updateStatus(item._id, 'pending')}>
              <Clock size={14} color="#f59e0b" />
              <Text style={[styles.actionText, { color: '#f59e0b' }]}>Kutishga qaytarish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;

  const pending = clubs.filter(c => c.status === 'pending').length;

  return (
    <FlatList
      style={styles.container}
      data={clubs}
      keyExtractor={c => c._id}
      renderItem={renderClub}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchClubs(); }} tintColor={theme.colors.primary} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.count}>{clubs.length} ta klub</Text>
          {pending > 0 && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{pending} ta kutilmoqda</Text>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={<View style={styles.center}><Text style={styles.empty}>Klublar yo'q</Text></View>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  list: { padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  count: { color: theme.colors.textMuted, fontSize: 13 },
  pendingBadge: { backgroundColor: 'rgba(245,158,11,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  pendingBadgeText: { color: '#f59e0b', fontSize: 12, fontWeight: '700' },
  card: {
    backgroundColor: theme.colors.surface, borderWidth: 1,
    borderColor: theme.colors.border, borderRadius: 14, padding: 14, gap: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clubName: { flex: 1, fontSize: 16, fontWeight: '800', color: theme.colors.text, marginRight: 8 },
  badge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  address: { color: theme.colors.textMuted, fontSize: 13 },
  owner: { color: theme.colors.textMuted, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  approveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,255,136,0.1)', borderWidth: 1, borderColor: 'rgba(0,255,136,0.3)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  blockBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  pendingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  actionText: { fontSize: 13, fontWeight: '700' },
  empty: { color: theme.colors.textMuted, fontSize: 16 },
});
