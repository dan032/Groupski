import 'react-native-gesture-handler';
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import MainPage from './screens/MainPage';
import Course from './screens/Course';
import GroupScreen from './screens/GroupScreen';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="Course" component={Course} />
        <Stack.Screen name="Group" component={GroupScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;
