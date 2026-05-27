import axios from 'axios';
import { getToken } from './auth';

// Update with your local IP when testing on a physical device!
const API_URL = 'http://localhost:3000/api'; 

export const syncSessionToCloud = async (sessionData: any) => {
  try {
    // 1. Fetch the secure JWT token that we saved during login
    const token = await getToken();
    
    if (!token) {
      throw new Error("No authentication token found. Cannot sync.");
    }

    // 2. Transmit the data to the Node.js backend
    const response = await axios.post(`${API_URL}/sessions/upload`, sessionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to sync session to cloud:', error);
    throw error; 
  }
};
