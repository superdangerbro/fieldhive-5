import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { VoiceAndBarcodeProvider } from '@contexts/VoiceAndBarcodeContext';
import TestInspection from '@screens/TestInspection';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Load any resources or data needed for the app
  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync(MaterialIcons.font);

        // Artificial delay to prevent flash of loading screen
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (e) {
        console.warn(e);
        setError(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer
      onStateChange={(state) => {
        // You can log navigation state changes here
        console.log('New navigation state:', state);
      }}
      fallback={
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      }
    >
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="TestInspection"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          // Add animation configurations
          animation: 'slide_from_right',
          presentation: 'card',
          // Add gesture handling
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          // Add other common screen options
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="TestInspection"
          component={TestInspection}
          options={{
            title: 'FieldHive Equipment Test',
            // Add any screen-specific options
            headerLargeTitle: true,
            headerTransparent: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});
