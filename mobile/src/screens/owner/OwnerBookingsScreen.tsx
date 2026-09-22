import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  RefreshControl, Alert, TouchableOpacity,
} from 'react-native';
import { api } from '../../api';
import { theme } from '../../theme';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react-native';

type Booking = {
  _id: string;
  club: { name: string } | string;
  user: { fullName?: string; email: string } | string;
  room: { name: string } | string;
  pc: { label: string } | string;
  hours: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  startTime: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', confirmed: theme.colors.accent,
  completed: theme.colors.textMuted, cancelled: theme.colors.danger,
};
const STATUS_LABELS: Record<string, string> = {
  pending: 'Kutilmoqda', confirmed: 'Tasdiqlandi',
  completed: 'Tugallandi', cancelled: 'Bekor qilindi',
};

export function OwnerBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await api.get<Booking[]>('/bookings/incoming');
      setBookings(data);
    } catch (err: any) {
      Alert.alert('Xatolik', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function handleAction(id: string, action: 'confirm' | 'complete' | 'cancel-by-owner') {
    try {
      await api.patch(`/bookings/${id}/${action}`);
      fetchBookings();
    } catch (err: any) { Alert.alert('Xatolik', err.message); }
  }

  function renderBooking({ item }: { item: Booking }) {
    const sc = STATUS_COLORS[item.status];
    const userName = typeof item.user === 'object' ? (item.user.fullName || item.user.email) : '';
    const roomName = typeof item.room === 'object' ? item.room.name : '';
    const pcLabel = typeof item.pc === 'object' ? item.pc.label : '';
    const date = new Date(item.startTime).toLocaleString('uz-UZ', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.userName}>{userName}</Text>
          <View style={[styles.badge, { borderColor: sc + '50', backgroundColor: sc + '15' }]}>
            <Text style={[styles.badgeText, { color: sc }]}>{STATUS_LABELS[item.status]}</Text>
          </View>
        </View>

        <View style={styles.details}>
          {roomName ? <Text style={styles.detail}>🏠 {roomName}</Text> : null}
          {pcLabel ? <Text style={styles.detail}>💻 {pcLabel}</Text> : null}
          <Text style={styles.detail}>🕐 {date} · {item.hours} soat</Text>
          <Text style={styles.price}>{item.totalPrice.toLocaleString()} so'm</Text>
        </View>

        {item.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.confirmBtn} onPress={() => handleAction(item._id, 'confirm')}>
              <CheckCircle size={14} color={theme.colors.accent} />
              <Text style={[styles.actionText, { color: theme.colors.accent }]}>Tasdiqlash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => handleAction(item._id, 'cancel-by-owner')}>
              <XCircle size={14} color={theme.colors.danger} />
              <Text style={[styles.actionText, { color: theme.colors.danger }]}>Rad etish</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'confirmed' && (
          <TouchableOpacity style={styles.completeBtn} onPress={() => handleAction(item._id, 'complete')}>
            <CheckCircle size={14} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.primary }]}>Tugallandi</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;

  const pending = bookings.filter(b => b.status === 'pending').length;

  return (
    <FlatList
      style={styles.container}
      data={bookings}
      keyExtractor={b => b._id}
      renderItem={renderBooking}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBookings(); }} tintColor={theme.colors.primary} />}
      ListHeaderComponent={
        pending > 0 ? (
          <View style={styles.alertBox}>
            <AlertCircle size={16} color="#f59e0b" />
            <Text style={styles.alertText}>{pending} ta yangi bron kutilmoqda</Text>
          </View>
        ) : null
      }
      ListEmptyComponent={<View style={styles.center}><Text style={styles.empty}>Bronlar yo'q</Text></View>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  list: { padding: 16, gap: 12 },
  alertBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
    backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 12, padding: 12,
  },
  alertText: { color: '#f59e0b', fontSize: 14, fontWeight: '600' },
  card: {
    backgroundColor: theme.colors.surface, borderWidth: 1,
    borderColor: theme.colors.border, borderRadius: 14, padding: 14, gap: 10,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userName: { flex: 1, fontSize: 16, fontWeight: '800', color: theme.colors.text, marginRight: 8 },
  badge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  details: { gap: 4 },
  detail: { color: theme.colors.textMuted, fontSize: 13 },
  price: { color: theme.colors.primary, fontSize: 15, fontWeight: '800', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center',
    backgroundColor: 'rgba(0,255,136,0.1)', borderWidth: 1, borderColor: 'rgba(0,255,136,0.3)',
    borderRadius: 10, paddingVertical: 10,
  },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 10, paddingVertical: 10,
  },
  completeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center',
    backgroundColor: 'rgba(168,85,247,0.1)', borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)',
    borderRadius: 10, paddingVertical: 10,
  },
  actionText: { fontSize: 14, fontWeight: '700' },
  empty: { color: theme.colors.textMuted, fontSize: 16 },
});
