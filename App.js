import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import DemoBadge from './src/components/DemoBadge';
import { IS_DEMO } from './src/config/demo';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
        <StatusBar style="auto" />
      </AuthProvider>
      {IS_DEMO ? <DemoBadge /> : null}
    </SafeAreaProvider>
  );
}
