import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NavBar() {
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);
  const routeName = useNavigationState((state) => {
    const currentRoute = state.routes[state.index];
    return currentRoute.name;
  });

  const [routes] = React.useState([
    { key: 'messages', title: 'Messages', focusedIcon: 'message' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account' },
  ]);

  
  if (routeName === 'Chat') return null;



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
