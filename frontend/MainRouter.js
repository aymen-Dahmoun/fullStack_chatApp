import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./src/screens/auth/Login.screen";
import RegisterScreen from "./src/screens/auth/Register.screen";
import { useAuth } from "./src/context/authContext";
import ListScreen from "./src/screens/chat/List.screen";
import { ActivityIndicator } from "react-native-paper";
import MainLayout from "./src/comps/MainLayout";
import ChatScreen from "./src/screens/chat/Chat.screen";
import CallScreen from "./src/screens/chat/Call.screen";
import Profile from "./src/screens/Profile/Proile";
import SettingsScreen from "./src/screens/Profile/Settings";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator
    initialRouteName="Messages"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Messages">
      {() => (
        <MainLayout>
          <ListScreen />
        </MainLayout>
      )}
    </Stack.Screen>
    <Stack.Screen name="Chat">
      {(props) => (
        <MainLayout>
          <ChatScreen {...props} />
        </MainLayout>
      )}
    </Stack.Screen>
    <Stack.Screen name="Call" component={CallScreen}></Stack.Screen>
    <Stack.Screen name="Profile">
      {() => (
        <MainLayout>
          <Profile />
        </MainLayout>
      )}
    </Stack.Screen>
    <Stack.Screen name="Settings">
      {() => (
        <MainLayout>
          <SettingsScreen />
        </MainLayout>
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

export default function MainRouter() {
  const { user, loading } = useAuth();

  if (loading) return <ActivityIndicator size={"large"}></ActivityIndicator>;

  return (
    <NavigationContainer>
      {user ? <UserStack /> : <AuthStack />}
      {/* {true ? <UserStack /> : <AuthStack />}
      {<NavBar />} */}
    </NavigationContainer>
  );
}
