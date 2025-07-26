import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './global.css';
import MainRouter from './MainRouter';
import { AuthProvider } from './src/context/authContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    
    <SafeAreaProvider>
      <AuthProvider >
        <PaperProvider>  
          <View className='flex-1 bg-white dark:bg-black' >
            <MainRouter />
          </View>
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
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
