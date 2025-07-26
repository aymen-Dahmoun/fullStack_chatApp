import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, FlatList, Dimensions, ScrollView } from "react-native";
import useSearch from "../hooks/useSearch";
import { useNavigation } from "@react-navigation/native";


export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const { data: results, loading, error } = useSearch(query);
  const navigation = useNavigation();

  const toggleVisibility = (text) => {
    setQuery(text);
    setVisible(text.length > 0);
  };

  return (
    <View className="px-4 pt-2">
      <TextInput
        value={query}
        onChangeText={toggleVisibility}
        placeholder="Search users..."
        placeholderTextColor="#999"
        className="bg-blue-100 dark:bg-slate-800 dark:text-white text-black px-4 py-2 rounded-xl text-base"
      />

      {visible && (
        <View
          className="absolute z-10 left-4 right-4 mt-2 rounded-xl top-12 max-h-[66.66vh] border-b-[0.25px] border-neutral-500 bg-white dark:bg-slate-800"
        >
          {loading && <Text className="text-center py-4 text-gray-500 dark:text-gray-300">Loading...</Text>}
          {error && <Text className="text-center py-4 text-red-500">Failed to load users</Text>}
          {!loading && results?.length === 0 && (
            <Text className="text-center py-4 text-gray-400">No users found</Text>
          )}

          <FlatList
            keyboardShouldPersistTaps="handled"
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setQuery('');
                  setVisible(false);
                  navigation.navigate('Chat', { messenger: item })
                }}
              >
                <View className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <Text className="text-lg font-medium text-black dark:text-white">
                    {item.username}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-300">
                    {item.email}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}
