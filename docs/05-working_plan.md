# Mobile App Sequential Working Plan

This document details the step-by-step implementation order for the patient-facing mobile application over the 45-day timeline.

---

## 📅 Execution Order & Milestones

### **Step 1: Scaffolding & Local DB Setup (Days 2–3)**
*   **Day 2: Boilerplate Scaffolding**
    *   Initialize React Native (Expo) and camera permissions configuration settings.
*   **Day 3: Local SQLite Database Setup**
    *   Build SQLite connection helper initializing `local_sessions` and `local_metrics` tables on the device.

### **Step 2: Authentication & Camera Viewfinder (Days 5–6)**
*   **Day 5: Login Views & AsyncStorage**
    *   Build user login screen forms and secure cache auth tokens in `AsyncStorage`.
*   **Day 6: Video Stream Viewfinder Overlay**
    *   Integrate Vision Camera and transparent guide layout overlays.

### **Step 3: On-Device Pose Engine & Logic (Days 7–10)**
*   **Day 7: MediaPipe Frame Processor**
    *   Configure frame processor binding landmarks coordinates streams.
*   **Day 8: Mathematical Joint Angle Calculators**
    *   Code vector math computing joint angles (knee, hip, shoulder) from coordinate inputs.
*   **Day 9: Repetition Peak Detectors**
    *   Implement peak-to-trough calculations detecting movement cycles.
*   **Day 10: Local SQLite Caching**
    *   Build database queries saving completed exercises session logs and metrics.

### **Step 4: Sync Manager & Polling (Days 13 & 22)**
*   **Day 13: Background Sync Manager**
    *   Check for internet access, upload cached logs, and set database records to `synced` on success.
*   **Day 22: Active Plan Fetch Updates**
    *   Poll the backend `/api/plans/active` and update local SQLite configurations.

### **Step 5: Advanced AI & Onboarding (Days 24, 27, 35 & 36)**
*   **Day 24: Real-time Camera Warnings**
    *   Track MediaPipe landmark detection confidence rates and display user alerts.
*   **Day 27: Mathematical Unit Checks**
    *   Write Jest unit tests verifying joint flexion calculations.
*   **Day 35: Pose Correction Filters**
    *   Filter out coordinate noise when landmarks disappear behind loose patient clothing.
*   **Day 36: Dynamic Local Exercise Mapping Engine**
    *   Upgrade coordinates processing to map custom exercises added dynamically by doctors.

### **Step 6: Hardening & App Store submissions (Days 40 & 43–45)**
*   **Day 40: Sentry SDK crash reporter integration**
    *   Integrate Sentry SDK tracking runtime exceptions across the app.
*   **Day 43: Patient Onboarding Guides**
    *   Design interactive tooltip walk-throughs showing correct tripod setup.
*   **Day 44: Closed Beta User Feedback**
    *   Distribute builds to trial clinics and collect user feedback logs.
*   **Day 45: Production App Store Submissions**
    *   Compile build configurations and distribute packages to Apple TestFlight and Google Play Console.
