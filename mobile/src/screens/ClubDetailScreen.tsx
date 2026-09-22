import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Modal, TextInput,
} from 'react-native';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { MapPin, Star, Clock, Monitor, ChevronDown } from 'lucide-react-native';

type Club = {
  _id: string; name: string; address: string;
  description?: string; pricePerHour: number;
  ratingAverage?: number; ratingCount?: number;
  isPromoted?: boolean; imageUrl?: string;
};
type Room = { _id: string; name: string; pricePerHour: number };
type Pc = { _id: string; label: string; status: string };

type Props = {
  club: Club;
  onBack: () => void;
};

export function ClubDetailScreen({ club, onBack }: Props) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pcs, setPcs] = useState<Pc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedPc, setSelectedPc] = useState<Pc | null>(null);
  const [hours, setHours] = useState('1');
  const [booking, setBooking] = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [showPcPicker, setShowPcPicker] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const data = await api.get<Room[]>(`/rooms?club=${club._id}`);
      setRooms(data);
      if (data.length > 0) {
        setSelectedRoom(data[0]);
        fetchPcs(data[0]._id);
      }
    } catch { } finally { setLoading(false); }
  }, [club._id]);

  const fetchPcs = useCallback(async (roomId: string) => {
    try {
      const data = await api.get<Pc[]>(`/pcs?room=${roomId}`);
      setPcs(data);
      const free = data.find(p => p.status === 'bosh');
      setSelectedPc(free || null);
    } catch { setPcs([]); }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  function selectRoom(room: Room) {
    setSelectedRoom(room);
    setSelectedPc(null);
    setPcs([]);
    fetchPcs(room._id);
    setShowRoomPicker(false);
  }

  async function handleBook() {
    if (!user || user.role !== 'user') {
      Alert.alert('Diqqat', 'Bron qilish uchun tizimga kiring');
      return;
    }
    if (!selectedRoom || !selectedPc) {
      Alert.alert('Xatolik', "Xona va PC ni tanlang");
      return;
    }
    const h = parseInt(hours);
    if (!h || h < 1 || h > 12) {
      Alert.alert('Xatolik', 'Soat 1 dan 12 gacha bo\'lishi kerak');
      return;
    }

    const total = selectedRoom.pricePerHour * h;
    Alert.alert(
      'Bronni tasdiqlash',
      `${selectedPc.label} — ${h} soat\nJami: ${total.toLocaleString()} so'm`,
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Tasdiqlash', onPress: async () => {
            try {
              setBooking(true);
              await api.post('/bookings', {
                club: club._id,
                room: selectedRoom._id,
                pc: selectedPc._id,
                hours: h,
                startTime: new Date().toISOString(),
              });
              Alert.alert('Muvaffaqiyatli!', 'Broningiz qabul qilindi!');
            } catch (err: any) {
              Alert.alert('Xatolik', err.message || 'Bron qilishda xatolik');
            } finally {
              setBooking(false);
            }
          }
        }
      ]
    );
  }

  const freePcs = pcs.filter(p => p.status === 'bosh');
  const totalPrice = selectedRoom ? selectedRoom.pricePerHour * (parseInt(hours) || 1) : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Orqaga</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Club Info */}
        <View style={styles.infoCard}>
          <Text style={styles.clubName}>{club.name}</Text>
          <View style={styles.row}>
            <MapPin size={14} color={theme.colors.textMuted} />
            <Text style={styles.address}>{club.address}</Text>
          </View>
          {club.ratingAverage ? (
            <View style={styles.row}>
              <Star size={14} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.rating}>{club.ratingAverage.toFixed(1)} ({club.ratingCount} ta baho)</Text>
            </View>
          ) : null}
          {club.description ? <Text style={styles.desc}>{club.description}</Text> : null}
        </View>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
        ) : user?.role === 'user' ? (
          <View style={styles.bookingCard}>
            <Text style={styles.sectionTitle}>Bron qilish</Text>

            {/* Room picker */}
            <Text style={styles.fieldLabel}>Xona</Text>
            <TouchableOpacity style={styles.picker} onPress={() => setShowRoomPicker(true)}>
              <Text style={styles.pickerText}>{selectedRoom?.name || 'Xona tanlang'}</Text>
              <ChevronDown size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>

            {/* PC picker */}
            {pcs.length > 0 && (
              <>
                <Text style={styles.fieldLabel}>PC ({freePcs.length} ta bosh)</Text>
                <TouchableOpacity
                  style={[styles.picker, !freePcs.length && styles.pickerDisabled]}
                  onPress={() => freePcs.length && setShowPcPicker(true)}
                >
                  <Text style={[styles.pickerText, !selectedPc && styles.pickerPlaceholder]}>
                    {selectedPc ? selectedPc.label : (freePcs.length ? "PC tanlang" : "Bosh PC yo'q")}
                  </Text>
                  <ChevronDown size={16} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </>
            )}

            {/* Hours */}
            <Text style={styles.fieldLabel}>Soat soni</Text>
            <View style={styles.hoursRow}>
              {[1, 2, 3, 4, 6].map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.hourBtn, hours === String(h) && styles.hourBtnActive]}
                  onPress={() => setHours(String(h))}
                >
                  <Text style={[styles.hourBtnText, hours === String(h) && styles.hourBtnTextActive]}>
                    {h}h
                  </Text>
                </TouchableOpacity>
              ))}
              <TextInput
                style={styles.hourInput}
                value={hours}
                onChangeText={setHours}
                keyboardType="numeric"
                placeholder="boshqa"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>

            {/* Total price */}
            {selectedRoom && (
              <View style={styles.totalRow}>
                <Clock size={14} color={theme.colors.textMuted} />
                <Text style={styles.totalText}>
                  Jami: <Text style={styles.totalPrice}>{totalPrice.toLocaleString()} so'm</Text>
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.bookBtn, (!selectedRoom || !selectedPc || booking) && styles.bookBtnDisabled]}
              onPress={handleBook}
              disabled={!selectedRoom || !selectedPc || booking}
            >
              {booking
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.bookBtnText}>Bron qilish</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <Monitor size={24} color={theme.colors.textMuted} />
            <Text style={styles.noBookText}>
              {rooms.length} ta xona mavjud
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Room Picker Modal */}
      <Modal visible={showRoomPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Xona tanlang</Text>
            {rooms.map(r => (
              <TouchableOpacity key={r._id} style={styles.modalItem} onPress={() => selectRoom(r)}>
                <Text style={styles.modalItemText}>{r.name}</Text>
                <Text style={styles.modalItemSub}>{r.pricePerHour.toLocaleString()} so'm/soat</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowRoomPicker(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PC Picker Modal */}
      <Modal visible={showPcPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>PC tanlang</Text>
            {freePcs.map(p => (
              <TouchableOpacity
                key={p._id}
                style={[styles.modalItem, selectedPc?._id === p._id && styles.modalItemSelected]}
                onPress={() => { setSelectedPc(p); setShowPcPicker(false); }}
              >
                <Text style={styles.modalItemText}>{p.label}</Text>
                <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>Bosh</Text></View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowPcPicker(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 16, paddingTop: 8 },
  backBtn: { alignSelf: 'flex-start' },
  backText: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' },
  scroll: { padding: 16, paddingTop: 0, gap: 16 },
  infoCard: {
    backgroundColor: theme.colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: theme.colors.border, padding: 16, gap: 8,
  },
  clubName: { fontSize: 22, fontWeight: '900', color: theme.colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  address: { color: theme.colors.textMuted, fontSize: 14, flex: 1 },
  rating: { color: '#fbbf24', fontSize: 14 },
  desc: { color: theme.colors.textMuted, fontSize: 14, lineHeight: 20 },
  noBookText: { color: theme.colors.textMuted, fontSize: 15, marginTop: 8 },
  bookingCard: {
    backgroundColor: theme.colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: theme.colors.border, padding: 16, gap: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  fieldLabel: { color: theme.colors.textMuted, fontSize: 13, fontWeight: '600' },
  picker: {
    backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: 10, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  pickerDisabled: { opacity: 0.5 },
  pickerText: { color: theme.colors.text, fontSize: 15 },
  pickerPlaceholder: { color: theme.colors.textMuted },
  hoursRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  hourBtn: {
    backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8,
  },
  hourBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  hourBtnText: { color: theme.colors.textMuted, fontWeight: '600' },
  hourBtnTextActive: { color: '#fff' },
  hourInput: {
    backgroundColor: theme.colors.surface2, borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: theme.colors.text,
    width: 70, textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(168,85,247,0.08)', borderRadius: 10, padding: 10,
  },
  totalText: { color: theme.colors.textMuted, fontSize: 14 },
  totalPrice: { color: theme.colors.primary, fontWeight: '800', fontSize: 16 },
  bookBtn: {
    backgroundColor: theme.colors.primary, borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 4,
  },
  bookBtnDisabled: { opacity: 0.5 },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: theme.colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, maxHeight: '70%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 16 },
  modalItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  modalItemSelected: { backgroundColor: 'rgba(168,85,247,0.1)', borderRadius: 8, paddingHorizontal: 8 },
  modalItemText: { color: theme.colors.text, fontSize: 16 },
  modalItemSub: { color: theme.colors.textMuted, fontSize: 13 },
  freeBadge: {
    backgroundColor: 'rgba(0,255,136,0.1)', borderWidth: 1, borderColor: 'rgba(0,255,136,0.3)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
  },
  freeBadgeText: { color: theme.colors.accent, fontSize: 11, fontWeight: '700' },
  modalClose: {
    marginTop: 16, backgroundColor: theme.colors.surface2, borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  modalCloseText: { color: theme.colors.textMuted, fontWeight: '600' },
});
