import { View, Text } from 'react-native';
import React, {useLayoutEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import PhoneScreen from './screens/PhoneScreen';
import LandingScreen from './screens/LandingScreen';




const App = () => {

  const Stack = createStackNavigator();

  const globalScreenOptions = {
    headerStyle: { backgroundColor: "#2C6BED"},
    headerTitleStyle: { color: "white" },
    headerTintColor: "white",
    headerTitleAlign: 'center',
    headerShown: false

  };


  return (
    <NavigationContainer>
       <Stack.Navigator  initialRouteName="Home" screenOptions={globalScreenOptions} >
         <Stack.Screen name="Home" component={HomeScreen} />
         <Stack.Screen name="Register" component={RegisterScreen} />
         <Stack.Screen name="Phone" component={PhoneScreen} />
         <Stack.Screen name="Landing" component={LandingScreen} />



       </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App