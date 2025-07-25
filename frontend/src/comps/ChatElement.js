import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import ProfileIcon from "./ProfileIcon";


export default function ChatElement({ item }) {
    
    const navigation = useNavigation();

    const username = item?.messenger?.username || "Unknown";
    const message = item.lastMessage?.content || "No messages yet";
    const time = item.lastMessage?.createdAt || item.updatedAt;

    const formatTime = (isoTime) => {
        const date = new Date(isoTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <TouchableOpacity 
        onPress={()=>navigation.navigate('Chat', {conversationId: item.conversationId, messenger: item.messenger})}
      >
        <View className="flex-row justify-between items-center bg-transparent pr-4 pl-4 pb-6 m-2">
          <ProfileIcon username={username} />
          <View className="flex-1 pr-2">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {username}
            </Text>
            <Text className="text-lg text-gray-500 dark:text-gray-300" numberOfLines={1}>
              {message}
            </Text>
          </View>
          <Text className="text-lg text-gray-400 dark:text-gray-300">
            {formatTime(time)}
          </Text>
        </View>
      </TouchableOpacity>    
    );
  };  

