import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Mobile app render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ilovada xatolik yuz berdi</Text>
        <Text style={styles.message}>{this.state.error.message}</Text>
        <TouchableOpacity style={styles.button} onPress={() => this.setState({ error: null })}>
          <Text style={styles.buttonText}>Qayta urinish</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: theme.colors.background },
  title: { color: theme.colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  message: { color: theme.colors.textMuted, fontSize: 14, textAlign: 'center', marginBottom: 20 },
  button: { alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, backgroundColor: theme.colors.primary },
  buttonText: { color: '#fff', fontWeight: '700' },
});
