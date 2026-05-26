# Step 2: Camera & Pose Estimation Pipeline

This guide details configuring on-device MediaPipe Pose estimation in React Native.

---

## 1. Frame Processor Pipeline Setup

Using React Native Vision Camera, we bind a native plugin to process each video frame:

```typescript
import { useCameraDevices, Camera } from 'react-native-vision-camera';
import { useFrameProcessor } from 'react-native-vision-camera';

export default function CameraScreen() {
  const devices = useCameraDevices();
  const device = devices.back;

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // 1. Send frame buffer to native MediaPipe plugin
    // const landmarks = detectPoseLandmarks(frame);
    // 2. Extract keypoints (hip, knee, ankle joints)
    // 3. Compute flexion/extension angles
  }, []);

  if (device == null) return <LoadingView />;

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={30}
    />
  );
}
```

## 2. Joint Angle Calculation Logic

We calculate angles (e.g., knee joint flexion) in degrees from the returned 3D coordinates:

```typescript
export function calculateJointAngle(p1: Point, p2: Point, p3: Point): number {
  // Vectors u and v
  const u = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v = { x: p3.x - p2.x, y: p3.y - p2.y };

  const dotProduct = u.x * v.x + u.y * v.y;
  const magnitudeU = Math.sqrt(u.x * u.x + u.y * u.y);
  const magnitudeV = Math.sqrt(v.x * v.x + v.y * v.y);

  const angleRad = Math.acos(dotProduct / (magnitudeU * magnitudeV));
  return angleRad * (180 / Math.PI); // Return degrees
}
```
