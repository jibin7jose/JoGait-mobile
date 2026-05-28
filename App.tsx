import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import LoginScreen from './src/screens/LoginScreen';
import { initDb } from './src/db/sqlite';
import { getCurrentUser, logout } from './src/api/auth';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Initialize offline database
        await initDb();
        
        // Check if the user already logged in previously
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          await getCurrentUser();
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Bootstrap failed:", err);
        await logout();
        setIsAuthenticated(false);
      } finally {
        setIsReady(true);
      }
    };
    
    bootstrapAsync();
  }, []);

  if (!isReady) {
    return null; // The app stays on the splash screen while checking auth
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          // If not logged in, only show the Login Screen
          <Stack.Screen 
            name="Login" 
            options={{ headerShown: false }}
          >
            {(props) => <LoginScreen {...props} setAuthToken={setIsAuthenticated} />}
          </Stack.Screen>
        ) : (
          // If logged in, show the main application flow
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'My Dashboard' }} 
            />
            <Stack.Screen 
              name="Camera" 
              component={CameraScreen} 
              options={{ title: 'Record Session', headerShown: false }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
