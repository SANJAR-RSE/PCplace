import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.text}>{user?.fullName || user?.email}</Text>
      <Text style={styles.text}>Rol: {user?.role}</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Chiqish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: 16,
    marginBottom: 10,
  },
  logoutBtn: {
    marginTop: 'auto',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.danger,
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: theme.colors.danger,
    fontWeight: 'bold',
  }
});
