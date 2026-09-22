import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { api } from '../api';
import { theme } from '../theme';
import { Search, MapPin, Star, Zap } from 'lucide-react-native';

type Club = {
  _id: string;
  name: string;
  address: string;
  description?: string;
  pricePerHour: number;
  rating?: number;
  isPromoted?: boolean;
  status?: string;
};

type Props = {
  onSelectClub: (club: Club) => void;
};

export function ClubsScreen({ onSelectClub }: Props) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchClubs = useCallback(async () => {
    try {
      setError('');
      const data = await api.get<Club[]>('/clubs');
      const sorted = [...data].sort((a, b) => Number(b.isPromoted) - Number(a.isPromoted));
      setClubs(sorted);
    } catch (err: any) {
      setError(err.message || "Klublarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchClubs(); }, [fetchClubs]);

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  function renderClub({ item }: { item: Club }) {
    return (
      <TouchableOpacity style={styles.card} onPress={() => onSelectClub(item)} activeOpacity={0.8}>
        {item.isPromoted && (
          <View style={styles.promotedBadge}>
            <Zap size={10} color={theme.colors.accent} />
            <Text style={styles.promotedText}>Promoted</Text>
          </View>
        )}
        <View style={styles.cardHeader}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          {item.rating ? (
            <View style={styles.ratingRow}>
              <Star size={12} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.addressRow}>
          <MapPin size={13} color={theme.colors.textMuted} />
          <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
        </View>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        ) : null}
        <View style={styles.cardFooter}>
          <Text style={styles.price}>
            {item.pricePerHour.toLocaleString()} so'm<Text style={styles.perHour}>/soat</Text>
          </Text>
          <View style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>Bron qilish →</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={16} color={theme.colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Klub nomi yoki manzil..."
          placeholderTextColor={theme.colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchClubs} style={styles.retryBtn}>
            <Text style={styles.retryText}>Qayta urinish</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={renderClub}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchClubs(); }}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {search ? "Hech narsa topilmadi" : "Hozircha klublar yo'q"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: theme.colors.border,
    margin: 16, paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: theme.colors.text, fontSize: 15, paddingVertical: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: theme.colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: theme.colors.border,
    padding: 16, marginBottom: 12,
  },
  promotedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,255,136,0.3)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    marginBottom: 8,
  },
  promotedText: { color: theme.colors.accent, fontSize: 11, fontWeight: '700' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { flex: 1, fontSize: 17, fontWeight: '800', color: theme.colors.text, marginRight: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { color: '#fbbf24', fontSize: 13, fontWeight: '600' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  address: { color: theme.colors.textMuted, fontSize: 13, flex: 1 },
  description: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { color: theme.colors.primary, fontSize: 16, fontWeight: '800' },
  perHour: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '400' },
  bookBtn: {
    backgroundColor: 'rgba(168,85,247,0.12)',
    borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  bookBtnText: { color: theme.colors.primary, fontSize: 13, fontWeight: '700' },
  errorBox: { margin: 16, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, padding: 16, alignItems: 'center' },
  errorText: { color: theme.colors.danger, marginBottom: 10 },
  retryBtn: { backgroundColor: theme.colors.surface, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  retryText: { color: theme.colors.text, fontWeight: '600' },
  emptyText: { color: theme.colors.textMuted, fontSize: 16 },
});
