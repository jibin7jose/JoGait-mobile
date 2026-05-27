import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { login } from '../api/auth';

export default function LoginScreen({ setAuthToken }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // If successful, signal App.tsx to switch to the main dashboard
      setAuthToken(true); 
    } catch (e) {
      Alert.alert('Login Failed', 'Please check your credentials or ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JoGait</Text>
      <Text style={styles.subtitle}>Secure Patient Portal</Text>
      
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F2F2F7' },
  title: { fontSize: 40, fontWeight: 'bold', textAlign: 'center', color: '#007AFF' },
  subtitle: { fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 40 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  input: { height: 50, borderColor: '#E5E5EA', borderWidth: 1, marginBottom: 20, borderRadius: 8, paddingHorizontal: 15, backgroundColor: '#FAFAFA' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
