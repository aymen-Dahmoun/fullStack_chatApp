import React, { useState } from "react";
import { View, Text, Switch, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from 'expo-secure-store';
import { useAuth } from "../../context/authContext";

export default function SettingsScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === "dark");
  const { setUser } = useAuth();

  const handleThemeToggle = () => {
    toggleColorScheme();
    setIsDark((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await SecureStore.setItemAsync('tokrn', '');
      setUser(null);
    } catch (error) {
      Alert.alert('Logout Failed', error.message || String(error));
    }
  };

  return (
    <View className="flex-1 px-6 py-12 bg-white dark:bg-black justify-start">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <Text className="text-3xl font-bold text-slate-800 dark:text-white mb-8">
        Settings
      </Text>

      {/* Theme Toggle */}
      <View className="flex-row items-center justify-between mb-8 px-2">
        <Text className="text-lg text-slate-700 dark:text-slate-300">
          Dark Mode
        </Text>
        <Switch
          value={isDark}
          onValueChange={handleThemeToggle}
          thumbColor={isDark ? "#36bcf5" : "#f4f3f4"}
          trackColor={{ false: "#ccc", true: "#0c5991" }}
        />
      </View>

      {/* Fun Buttons */}
      <Button
        mode="outlined"
        icon="rocket"
        onPress={() => console.log("Launched a potato")}
        style={{ marginBottom: 12, borderColor: '#0c5991' }}
        labelStyle={{ color: colorScheme === 'dark' ? '#36bcf5' : '#0c5991' }}
      >
        Launch Potato
      </Button>

      <Button
        mode="outlined"
        icon="bug"
        onPress={() => console.log("Debugging dreams...")}
        style={{ marginBottom: 12, borderColor: '#0c5991' }}
        labelStyle={{ color: colorScheme === 'dark' ? '#36bcf5' : '#0c5991' }}
      >
        Debug Reality
      </Button>

      <Button
        mode="outlined"
        icon="alien"
        onPress={() => console.log("Contacting aliens...")}
        style={{ marginBottom: 12, borderColor: '#0c5991' }}
        labelStyle={{ color: colorScheme === 'dark' ? '#36bcf5' : '#0c5991' }}
      >
        Contact Aliens
      </Button>

      {/* Logout Button (same style as above) */}
      <Button
        mode="outlined"
        icon="logout"
        onPress={handleLogout}
        style={{ marginTop: 24, borderColor: '#0c5991' }}
        labelStyle={{ color: colorScheme === 'dark' ? '#36bcf5' : '#0c5991' }}
      >
        Logout
      </Button>

      <Text className="text-xs text-center text-slate-500 dark:text-slate-400 mt-12 px-8">
        This screen is 90% useless but looks 100% cool.
      </Text>
    </View>
  );
}
