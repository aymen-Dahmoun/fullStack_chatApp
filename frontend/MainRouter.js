import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";

import LoginScreen from "./src/screens/auth/Login.screen";
import RegisterScreen from "./src/screens/auth/Register.screen";
import NavBar from "./src/comps/NavBar";
import { useAuth } from "./src/context/authContext";
import ListScreen from "./src/screens/chat/List.screen";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator initialRouteName="Messages">
    <Stack.Screen name="Messages" component={ListScreen} />
    <Stack.Screen
      name="Profile"
      component={() => (
        <View>
          <Text>Profile Screen</Text>
        </View>
      )}
    />
  </Stack.Navigator>
);

export default function MainRouter() {
  // const { user, loading } = useAuth();

  // if (loading) return null; // or a loading spinner

  return (
    <NavigationContainer>
      {/* {user ? <AuthStack /> : <AuthStack />}
      {!user && <NavBar />} */}
      {true ? <UserStack /> : <AuthStack />}
      {<NavBar />}

    </NavigationContainer>
  );
}
