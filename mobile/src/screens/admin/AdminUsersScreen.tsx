import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  RefreshControl, TouchableOpacity, Alert,
} from 'react-native';
import { api } from '../../api';
import { theme } from '../../theme';
import { User } from 'lucide-react-native';

type AppUser = {
  _id: string;
  fullName?: string;
  email: string;
  phone?: string;
  plan?: string;
  createdAt?: string;
};

export function AdminUsersScreen() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.get<AppUser[]>('/users');
      setUsers(data);
    } catch (err: any) {
      Alert.alert('Xatolik', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleDelete(id: string, name: string) {
    Alert.alert(`${name} ni o'chirish`, 'Haqiqatan ham o\'chirmoqchimisiz?', [
      { text: 'Bekor qilish', style: 'cancel' },
      {
        text: "O'chirish", style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/users/${id}`);
            setUsers(u => u.filter(x => x._id !== id));
          } catch (err: any) { Alert.alert('Xatolik', err.message); }
        }
      }
    ]);
  }

  function renderUser({ item }: { item: AppUser }) {
    const initials = (item.fullName || item.email).slice(0, 2).toUpperCase();
    const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('uz-UZ') : '';
    return (
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.fullName || 'Noma\'lum'}</Text>
          <Text style={styles.email}>{item.email}</Text>
          {item.phone ? <Text style={styles.sub}>{item.phone}</Text> : null}
          {date ? <Text style={styles.sub}>Qo'shilgan: {date}</Text> : null}
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item._id, item.fullName || item.email)}
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;

  return (
    <FlatList
      style={styles.container}
      data={users}
      keyExtractor={u => u._id}
      renderItem={renderUser}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} tintColor={theme.colors.primary} />}
      ListHeaderComponent={<Text style={styles.count}>{users.length} ta foydalanuvchi</Text>}
      ListEmptyComponent={<View style={styles.center}><Text style={styles.empty}>Foydalanuvchi yo'q</Text></View>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  list: { padding: 16, gap: 10 },
  count: { color: theme.colors.textMuted, fontSize: 13, marginBottom: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.surface, borderWidth: 1,
    borderColor: theme.colors.border, borderRadius: 14, padding: 12, gap: 12,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(168,85,247,0.15)', borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: theme.colors.primary, fontWeight: '800', fontSize: 16 },
  info: { flex: 1 },
  name: { color: theme.colors.text, fontWeight: '700', fontSize: 15 },
  email: { color: theme.colors.textMuted, fontSize: 13 },
  sub: { color: theme.colors.textMuted, fontSize: 12 },
  deleteBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: 'rgba(239,68,68,0.1)', justifyContent: 'center', alignItems: 'center',
  },
  deleteBtnText: { color: theme.colors.danger, fontWeight: '700' },
  empty: { color: theme.colors.textMuted, fontSize: 16 },
});
