import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";


export default function ChatElement({ item }) {
    
    const navigation = useNavigation();

    const username = item.lastMessage?.sender?.username || "Unknown";
    const message = item.lastMessage?.content || "No messages yet";
    const time = item.lastMessage?.createdAt || item.updatedAt;

    const formatTime = (isoTime) => {
        const date = new Date(isoTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <TouchableOpacity 
        onPress={()=>navigation.navigate('Chat', {conversationId: item.conversationId})}
      >
        <View className="flex-row justify-between items-center bg-white p-4 m-2 shadow-md">
          <View
            className='w-11 h-11 mr-2 items-center justify-center bg-slate-500 rounded-3xl'
          >
            <Text className='text-white text-sm font-bold' >{username[0]}</Text>
          </View>
          <View className="flex-1 pr-2">
            <Text className="text-lg font-semibold text-gray-900">
              {username}
            </Text>
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              {message}
            </Text>
          </View>
          <Text className="text-xs text-gray-400">
            {formatTime(time)}
          </Text>
        </View>
        <Divider style={{width:'95%'}} />
      </TouchableOpacity>    
    );
  };  

