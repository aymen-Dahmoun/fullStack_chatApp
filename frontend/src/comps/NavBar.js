import { useNavigation } from "@react-navigation/native";
import { Button, View, Text, TouchableOpacity } from "react-native";


export default function NavBar() {
    const navigation = useNavigation();
    return (
        <View className="flex-row justify-between items-center p-4 bg-gray-100 h-32" >
            <TouchableOpacity mode="text" onPress={() => navigation.navigate('Messages')}>
                <Text style={{fontSize: 12}}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity mode="text" onPress={() => navigation.navigate('Profile')}>
                <Text style={{fontSize: 12}}>Messages</Text>
            </TouchableOpacity>
        </View>
    );
}