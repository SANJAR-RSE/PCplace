import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.text}>(Foydalanuvchilar va barcha klublar ro'yxati tez kunda)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: 16,
  }
});
