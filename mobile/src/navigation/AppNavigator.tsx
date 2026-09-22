import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { AnimatedSplash } from '../screens/AnimatedSplash';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

type AuthScreen = 'login' | 'register';

export function AppNavigator() {
  const { user, loading } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  return (
    <>
      {/* Main App */}
      {!loading && (
        <NavigationContainer>
          {user ? (
            <TabNavigator />
          ) : authScreen === 'login' ? (
            <LoginScreen onGoRegister={() => setAuthScreen('register')} />
          ) : (
            <RegisterScreen onGoLogin={() => setAuthScreen('login')} />
          )}
        </NavigationContainer>
      )}

      {/* Animated Splash — login/register holati aniqlanguncha ustida turadi */}
      {!splashFinished && (
        <AnimatedSplash
          isAuthLoaded={!loading}
          onAnimationComplete={() => setSplashFinished(true)}
        />
      )}
    </>
  );
}
