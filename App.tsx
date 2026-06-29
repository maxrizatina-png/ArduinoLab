import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import { Navigation } from './src/navigation';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <Navigation />
        <StatusBar style="auto" />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
