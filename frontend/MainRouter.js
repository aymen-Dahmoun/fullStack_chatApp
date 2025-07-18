import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/auth/Login.screen";
import RegisterScreen from "./src/screens/auth/Register.screen";
import NavBar from "./src/comps/NavBar";

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
             />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
            />
        </Stack.Navigator>
    );
};

const UserStack = () => {
    return (
        <Stack.Navigator initialRouteName="Messages">
            <Stack.Screen
                name="Messages"
                component={() => <View><Text>Messages Screen</Text></View>} // Placeholder for Messages screen
            />
            <Stack.Screen
                name="Profile"
                component={() => <View><Text>Profile Screen</Text></View>} // Placeholder for Profile screen
            />
        </Stack.Navigator>
    );
}

export default function MainRouter() {
    return(
        <NavigationContainer >
            <Stack.Navigator >
                <Stack.Screen
                    name="Auth"
                    component={AuthStack}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="User"
                    component={UserStack}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
            <NavBar />
        </NavigationContainer>
    )
}