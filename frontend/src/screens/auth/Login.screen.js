import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { loginWithCredentials } from "../../utils/auth.utils";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/authContext";
import neonCircle from '../../../assets/nnneonCircle.png';
import neonPattern from '../../../assets/qqquad.png';
import neonTriangle from '../../../assets/NeonTriangle.png';
import AuthBackground from "../../comps/AuthBackground.js";
import { useColorScheme } from "nativewind";

export default function LoginScreen() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { setUser } = useAuth();
  const { colorScheme } = useColorScheme();

  const handleLogin = async () => {
    try {
      const data = await loginWithCredentials({
        usernameOrEmail,
        password,
      });
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <View className='flex-1 bg-gradient-to-br from-slate-50 to-blue-50 px-6 justify-center dark:bg-black'>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <AuthBackground
        mainImage={neonPattern}
        secondImage={neonCircle}
        thirdImage={neonTriangle}
      />

      <View className="top-16 w-full items-center self-center px-8">
        <Text className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-2">
          Welcome Back
        </Text>
        <Text className="text-lg font-light text-center text-slate-600 dark:text-slate-300">
          Login to your account
        </Text>
      </View>

      <View className="flex-1 items-center justify-center mt-8">
        <View className="w-full items-center">
          <View
            className="absolute w-screen h-20 bg-white/50 dark:bg-white/10 backdrop-blur-md"
            style={{ top: -10 }}
          />
          
          <Text className="text-base font-medium mb-8 text-slate-700 dark:text-slate-200 text-center z-10">
            Enter your credentials
          </Text>

          <TextInput
            label="Username or Email"
            mode="outlined"
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
            style={{
              width: '90%',
              marginBottom: 16,
              backgroundColor: colorScheme === 'dark' ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.6)',
            }}
            outlineStyle={{
              borderRadius: 8,
              borderWidth: 1.5,
              borderColor: colorScheme === 'dark' ? '#36bcf5' : '#0c5991',
              
            }}
            contentStyle={{ fontSize: 16, color: colorScheme === 'dark' ? '#e2e8f0' : '#334155' }}
            right={<TextInput.Icon icon="account" iconColor="#64748b" />}
            theme={{
              colors: {
                primary: '#0c5991',
                onSurfaceVariant: '#64748b'
              }
            }}
          />

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              width: '90%',
              marginBottom: 24,
              backgroundColor: colorScheme === 'dark' ? 'rgba(30,30,30,0.4)' : 'rgba(255,255,255,0.6)'
            }}
            outlineStyle={{
              borderRadius: 8,
              borderWidth: 1.5,
              borderColor: colorScheme === 'dark' ? '#36bcf5' : '#0c5991',
            }}
            contentStyle={{ fontSize: 16, color: colorScheme === 'dark' ? '#e2e8f0' : '#334155' }}
            right={<TextInput.Icon icon="lock" iconColor="#64748b" />}
            theme={{
              colors: {
                primary: '#0c5991',
                onSurfaceVariant: '#64748b'
              }
            }}
          />

          <Button
            mode="contained"
            icon="login"
            onPress={handleLogin}
            style={{
              backgroundColor: colorScheme === 'dark' ? '#36bcf5' : '#11698f',
              width: '90%',
              borderRadius: 8,
              marginTop: 56
            }}
            labelStyle={{
              fontSize: 18,
              fontWeight: '600',
              color: 'white',
              letterSpacing: 0.5
            }}
            contentStyle={{ height: 56 }}
          >
            Login
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={{ marginTop: 20 }}
            labelStyle={{
              fontSize: 14,
              fontWeight: '500',
              color: '#0c5991',
              textDecorationLine: 'underline'
            }}
          >
            Don't have an account? Register
          </Button>
        </View>

        <Text className="text-xs text-slate-500 dark:text-slate-400 text-center mt-8 px-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
