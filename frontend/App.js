import { View } from "react-native";
import "./global.css";
import MainRouter from "./MainRouter";
import { AuthProvider } from "./src/context/authContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { SocketProvider } from "./src/context/socketContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SocketProvider>
          <PaperProvider>
            <View className="flex-1 bg-white dark:bg-black">
              <MainRouter />
            </View>
          </PaperProvider>
        </SocketProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
