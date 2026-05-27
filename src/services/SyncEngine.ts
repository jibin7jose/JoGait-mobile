import * as SQLite from 'expo-sqlite';
import { syncSessionToCloud } from '../api/sync';
import * as SecureStore from 'expo-secure-store';

export const runSyncEngine = async () => {
  console.log('🔄 Starting Offline Sync Engine...');
  const db = await SQLite.openDatabaseAsync('jogait.db');

  try {
    // 1. Query the local SQLite database for ANY sessions that haven't been uploaded
    const unsyncedSessions = await db.getAllAsync<any>('SELECT * FROM sessions WHERE synced = 0');
    
    if (unsyncedSessions.length === 0) {
      console.log('✅ No pending sessions to sync.');
      return 0;
    }

    let successCount = 0;
    console.log(`Found ${unsyncedSessions.length} pending sessions. Initiating sync...`);

    // 2. Loop through each offline session and package it for the API
    for (const session of unsyncedSessions) {
      const metrics = await db.getAllAsync<any>('SELECT metricType, value, unit, timestamp FROM metrics WHERE sessionId = ?', [session.id]);
      
      const payload = {
        id: session.id,
        patientId: session.patientId,
        deviceId: session.deviceId || 'mobile-device',
        startTime: session.startTime,
        endTime: session.endTime,
        metrics: metrics
      };

      // 3. Push to the PostgreSQL cloud API via our axios service
      await syncSessionToCloud(payload);

      // 4. If successful, mark the session as synced locally so we don't upload it again
      await db.runAsync('UPDATE sessions SET synced = 1 WHERE id = ?', [session.id]);
      console.log(`✅ Session ${session.id} synced successfully!`);
      successCount++;
    }
    
    return successCount;
  } catch (error) {
    console.error('❌ Sync Engine encountered an error:', error);
    throw error;
  }
};

// HELPER: Generates a fake local session for testing purposes before the AI Camera is built
export const generateMockOfflineSession = async () => {
  const db = await SQLite.openDatabaseAsync('jogait.db');
  
  // Get logged in user ID from SecureStore
  const userDataStr = await SecureStore.getItemAsync('userData');
  const patientId = userDataStr ? JSON.parse(userDataStr).id : 'unknown-patient';

  const sessionId = `mock-session-${Date.now()}`;
  
  await db.runAsync(
    'INSERT INTO sessions (id, patientId, deviceId, startTime, endTime, synced) VALUES (?, ?, ?, ?, ?, ?)',
    [sessionId, patientId, 'simulator', new Date().toISOString(), new Date().toISOString(), 0]
  );

  await db.runAsync(
    'INSERT INTO metrics (id, sessionId, metricType, value, unit, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
    [`metric-${Date.now()}`, sessionId, 'kneeAngle', 95.5, 'degrees', new Date().toISOString()]
  );
  
  console.log(`💾 Mock session ${sessionId} saved completely offline in SQLite.`);
  return sessionId;
};
