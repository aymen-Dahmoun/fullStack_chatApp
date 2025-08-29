import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";

import LoginScreen from "./src/screens/auth/Login.screen";
import RegisterScreen from "./src/screens/auth/Register.screen";
import NavBar from "./src/comps/NavBar";
import { useAuth } from "./src/context/authContext";
import ListScreen from "./src/screens/chat/List.screen";
import { ActivityIndicator } from "react-native-paper";
import MainLayout from "./src/comps/MainLayout";
import ChatScreen from "./src/screens/chat/Chat.screen";
import Profile from "./src/screens/Profile/Proile";
import SettingsScreen from "./src/screens/Profile/Settings";
import { MyDarkTheme } from "./src/constants/topBarTheme";
import CallScreen from "./src/screens/chat/Call.screen";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login" screenOptions={{
    headerShown: false
  }} >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator initialRouteName="Messages" screenOptions={{
    headerShown: false
  }} >
    <Stack.Screen name="Messages" component={
      ()=>(
        <MainLayout>
          <ListScreen/>
        </MainLayout>
      )
      } />
    <Stack.Screen
      name="Chat"
      component={(props) => (
        <MainLayout>
          <ChatScreen {...props} />
        </MainLayout>
      )}
      />
      <Stack.Screen
      name="Profile"
      component={() => (
        <MainLayout>
          <Profile />
        </MainLayout>
      )}
      />
      <Stack.Screen
      name="Settings"
      component={() => (
        <MainLayout>
          <SettingsScreen />
        </MainLayout>
      )}
      />
      <Stack.Screen
      name="CallScreen"
      component={() => (
        <MainLayout>
          <CallScreen />
        </MainLayout>
      )}
      />
      
  </Stack.Navigator>
);

export default function MainRouter() {
  const { user, loading } = useAuth();

  if (loading) return <ActivityIndicator size={'large'}></ActivityIndicator>;

  return (
    <NavigationContainer>
      {user ? <UserStack /> : <AuthStack />}
      {/* {true ? <UserStack /> : <AuthStack />}
      {<NavBar />} */}

    </NavigationContainer>
  );
}
