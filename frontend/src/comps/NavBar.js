import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NavBar() {
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'messages', title: 'Messages', focusedIcon: 'message' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account' },
  ]);

  // Instead of rendering scenes, trigger navigation
  const handleIndexChange = (newIndex) => {
    setIndex(newIndex);

    // Map keys to screen names
    const keyToScreen = {
      messages: 'Messages',
      profile: 'Profile',
    };

    navigation.navigate(keyToScreen[routes[newIndex].key]);
  };


  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange}
      renderScene={()=>null}
      style={{height:80, backgroundColor:'#000', maxHeight:80}}
    />
  );
}
