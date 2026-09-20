import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export function OwnerDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Klub Egasi Dashboard</Text>
      <Text style={styles.text}>(Statistikalar va boshqaruv tez kunda)</Text>
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
