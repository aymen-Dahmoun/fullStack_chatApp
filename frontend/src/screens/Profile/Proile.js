import React, { Alert, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { useAuth } from "../../context/authContext";
import LogoutButton from "../../comps/Logout";


export default function Profile(){

    const { setUser } = useAuth();

    const handleLogout = async ()=>{
        try {
            await SecureStore.setItemAsync('tokrn', '');
            setUser(null);

        } catch (error) {
            Alert.alert('Logout Failed', error);
        }
    }
    return(
            <LogoutButton handleLogout={handleLogout} />
    )
}