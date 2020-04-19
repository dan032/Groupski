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
              const ref = database

              const courseRef = database().ref(`/courses/${code}`);
              const userRef = database().ref(`/users/${user}`);
              const courseData = await courseRef.once('value');

              if (courseData) {
                  if (courseData.val().secret == secret) {
                      let courseUpdates = {};
                      let userUpdates = {};
                      courseUpdates[`/students/${user}`] = true;
                      userUpdates[`/courses/${code}`] = true;

                      courseRef.update(courseUpdates);
                      userRef.update(userUpdates);
                      // const newData = await database().ref(`/users/${user}`);
                      data.courses[`${code}`] = true;
                      onChangeLoading(false);
                      navigation.navigate("MainPage", {uid: user, data: data, update: true})
                  }
                   else {
                      Alert.alert("Error", "Incorrect Secret");
                      onChangeLoading(false)
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
