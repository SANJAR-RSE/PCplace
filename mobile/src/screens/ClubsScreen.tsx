import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export function ClubsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Klublar ruyxati (Tez kunda)</Text>
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
  text: {
    color: theme.colors.text,
    fontSize: 18,
  }
});
