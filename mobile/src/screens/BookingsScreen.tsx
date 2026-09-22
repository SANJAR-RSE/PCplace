import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { api } from '../api';
import { theme } from '../theme';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';

type Booking = {
  _id: string;
  club: { _id: string; name: string; address: string } | string;
  room: { name: string } | string;
  pc: { label: string } | string;
  hours: number;
  startTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlandi",
  cancelled: "Bekor qilindi",
  completed: "Tugallandi",
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: theme.colors.accent,
  cancelled: theme.colors.danger,
  completed: theme.colors.textMuted,
};

function StatusIcon({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || theme.colors.textMuted;
  if (status === 'confirmed') return <CheckCircle size={16} color={c} />;
  if (status === 'cancelled') return <XCircle size={16} color={c} />;
  if (status === 'completed') return <CheckCircle size={16} color={c} />;
  return <AlertCircle size={16} color={c} />;
}

export function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await api.get<Booking[]>('/bookings/mine');
      setBookings(data);
    } catch (err: any) {
      Alert.alert('Xatolik', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function handleCancel(id: string) {
    Alert.alert('Bronni bekor qilish', 'Haqiqatan ham bekor qilmoqchimisiz?', [
      { text: 'Yo\'q', style: 'cancel' },
      {
        text: 'Ha, bekor qilish', style: 'destructive', onPress: async () => {
          try {
            await api.patch(`/bookings/${id}/cancel`);
            fetchBookings();
          } catch (err: any) {
            Alert.alert('Xatolik', err.message);
          }
        }
      }
    ]);
  }

  function renderItem({ item }: { item: Booking }) {
    const clubName = typeof item.club === 'object' ? item.club.name : 'Klub';
    const roomName = typeof item.room === 'object' ? item.room.name : '';
    const pcLabel = typeof item.pc === 'object' ? item.pc.label : '';
    const date = new Date(item.startTime).toLocaleString('uz-UZ', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.clubName} numberOfLines={1}>{clubName}</Text>
          <View style={[styles.badge, { borderColor: STATUS_COLORS[item.status] + '50' }]}>
            <StatusIcon status={item.status} />
            <Text style={[styles.badgeText, { color: STATUS_COLORS[item.status] }]}>
              {STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          {roomName ? <Text style={styles.detail}>🏠 {roomName}</Text> : null}
          {pcLabel ? <Text style={styles.detail}>💻 {pcLabel}</Text> : null}
          <View style={styles.timeRow}>
            <Clock size={13} color={theme.colors.textMuted} />
            <Text style={styles.detail}>{date} · {item.hours} soat</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>{item.totalPrice.toLocaleString()} so'm</Text>
          {item.status === 'pending' && (
            <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item._id)}>
              <Text style={styles.cancelText}>Bekor qilish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={bookings}
      keyExtractor={b => b._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBookings(); }}
          tintColor={theme.colors.primary} />
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>Hali bronlaringiz yo'q</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: theme.colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: theme.colors.border, padding: 14,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  clubName: { flex: 1, fontSize: 16, fontWeight: '800', color: theme.colors.text, marginRight: 8 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  details: { gap: 4, marginBottom: 10 },
  detail: { color: theme.colors.textMuted, fontSize: 13 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: theme.colors.primary, fontSize: 16, fontWeight: '800' },
  cancelBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  cancelText: { color: theme.colors.danger, fontSize: 13, fontWeight: '700' },
  emptyText: { color: theme.colors.textMuted, fontSize: 16 },
});
