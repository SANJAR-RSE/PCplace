import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { User, Mail, Phone, LogOut, Shield, Crown } from 'lucide-react-native';

const ROLE_LABEL: Record<string, string> = {
  user: 'Foydalanuvchi',
  admin: 'Admin',
  clubOwner: 'Klub Egasi',
};

const ROLE_COLOR: Record<string, string> = {
  user: theme.colors.primary,
  admin: '#ef4444',
  clubOwner: '#f59e0b',
};

export function ProfileScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert('Chiqish', 'Hisobdan chiqmoqchimisiz?', [
      { text: 'Bekor qilish', style: 'cancel' },
      { text: 'Chiqish', style: 'destructive', onPress: logout },
    ]);
  }

  if (!user) return null;

  const roleColor = ROLE_COLOR[user.role] || theme.colors.primary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { borderColor: roleColor + '60' }]}>
          <Text style={[styles.avatarLetter, { color: roleColor }]}>
            {(user.fullName || user.email)[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user.fullName || 'Foydalanuvchi'}</Text>
        <View style={[styles.roleBadge, { backgroundColor: roleColor + '15', borderColor: roleColor + '40' }]}>
          {user.role === 'admin' && <Shield size={12} color={roleColor} />}
          {user.role === 'clubOwner' && <Crown size={12} color={roleColor} />}
          <Text style={[styles.roleText, { color: roleColor }]}>{ROLE_LABEL[user.role]}</Text>
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Mail size={16} color={theme.colors.primary} />
          <View style={styles.infoTexts}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </View>

        {user.phone ? (
          <View style={styles.infoCard}>
            <Phone size={16} color={theme.colors.primary} />
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Telefon</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          </View>
        ) : null}

        {user.plan ? (
          <View style={styles.infoCard}>
            <Crown size={16} color="#f59e0b" />
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Tariflar</Text>
              <Text style={[styles.infoValue, { color: '#f59e0b' }]}>{user.plan}</Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LogOut size={18} color={theme.colors.danger} />
        <Text style={styles.logoutText}>Hisobdan chiqish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 20 },
  avatarSection: { alignItems: 'center', paddingVertical: 16 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: theme.colors.surface, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarLetter: { fontSize: 38, fontWeight: '900' },
  name: { fontSize: 22, fontWeight: '800', color: theme.colors.text, marginBottom: 8 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  roleText: { fontSize: 13, fontWeight: '700' },
  infoSection: { gap: 10 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: theme.colors.surface, borderWidth: 1,
    borderColor: theme.colors.border, borderRadius: 14, padding: 14,
  },
  infoTexts: { flex: 1 },
  infoLabel: { color: theme.colors.textMuted, fontSize: 12, fontWeight: '600', marginBottom: 2 },
  infoValue: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)', borderRadius: 14, padding: 16,
  },
  logoutText: { color: theme.colors.danger, fontSize: 16, fontWeight: '700' },
});
