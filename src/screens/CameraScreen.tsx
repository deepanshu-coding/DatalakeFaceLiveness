import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import FaceService from '../services/FaceService';
import DatabaseService from '../services/DatabaseService';

interface CameraScreenProps {
  navigation: any;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [status, setStatus] = useState('Position face in frame');
  const cameraRef = useRef(null);
  const device = useCameraDevice('front');
  const userId = 'user_' + Math.random().toString(36).substring(7);

  useEffect(() => {
    requestPermission();
    loadModels();
  }, []);

  const requestPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setHasPermission(permission === 'authorized');
  };

  const loadModels = async () => {
    await FaceService.loadModels();
    startDetection();
  };

  const startDetection = () => {
    const interval = setInterval(captureAndDetect, 500);
    return () => clearInterval(interval);
  };

  const captureAndDetect = async () => {
    if (!cameraRef.current || detecting) return;
    
    setDetecting(true);
    try {
      const photo = await cameraRef.current.takePhoto();
      const result = await FaceService.detect(photo.base64);
      
      if (result.faceDetected && result.isLive && result.processingTime) {
        setStatus('Liveness verified');
        await DatabaseService.saveAttendance(userId, photo.base64.substring(0, 100), result.livenessScore);
        Alert.alert('Success', 'Attendance recorded offline', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else if (result.faceDetected && !result.isLive) {
        setStatus('Please blink or smile');
      } else if (!result.faceDetected) {
        setStatus('Face not detected');
      }
    } catch (error) {
      setStatus('Detection error');
    } finally {
      setDetecting(false);
    }
  };

  if (!hasPermission || !device) {
    return (
      <View style={styles.centerContainer}>
        <Text>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.overlay}>
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  camera: {
    flex: 1
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24
  },
  statusBar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  statusText: {
    fontSize: 16,
    color: '#323130',
    fontWeight: '500'
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  backButtonText: {
    fontSize: 16,
    color: '#0078D4',
    fontWeight: '600'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CameraScreen;
