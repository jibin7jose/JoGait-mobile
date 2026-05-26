import * as SQLite from 'expo-sqlite';

/**
 * Initializes the local SQLite database to store exercise sessions 
 * completely offline.
 */
export const initDb = async () => {
  // Open or create the database asynchronously
  const db = await SQLite.openDatabaseAsync('jogait.db');

  // Create the tables if they don't exist
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      patientId TEXT NOT NULL,
      deviceId TEXT,
      startTime TEXT,
      endTime TEXT,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS metrics (
      id TEXT PRIMARY KEY NOT NULL,
      sessionId TEXT NOT NULL,
      metricType TEXT,
      value REAL,
      unit TEXT,
      timestamp TEXT,
      FOREIGN KEY (sessionId) REFERENCES sessions (id) ON DELETE CASCADE
    );
  `);
  
  console.log('✅ Local SQLite Database initialized successfully');
  return db;
};
