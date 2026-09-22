import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';
import { Gamepad2, User, LayoutDashboard, Shield, Calendar, Users, ClipboardList } from 'lucide-react-native';

// User screens
import { ClubsScreen } from '../screens/ClubsScreen';
import { ClubDetailScreen } from '../screens/ClubDetailScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// Owner screens
import { OwnerDashboard } from '../screens/owner/OwnerDashboard';
import { OwnerBookingsScreen } from '../screens/owner/OwnerBookingsScreen';

// Admin screens
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AdminClubsScreen } from '../screens/admin/AdminClubsScreen';

const Tab = createBottomTabNavigator();
const ClubsStack = createNativeStackNavigator();

function ClubsNavigator() {
  const [selectedClub, setSelectedClub] = useState<any>(null);

  if (selectedClub) {
    return (
      <ClubDetailScreen
        club={selectedClub}
        onBack={() => setSelectedClub(null)}
      />
    );
  }
  return <ClubsScreen onSelectClub={setSelectedClub} />;
}

const TAB_OPTIONS = {
  headerStyle: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTintColor: theme.colors.text,
  tabBarStyle: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    paddingBottom: 4,
  },
  tabBarActiveTintColor: theme.colors.primary,
  tabBarInactiveTintColor: theme.colors.textMuted,
};

function UserTabs() {
  return (
    <Tab.Navigator screenOptions={TAB_OPTIONS}>
      <Tab.Screen
        name="Clubs"
        component={ClubsNavigator}
        options={{ title: 'Klublar', tabBarIcon: ({ color, size }) => <Gamepad2 color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ title: 'Bronlarim', tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

function OwnerTabs() {
  return (
    <Tab.Navigator screenOptions={TAB_OPTIONS}>
      <Tab.Screen
        name="OwnerDash"
        component={OwnerDashboard}
        options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }}
      />
      <Tab.Screen
        name="OwnerClubs"
        component={ClubsNavigator}
        options={{ title: 'Barcha Klublar', tabBarIcon: ({ color, size }) => <Gamepad2 color={color} size={size} /> }}
      />
      <Tab.Screen
        name="OwnerBookings"
        component={OwnerBookingsScreen}
        options={{ title: 'Bronlar', tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={TAB_OPTIONS}>
      <Tab.Screen
        name="AdminDash"
        component={AdminDashboard}
        options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Shield color={color} size={size} /> }}
      />
      <Tab.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ title: 'Foydalanuvchilar', tabBarIcon: ({ color, size }) => <Users color={color} size={size} /> }}
      />
      <Tab.Screen
        name="AdminClubs"
        component={AdminClubsScreen}
        options={{ title: 'Klublar', tabBarIcon: ({ color, size }) => <Gamepad2 color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

export function TabNavigator() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminTabs />;
  if (user?.role === 'clubOwner') return <OwnerTabs />;
  return <UserTabs />;
}
