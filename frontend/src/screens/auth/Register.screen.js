import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, Text, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { registerWithCredentials } from "../../utils/auth.utils";
import { useNavigation } from "@react-navigation/native";
import neonCircle from '../../../assets/nnneonCircle.png'
import neonPattern from '../../../assets/qqquad.png'
import neonTriangle from '../../../assets/NeonTriangle.png'
import neonHex from '../../../assets/nnneonHex.png'
import AuthBackground from "../../comps/AuthBackground";


export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      await registerWithCredentials({ email, password, username });
      navigation.navigate('Login');
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 px-6 justify-center">
      <StatusBar style="dark" />
      
      <AuthBackground mainImage={neonPattern} secondImage={neonTriangle} thirdImage={neonHex} />

      <View className=" top-16 w-full items-center self-center px-8">
        <Text className="text-4xl font-bold text-center text-slate-800 mb-2">
          Create Account
        </Text>
        <Text className="text-lg font-light text-center text-slate-600">
          Join us today
        </Text>
      </View>

      <View className="flex-1 items-center justify-center mt-8">
        <View className="w-full items-center">
          <View className="absolute w-screen h-20 bg-white/50 backdrop-blur-md" style={{top: -10}} />
          
          <Text className="text-base font-medium mb-8 text-slate-700 text-center z-10">
            Enter your information
          </Text>

          <TextInput
            label="Username"
            mode="outlined"
            value={username}
            onChangeText={setUsername}
            style={{ width: '90%', marginBottom: 16, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
            outlineStyle={{ borderRadius: 8, borderWidth: 1.5, borderColor: '#0c5991' }}
            contentStyle={{ fontSize: 16, color: '#334155' }}
            right={<TextInput.Icon icon="account" iconColor="#64748b" />}
            theme={{ colors: { primary: '#0c5991', onSurfaceVariant: '#64748b' }
            }}
          />

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={{ width: '90%', marginBottom: 16, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
            outlineStyle={{ borderRadius: 8, borderWidth: 1.5, borderColor: '#0c5991' }}
            contentStyle={{ fontSize: 16, color: '#334155' }}
            right={<TextInput.Icon icon="email" iconColor="#64748b" />}
            theme={{ colors: { primary: '#0c5991', onSurfaceVariant: '#64748b' }
            }}
          />

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ width: '90%', marginBottom: 24, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
            outlineStyle={{ borderRadius: 8, borderWidth: 1.5, borderColor: '#0c5991' }}
            contentStyle={{ fontSize: 16, color: '#334155' }}
            right={<TextInput.Icon icon="lock" iconColor="#64748b" />}
            theme={{ colors: { primary: '#0c5991', onSurfaceVariant: '#64748b' }
            }}
          />

          <Button
            mode="contained"
            icon="account-plus"
            onPress={handleRegister}
            style={{ backgroundColor: '#0c5991', width: '90%',  borderRadius: 8, marginTop: 56 }}
            labelStyle={{ fontSize: 18, fontWeight: '600', color: 'white', letterSpacing: 0.5 }}
            contentStyle={{ height: 56 }}
          >
            Register
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: 20 }}
            labelStyle={{ fontSize: 14, fontWeight: '500', color: '#0c5991', textDecorationLine: 'underline' }}
          >
            Already have an account? Login
          </Button>
        </View>

        <Text className="text-xs text-slate-500 text-center mt-8 px-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}