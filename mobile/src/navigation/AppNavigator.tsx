import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { TabNavigator } from './TabNavigator';
import { AnimatedSplash } from '../screens/AnimatedSplash';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { user, loading } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <>
      {!loading && (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
              <Stack.Screen name="Main" component={TabNavigator} />
            ) : (
              <Stack.Screen name="Login" component={LoginScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}

      {!splashFinished && (
        <AnimatedSplash 
          isAuthLoaded={!loading} 
          onAnimationComplete={() => setSplashFinished(true)} 
        />
      )}
    </>
  );
}
