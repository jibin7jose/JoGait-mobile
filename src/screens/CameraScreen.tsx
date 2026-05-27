import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Wait until we know if the user has granted permission
  if (!permission) {
    return <View />;
  }

  // Ask for permission if not granted
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>JoGait needs your camera to track your exercise movements.</Text>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  const toggleRecord = async () => {
    if (isRecording) {
      if (cameraRef.current) {
        cameraRef.current.stopRecording();
      }
      setIsRecording(false);
    } else {
      if (cameraRef.current) {
        setIsRecording(true);
        try {
          // In the future, this video stream will be fed into a pose estimation model
          const video = await cameraRef.current.recordAsync();
          console.log('Exercise Session Saved to Local URI:', video?.uri);
        } catch (e) {
          console.error('Failed to record:', e);
          setIsRecording(false);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 
        We use the front-facing camera because the patient will be 
        looking at the screen while performing the exercise.
      */}
      <CameraView style={styles.camera} facing="front" ref={cameraRef} mode="video">
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, isRecording ? styles.recordingBtn : null]} 
            onPress={toggleRecord}
          >
            <Text style={styles.text}>{isRecording ? 'Stop Exercise' : 'Start Session'}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  message: { textAlign: 'center', paddingBottom: 20, paddingHorizontal: 20 },
  camera: { flex: 1 },
  buttonContainer: { flex: 1, flexDirection: 'row', backgroundColor: 'transparent', margin: 40 },
  button: { 
    flex: 1, 
    alignSelf: 'flex-end', 
    alignItems: 'center', 
    backgroundColor: '#007AFF', 
    padding: 20, 
    borderRadius: 30 
  },
  recordingBtn: {
    backgroundColor: '#FF3B30',
  },
  text: { fontSize: 20, fontWeight: 'bold', color: 'white' },
});
