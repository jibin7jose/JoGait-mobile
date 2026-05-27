import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import { initDb } from './src/db/sqlite';

const Stack = createNativeStackNavigator();

export default function App() {
  
  useEffect(() => {
    // 1. As soon as the app starts, initialize the local SQLite database
    initDb().catch((err) => console.error("Database init failed:", err));
    
    // 2. Later, we can add background sync tasks here to continuously push data
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'My Dashboard' }} 
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ title: 'Record Session', headerShown: false }} // Hide header for full screen camera
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
