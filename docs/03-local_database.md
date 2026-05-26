# Step 3: Local SQLite Database Integration

This guide details configuring Expo SQLite to persist patient session metrics locally on the phone.

---

## 1. Database Connection & Schema Init (`src/db/sqlite.ts`)

```typescript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('jogait.db');

export function initDatabase() {
  db.transaction((tx) => {
    // 1. Create sessions table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS local_sessions (
        id TEXT PRIMARY KEY,
        patientId TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        scoreSummary TEXT
      );`
    );
    // 2. Create metrics table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS local_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionId TEXT,
        metricType TEXT,
        value REAL,
        unit TEXT,
        timestamp TEXT
      );`
    );
  });
}
```

## 2. Saving a Completed Session

```typescript
export function saveSession(session: any, metrics: any[]) {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO local_sessions (id, patientId, startTime, endTime, status, scoreSummary) 
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [session.id, session.patientId, session.startTime, session.endTime, JSON.stringify(session.scoreSummary)]
    );
    
    metrics.forEach((m) => {
      tx.executeSql(
        `INSERT INTO local_metrics (sessionId, metricType, value, unit, timestamp) 
         VALUES (?, ?, ?, ?, ?)`,
        [session.id, m.metricType, m.value, m.unit, m.timestamp]
      );
    });
  });
}
```
