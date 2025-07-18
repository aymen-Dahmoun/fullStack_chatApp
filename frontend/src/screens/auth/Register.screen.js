import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { registerWithCredentials } from "../../utils/auth.utils";

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Register Screen</Text>
      <TextInput
        label="Username"
        mode="outlined"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
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
        onPress={() => registerWithCredentials({ email, password, username })}
      >
        Register
      </Button>
      <Button 
        mode="outlined"
        onPress={() => console.log('Login pressed') }
        style={{ marginTop: 16 }}
        >
        Login
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