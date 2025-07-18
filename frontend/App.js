import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './global.css';
import LoginScreen from './src/screens/auth/Login.screen';
import RegisterScreen from './src/screens/auth/Register.screen';

export default function App() {
  return (
      <RegisterScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
