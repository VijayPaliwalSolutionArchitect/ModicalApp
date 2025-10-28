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

// Screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import PatientDashboard from './src/screens/Patient/PatientDashboard';
import DoctorDashboard from './src/screens/Doctor/DoctorDashboard';

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
      ) : (
        // Main App Stack
        <>
          {user.role === 'patient' ? (
            <Stack.Screen
              name="PatientDashboard"
              component={PatientDashboard}
            />
          ) : user.role === 'doctor' ? (
            <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
          ) : null}
        </>
      )}
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
