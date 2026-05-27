import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>JoGait Sync</Text>
      <Text style={styles.subtitle}>Patient Dashboard</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardText}>You have 1 pending exercise plan to complete.</Text>
        <Button 
          title="Start Exercise Tracking" 
          onPress={() => navigation.navigate('Camera')} 
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>Cloud Sync Status: Offline mode active</Text>
        <Button 
          title="Force Sync to Cloud" 
          onPress={() => console.log('Sync triggered!')} 
          color="#34C759"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F7', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 18, color: '#8E8E93', marginBottom: 40 },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center'
  }
});
