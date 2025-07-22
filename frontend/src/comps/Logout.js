
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";


export default function LogoutButton({handleLogout}){

    return(
    <View className='flex-1 h-screen justify-center items-center' >
        <TouchableOpacity
            onPress={handleLogout}
            className="w-4/5 h-12 bg-slate-100 rounded-full text-slate-950 text-center text-lg justify-center items-center"
        >
            <Text calssName='p-28' >
                Logout
            </Text>
        </TouchableOpacity>
    </View>
    )
}