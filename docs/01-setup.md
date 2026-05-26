# Step 1: Mobile App Setup & React Native

This guide details setting up the React Native workspace.

---

## 1. Project Initialization

To create a new React Native Expo project, run:
```bash
npx create-expo-app@latest mobile --template tabs
```
Or for bare React Native:
```bash
npx react-native@latest init mobile
```

Install native camera and device database packages:
```bash
npm install react-native-vision-camera expo-sqlite @react-native-async-storage/async-storage
```

## 2. Native Permissions Setup

### Android (`android/app/src/main/AndroidManifest.xml`)
Add camera and file storage configurations:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS (`ios/JoGait/Info.plist`)
Specify permission descriptors for the camera access:
```xml
<key>NSCameraUsageDescription</key>
<string>JoGait requires camera access to process motion overlay and exercise metrics in real time.</string>
```
