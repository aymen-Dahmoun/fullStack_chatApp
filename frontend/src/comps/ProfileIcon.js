import { Text, View } from "react-native";
import { Icon } from "react-native-paper";

export default function ProfileIcon({ username }) {
  const parts = username.trim().split(' ');
  const firstLetter = parts[0]?.[0] || '';
  const secondLetter = parts[1]?.[0] || '';
  const letters = firstLetter + secondLetter;

  return (
    <View className='rounded-full bg-blue-200 justify-center items-center w-[72px] h-[72px] mr-2' >
      {/* <Icon source='person' className='absolute h-20 w-20'/> */}
      <Text className="text-blue-700 text-3xl" >{letters.toUpperCase()}</Text>
    </View>
  );
}
