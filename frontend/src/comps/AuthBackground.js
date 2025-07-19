import React from 'react';
import { Image, View } from 'react-native';

export default function AuthBackground({ mainImage, secondImage, thirdImage }) {
  return (
    <View className="absolute inset-0">
      <Image
        source={mainImage}
        className="absolute left-10 opacity-20 blur-xl"
        resizeMode="contain"
      />
      <Image
        source={secondImage}
        className="absolute top-56 left-0 opacity-45"
        resizeMode="contain"
      />
      <Image
        source={thirdImage}
        className="absolute bottom-56 right-1 opacity-60"
        resizeMode="contain"
      />
    </View>
  );
}
