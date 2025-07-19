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

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator initialRouteName="Messages">
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
  </Stack.Navigator>
);

export default function MainRouter() {
  const { user, loading } = useAuth();

  if (loading) return <ActivityIndicator size={'large'}></ActivityIndicator>; // or a loading spinner

  return (
    <NavigationContainer>
      {user ? <UserStack /> : <AuthStack />}
      {/* {true ? <UserStack /> : <AuthStack />}
      {<NavBar />} */}

    </NavigationContainer>
  );
}
