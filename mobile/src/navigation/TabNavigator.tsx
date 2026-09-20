import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClubsScreen } from '../screens/ClubsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { OwnerDashboard } from '../screens/owner/OwnerDashboard';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { theme } from '../theme';
import { Gamepad2, User, LayoutDashboard, Shield } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const { user } = useAuth();
  const role = user?.role || 'user';

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
      {role === 'admin' && (
        <Tab.Screen 
          name="AdminDashboard" 
          component={AdminDashboard} 
          options={{
            title: 'Boshqaruv',
            tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />
          }}
        />
      )}

      {role === 'clubOwner' && (
        <Tab.Screen 
          name="OwnerDashboard" 
          component={OwnerDashboard} 
          options={{
            title: 'Statistika',
            tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
          }}
        />
      )}

      <Tab.Screen 
        name="Clubs" 
        component={ClubsScreen} 
        options={{
          title: role === 'clubOwner' ? 'Mening Klublarim' : 'Klublar',
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
