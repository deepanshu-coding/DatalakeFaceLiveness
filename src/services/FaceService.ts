import * as faceapi from '@vladmandic/face-api';
import RNFS from 'react-native-fs';

export class FaceService {
  private modelsLoaded: boolean = false;

  async loadModels(): Promise<boolean> {
    const modelPath = `${RNFS.MainBundlePath}/models`;
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
    this.modelsLoaded = true;
    return true;
  }

  async detect(base64Image: string): Promise<any> {
    if (!this.modelsLoaded) return { error: 'Models not loaded' };
    
    const startTime = Date.now();
    const img = await faceapi.fetchImage(`data:image/jpeg;base64,${base64Image}`);
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarksTiny()
      .withFaceExpressions();

    const processingTime = Date.now() - startTime;

    if (detections.length === 0) {
      return { faceDetected: false, processingTime };
    }

    const landmarks = detections[0].landmarks;
    const expressions = detections[0].expressions;
    const isBlinking = this.detectBlink(landmarks);
    const isSmiling = expressions.happy > 0.7;
    const isLive = isBlinking || isSmiling;

    return {
      faceDetected: true,
      isLive,
      livenessScore: (isBlinking ? 0.5 : 0) + (isSmiling ? 0.5 : 0),
      processingTime: processingTime < 1000,
      details: { isBlinking, isSmiling, expressions }
    };
  }

  private detectBlink(landmarks: any): boolean {
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const leftEAR = this.calculateEAR(leftEye);
    const rightEAR = this.calculateEAR(rightEye);
    return (leftEAR + rightEAR) / 2 < 0.2;
  }

  private calculateEAR(eyePoints: any[]): number {
    const p1 = eyePoints[1], p2 = eyePoints[5];
    const p3 = eyePoints[2], p4 = eyePoints[4];
    const p5 = eyePoints[0], p6 = eyePoints[3];
    
    const vertical1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
    const vertical2 = Math.hypot(p3.x - p4.x, p3.y - p4.y);
    const horizontal = Math.hypot(p5.x - p6.x, p5.y - p6.y);
    
    return (vertical1 + vertical2) / (2 * horizontal);
  }
}

export default new FaceService();
