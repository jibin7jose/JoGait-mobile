# Mobile App Specification & Working Plan

This document details the configuration, native modules, camera pipeline, and offline logic for the **JoGait Mobile App**.

---

## 1. Technologies & Device Integration
*   **Framework**: React Native
*   **AI Engine**: MediaPipe Pose (via TensorFlow Lite or Web Assembly wrapper)
*   **Database**: SQLite for local persistence
*   **Camera Handler**: React Native Vision Camera with Frame Processor

---

## 2. Directory Structure
```
/mobile
  /src
    /components      # Camera overlay, skeleton renderer, buttons
    /screens         # Login, Home, ActiveExercise, Summary, History
    /db              # SQLite migrations, local schemas, query handlers
    /services        # Background sync queue manager, API client
    /ai              # Frame processors and math helpers for angles
```

---

## 3. Pose Detection & Angle Tracking Pipeline

### A. Processing Loop
1.  **Frame Capture**: Camera streams frames at 30fps.
2.  **Model Inference**: Local MediaPipe Pose returns 33 skeletal landmarks.
3.  **Angle Calculation**: Mathematical formulas calculate joint angles:
    $$\theta = \arccos\left(\frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}\right)$$
    (where $\vec{u}$ and $\vec{v}$ are vectors connecting hip-to-knee and knee-to-ankle).
4.  **UI Feedback**: Updates the live angle display and increments repetition counters.

### B. Offline Sync Queue
*   When a session ends, the app inserts the session and individual metrics into local SQLite.
*   An entry is added to `local_sync_queue` with status `pending`.
*   A background task monitors connectivity. On connection, it reads the queue, serializes the session metrics, uploads them to the server, and marks them as `synced` locally.
