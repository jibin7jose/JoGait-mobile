import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { runSyncEngine, generateMockOfflineSession } from '../services/SyncEngine';
import { logout } from '../api/auth';

export default function HomeScreen({ navigation }: any) {
  const [syncing, setSyncing] = useState(false);

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      const count = await runSyncEngine();
      if (count > 0) {
        Alert.alert('Sync Complete', `Successfully uploaded ${count} sessions to the cloud.`);
      } else {
        Alert.alert('Up to Date', 'No offline sessions pending upload.');
      }
    } catch (e) {
      Alert.alert('Sync Failed', 'Could not reach the server. Data is safe offline.');
    } finally {
      setSyncing(false);
    }
  };

  const handleGenerateMockData = async () => {
    await generateMockOfflineSession();
    Alert.alert('Offline Data Saved', 'A mock exercise session was saved to the local SQLite database. Press Force Sync to upload it.');
  };

  const handleLogout = async () => {
    await logout();
    // Restart the app completely (or trigger a navigation reset if we wired it that way)
    // We can also just alert for now since App.tsx handles auth on boot
    Alert.alert('Logged Out', 'Please restart the application.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JoGait Sync</Text>
      <Text style={styles.subtitle}>Patient Dashboard</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardText}>You have 1 pending exercise plan to complete.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.buttonText}>Start Exercise Tracking</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>Offline Data Management</Text>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleGenerateMockData}>
          <Text style={styles.secondaryButtonText}>1. Save Mock Data Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.syncButton, syncing && { opacity: 0.7 }]} 
          onPress={handleForceSync}
          disabled={syncing}
        >
          {syncing ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>2. Force Sync to Cloud</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{ marginTop: 30 }} onPress={handleLogout}>
         <Text style={{ color: '#FF3B30', fontSize: 16 }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 18, color: '#8E8E93', marginBottom: 40 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, width: '100%', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  cardText: { fontSize: 16, marginBottom: 15, textAlign: 'center', fontWeight: '500' },
  primaryButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  secondaryButton: { backgroundColor: '#E5E5EA', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  syncButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  secondaryButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});
