import React from "react";
import { View } from "react-native";
import useConversation from "../../hooks/useConversation";


export default function ListScreen(){
    const {data, loading, error} = useConversation();

    return(
        <View>
            
        </View>
    )
}