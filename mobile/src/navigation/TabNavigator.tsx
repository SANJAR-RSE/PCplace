import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClubsScreen } from '../screens/ClubsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { theme } from '../theme';
import { Gamepad2, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tab.Screen 
        name="Clubs" 
        component={ClubsScreen} 
        options={{
          title: 'Klublar',
          tabBarIcon: ({ color, size }) => <Gamepad2 color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}
