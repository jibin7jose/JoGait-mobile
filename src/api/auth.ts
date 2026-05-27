import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Update with your local IP when testing on a physical device!
const API_URL = 'http://localhost:3000/api/auth';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token, user } = response.data;
    
    // Encrypt and save the JWT token on the device keychain/keystore
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userData', JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('userToken');
  await SecureStore.deleteItemAsync('userData');
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('userToken');
};
