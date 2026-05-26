# Step 4: Background Sync Queue Manager

This guide describes how the mobile app syncs local SQLite sessions with the backend server.

---

## 1. Sync Queue Processing Algorithm

We retrieve all sessions marked `pending` from SQLite and upload them to the backend API:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

export async function processSyncQueue() {
  // 1. Check network connectivity (NetInfo)
  const isConnected = await checkConnectivity();
  if (!isConnected) return;

  // 2. Query pending sessions from SQLite
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM local_sessions WHERE status = 'pending'`,
      [],
      async (_, { rows }) => {
        const sessions = rows._array;
        
        for (const session of sessions) {
          try {
            // Fetch associated metrics
            const metrics = await getSessionMetrics(session.id);
            
            // Upload to API
            await apiClient.post('/sessions/upload', {
              ...session,
              scoreSummary: JSON.parse(session.scoreSummary),
              metrics
            });

            // Mark session as synced
            markSessionSynced(session.id);
          } catch (error) {
            console.error(`Failed to sync session: ${session.id}`, error);
          }
        }
      }
    );
  });
}
```

## 2. Sync Manager Orchestration
*   **Trigger Events**: Sync is executed whenever the app resumes from the background, after an exercise session ends, or when network status changes to online.
*   **Retry Limit**: If an upload fails with validation errors (e.g., $400$ Bad Request), it is removed from active retries and flagged for user review.
*   **Sync Timestamp**: Store the last successful sync timestamp using AsyncStorage to display sync status to the patient.
