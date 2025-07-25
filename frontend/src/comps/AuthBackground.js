import { useColorScheme } from 'nativewind';
import React from 'react';
import { Image, View } from 'react-native';

export default function AuthBackground({ mainImage, secondImage, thirdImage }) {
  const { colorScheme } = useColorScheme();
  
  return (
    <View className="absolute inset-0">
      <Image
        source={mainImage}
        className={`absolute left-10 opacity-20 ${
          colorScheme === 'dark' ? 'opacity-50' : ''
        }`}
        resizeMode="contain"
      />
      <Image
        source={secondImage}
        className={`absolute top-56 left-0 opacity-45 ${
          colorScheme === 'dark' ? 'opacity-90' : ''
        }`}
        resizeMode="contain"
      />
      <Image
        source={thirdImage}
        className={`absolute bottom-56 right-1 opacity-60 ${
          colorScheme === 'dark' ? 'opacity-90' : ''
        }`}
      />
      <View  ></View>
      </View>
      )
      
    }