import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import MainPage from './screens/MainPage';
import CourseScreen from './screens/CourseScreen';
import GroupScreen from './screens/GroupScreen';
import AddClassScreen from './screens/AddClassScreen';
import AddGroupScreen from './screens/AddGroupScreen';
import RubricScreen from './screens/RubricScreen';
import CreateClassScreen from './screens/CreateClassScreen';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" headerMode={'none'}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="Course" component={CourseScreen} />
        <Stack.Screen name="Group" component={GroupScreen}/>
        <Stack.Screen name="AddClass" component={AddClassScreen}/>
        <Stack.Screen name="CreateClass" component={CreateClassScreen}/>
        <Stack.Screen name="AddGroup" component={AddGroupScreen}/>
        <Stack.Screen name="Rubric" component={RubricScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;
