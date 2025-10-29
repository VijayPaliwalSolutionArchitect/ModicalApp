/**
 * ShivamModicalClinic - Main App Entry Point
 * A modern, futuristic medical clinic management app
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Auth Screens
import LoginScreen from './src/screens/Auth/LoginScreen';

// Patient Screens
import PatientDashboard from './src/screens/Patient/PatientDashboard';
import AppointmentsScreen from './src/screens/Patient/AppointmentsScreen';
import BookAppointmentScreen from './src/screens/Patient/BookAppointmentScreen';
import PrescriptionsScreen from './src/screens/Patient/PrescriptionsScreen';
import NotificationsScreen from './src/screens/Patient/NotificationsScreen';

// Doctor Screens
import DoctorDashboard from './src/screens/Doctor/DoctorDashboard';
import PatientListScreen from './src/screens/Doctor/PatientListScreen';
import TodayScheduleScreen from './src/screens/Doctor/TodayScheduleScreen';

// Theme
import { COLORS } from './src/config/theme';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a splash screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}>
      {!user ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : user.role === 'patient' ? (
        // Patient Stack
        <>
          <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
          <Stack.Screen name="Appointments" component={AppointmentsScreen} />
          <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
          <Stack.Screen name="Prescriptions" component={PrescriptionsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </>
      ) : user.role === 'doctor' ? (
        // Doctor Stack
        <>
          <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
        </>
      ) : null}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
