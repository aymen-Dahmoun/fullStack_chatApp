
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Icon } from 'react-native-paper';

export default function NavBar() {
  const navigation = useNavigation();
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);
    const routeName = useNavigationState((state) => {
    const currentRoute = state.routes[state.index];
    return currentRoute.name;
  });

  if (routeName === 'Chat') return null;


  const tabs = [
    { name: 'Messages', icon: 'chat' },
    { name: 'Profile', icon: 'account' },
    { name: 'Settings', icon: 'cog' },
  ];

  return (
    <View className="h-20 bg-sky-700 flex-row border-t border-white/20 dark:bg-slate-800">
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            className="flex-1 items-center justify-center"
          >
            <Icon
              source={tab.icon}
              color={isActive ? 'white' : 'lightgray'}
              size={28}
            />
            <Text className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
