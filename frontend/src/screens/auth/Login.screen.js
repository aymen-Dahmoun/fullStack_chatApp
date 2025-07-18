import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { loginWithCredentials, registerWithCredentials } from "../../utils/auth.utils";

export default function LoginScreen() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Login Screen</Text>
      
      <TextInput
        label="username or email"
        mode="outlined"
        value={usernameOrEmail}
        onChangeText={setUsernameOrEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button 
        mode="contained"
        onPress={() => loginWithCredentials({ email: usernameOrEmail, password, username: usernameOrEmail })}
      >
        Login
      </Button>
      <Button 
        mode="outlined"
        onPress={() => console.log('Register pressed') }
        style={{ marginTop: 16 }}
        >
        Register
        </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    color: "#000",
    marginBottom: 16,
    fontSize: 24,
  },
  input: {
    width: 320,
    marginBottom: 16,
    height: 48,
  },
});