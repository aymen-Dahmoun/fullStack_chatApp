import { mediaDevices } from "react-native-webrtc";
import { PermissionsAndroid, Platform } from "react-native";

export async function ensurePermissions() {
  if (Platform.OS !== "android") return true;

  const results = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  ]);

  const cameraGranted =
    results[PermissionsAndroid.PERMISSIONS.CAMERA] ===
    PermissionsAndroid.RESULTS.GRANTED;
  const micGranted =
    results[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
    PermissionsAndroid.RESULTS.GRANTED;

  return cameraGranted && micGranted;
}

export async function getLocalStream({ video = true, audio = true } = {}) {
  const ok = await ensurePermissions();
  if (!ok) throw new Error("Camera or microphone permission denied");

  const stream = await mediaDevices.getUserMedia({ video, audio });
  return stream;
}
