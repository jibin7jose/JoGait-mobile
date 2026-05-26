import axios from 'axios';

// IMPORTANT: If testing on a physical iPhone/Android, 'localhost' will NOT work.
// You must replace this with your computer's local Wi-Fi IP address (e.g., http://192.168.1.10:3000/api)
const API_URL = 'http://localhost:3000/api'; 

// In a real app, this would be fetched from expo-secure-store after the patient logs in
const MOCK_PATIENT_TOKEN = 'your_auth_token_here';

export const syncSession = async (sessionData: any) => {
  try {
    console.log(`Syncing session ${sessionData.id} to backend...`);
    const response = await axios.post(`${API_URL}/sessions/upload`, sessionData, {
      headers: { Authorization: `Bearer ${MOCK_PATIENT_TOKEN}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to sync session to cloud:', error);
    throw error; // Let the caller handle retries
  }
};
