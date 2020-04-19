import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

function AddClassScreen({route, navigation}) {
    const [code, onChangeCode] = React.useState("");
    const [subCode, onChangeSubCode] = React.useState("");
    const [secret, onChangeSecret] = React.useState("");
    const [isLoading, onChangeLoading] = React.useState(false);
    const {user} = route.params;
    let {data} = route.params;

    const registerForCourse = async () => {
      if (code === "" || secret === ""){
          Alert.alert("Error", "Please enter all required information");
      }
      else{
          try{
              onChangeLoading(true);
              const ref = database().ref();
              // const courseData = await ref.child('courses').child(code).once('value');
              const courseData = await ref.child('courses').once('value');
              if (courseData) {

                  const coursesKeys =  Object.keys(courseData.val());
                  const length = coursesKeys.length;
                  let currCourse = {};

                  for (let i = 0; i < length; i++){
                      const curr = courseData.val()[coursesKeys[i]];
                      if (curr.code === code && curr.subcode === subCode){
                          currCourse = curr;
                          break;
                      }
                  }
                  console.log(currCourse);
                  if (currCourse){
                      const key = currCourse.id;
                      let updates = {};
                      updates[`/courses/${key}/students/${user}`] = true;
                      updates[`/users/${user}/courses/${key}`] = true;

                      ref.update(updates);
                      data.courses[`${key}`] = true;
                      onChangeLoading(false);
                      navigation.navigate("MainPage", {uid: user, data: data, update: true})
                  }
                  else{
                      Alert.alert("Course does not exist");
                  }
              }
              else{
                  Alert.alert("Error", "Incorrect Course Code")
                  onChangeLoading(false)
              }
          }
          catch (e) {
              Alert.alert("Error", "Incorrect Course Code or Secret")
              onChangeLoading(false)
          }

      }
    };

    return(
        <View style={styles.container}>

            <Text style={{marginTop: 20, fontSize: 20}}>Sign up for a Course</Text>
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeCode(text)}
                value={code}
                placeholder={"Enter the Course Code that you want to join"}
            />
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeSubCode(text)}
                value={subCode}
                placeholder={"Enter the Sub Code for the course"}
            />
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeSecret(text)}
                value={secret}
                placeholder={"Enter the Course Secret"}
            />
            <View style={styles.btnRow}>
                <TouchableOpacity
                    onPress={() => registerForCourse()}>
                    <Text style={[styles.btn, styles.btnSubmit]}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Text style={[styles.btn, styles.btnSignUp]}>Cancel</Text>
                </TouchableOpacity>
            </View>
            {isLoading && <ActivityIndicator color={"#333"} style={{"marginTop": 20}}/>}
        </View>
    )
}

export default AddClassScreen;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    txtInput : {
        height: 40,
        borderColor: 'gray',
        width: "80%",
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        textAlign: "center"
    },
    btn: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5
    },
    btnSubmit: {
        backgroundColor: "lightgreen"
    },
    btnSignUp: {
        backgroundColor: "lightblue"
    }
});
