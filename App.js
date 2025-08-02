/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MediaList from './src/screens/components/media/MediaList';

const App = () => {
  const Stack = createNativeStackNavigator();
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MediaList" component={MediaList} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}




export default App;
