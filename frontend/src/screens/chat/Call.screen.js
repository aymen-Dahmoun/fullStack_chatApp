import { mediaDevices, RTCView } from 'react-native-webrtc';
import React, { useState } from 'react';
import { Button, SafeAreaView, View } from 'react-native';

export default function CallScreen() {
  const [stream, setStream] = useState(null);

  const start = async () => {
    try {
      const s = await mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView>
      {stream && <RTCView streamURL={stream.toURL()} style={{ width: 300, height: 300 }} />}
      <View>
        <Button title="Start Camera" onPress={start} />
      </View>
    </SafeAreaView>
  );
}
