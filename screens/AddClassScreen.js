import * as React from 'react';
import style from '../css/style';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert, ScrollView,
} from 'react-native';

import database from '@react-native-firebase/database';

function AddClassScreen({route, navigation}) {
    const [code, onChangeCode] = React.useState("");
    const [subCode, onChangeSubCode] = React.useState("");
    const [secret, onChangeSecret] = React.useState("");
    const [isLoading, onChangeLoading] = React.useState(false);
    const {user} = route.params;
    let {data} = route.params;

    // Allows the user to sign up for a course
    const registerForCourse = async () => {
      if (code === "" || secret === ""){
          Alert.alert("Error", "Please enter all required information");
      }
      else{
          try{
              onChangeLoading(true);
              const ref = database().ref();
              const courseData = await ref.child('courses').once('value');

              if (courseData) {
                  const coursesKeys =  Object.keys(courseData.val());
                  const length = coursesKeys.length;
                  let currCourse = {};
                  // Finds a course that matches the user's input
                  for (let i = 0; i < length; i++){
                      const curr = courseData.val()[coursesKeys[i]];
                      if (curr.code === code && curr.subcode === subCode){
                          currCourse = curr;
                          break;
                      }
                  }

                  // If a course is found
                  if (currCourse){
                      const key = currCourse.id;

                      // Sets up user and course relationship
                      let updates = {};
                      updates[`/courses/${key}/students/${user}`] = true;
                      updates[`/users/${user}/courses/${key}`] = true;
                      ref.update(updates);

                      // Required in case user does not have any courses
                      if (data.courses === undefined){
                          data.courses = {
                              [key] : true
                          }
                      }
                      else{
                          data.courses = {...data.courses, [key]: true}
                      }

                      onChangeLoading(false);
                      navigation.navigate("MainPage", {uid: user, data: data, update: true})
                  }
                  else{
                      Alert.alert("Course does not exist");
                  }
              }
              else{
                  Alert.alert("Error", "Unable to access course content");
                  onChangeLoading(false)
              }
          }
          catch (e) {
              Alert.alert("Error", e.message);
              onChangeLoading(false)
          }
      }
    };

    return(
        <ScrollView contentContainerStyle={style.container}>
            <Text style={{marginTop: 20, fontSize: 20}}>Sign up for a Course</Text>
            <TextInput
                style={[style.unit, style.txtInput]}
                onChangeText={text=> onChangeCode(text)}
                value={code}
                placeholder={"Enter the Course Code that you want to join"}
            />
            <TextInput
                style={[style.unit, style.txtInput]}
                onChangeText={text=> onChangeSubCode(text)}
                value={subCode}
                placeholder={"Enter the Sub Code for the course"}
            />
            <TextInput
                style={[style.unit, style.txtInput]}
                onChangeText={text=> onChangeSecret(text)}
                value={secret}
                placeholder={"Enter the Course Secret"}
            />
            <View>
                <TouchableOpacity
                    onPress={() => registerForCourse()}>
                    <Text style={[style.btn, style.lightgreen]}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Text style={[style.btn, style.lightblue]}>Cancel</Text>
                </TouchableOpacity>
            </View>
            {isLoading && <ActivityIndicator color={"#333"} style={{"marginTop": 20}}/>}
        </ScrollView>
    )
}

export default AddClassScreen;
