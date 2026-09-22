import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

type Props = { onGoLogin: () => void };

export function RegisterScreen({ onGoLogin }: Props) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Ism, email va parol majburiy");
      return;
    }
    if (password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    try {
      setError('');
      setLoading(true);
      await register(fullName.trim(), email.trim(), password, phone.trim() || undefined);
    } catch (err: any) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoP}>P</Text>
            <View style={styles.logoAccent} />
          </View>
          <Text style={styles.title}>Ro'yxatdan o'tish</Text>
          <Text style={styles.subtitle}>PCplace ga qo'shiling</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>To'liq ism *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ism Familiya"
              placeholderTextColor={theme.colors.textMuted}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor={theme.colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Parol *</Text>
            <TextInput
              style={styles.input}
              placeholder="Kamida 6 ta belgi"
              placeholderTextColor={theme.colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefon (ixtiyoriy)</Text>
            <TextInput
              style={styles.input}
              placeholder="+998 90 000 00 00"
              placeholderTextColor={theme.colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Ro'yxatdan o'tish</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={onGoLogin}>
            <Text style={styles.loginText}>
              Hisobingiz bormi? <Text style={styles.loginHighlight}>Kirish</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: theme.colors.background,
    padding: theme.spacing.lg, justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, overflow: 'hidden',
  },
  logoP: {
    color: '#fff', fontSize: 44, fontWeight: '900',
    textShadowColor: 'rgba(168,85,247,0.8)',
    textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 14,
  },
  logoAccent: {
    position: 'absolute', bottom: 0, right: 0,
    width: 12, height: 12,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderColor: theme.colors.accent,
    borderTopLeftRadius: 6,
  },
  title: { fontSize: 26, fontWeight: '900', color: theme.colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: theme.colors.textMuted },
  form: { gap: 14 },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 10, padding: 12,
  },
  errorText: { color: theme.colors.danger, fontSize: 14, textAlign: 'center' },
  inputGroup: { gap: 6 },
  label: { color: theme.colors.textMuted, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: theme.colors.surface, borderWidth: 1,
    borderColor: theme.colors.border, borderRadius: theme.borderRadius.md,
    padding: 14, color: theme.colors.text, fontSize: 16,
  },
  button: {
    backgroundColor: theme.colors.primary, padding: 16,
    borderRadius: theme.borderRadius.md, alignItems: 'center', marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginLink: { alignItems: 'center', paddingVertical: 8 },
  loginText: { color: theme.colors.textMuted, fontSize: 14 },
  loginHighlight: { color: theme.colors.primary, fontWeight: '700' },
});
