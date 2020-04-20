import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet, ScrollView, ActivityIndicator, Alert,
} from 'react-native';

import database from '@react-native-firebase/database';


function CreateClassScreen({route, navigation}) {
    const [code, onChangeCode] = React.useState("");
    const [subCode, onChangeSubCode] = React.useState("");
    const [courseName, onChangeCourseName] = React.useState("");
    const [secret, onChangeSecret] = React.useState("");
    const [isLoading, onChangeLoading] = React.useState(false);
    const {user, data} = route.params;

    const createClass = async () => {
        if (code === "" || subCode === "" || courseName === "" ||secret === ""){
            Alert.alert("Error", "Please enter all required information");
        }
        else{
            try{
                onChangeLoading(true);
                const ref = database().ref();
                const courseData = await ref.child('courses').once('value');

                const coursesKeys =  Object.keys(courseData.val());
                const length = coursesKeys.length;
                let exists = false;

                for (let i = 0; i < length; i++){
                    const curr = courseData.val()[coursesKeys[i]];
                    if (curr.code === code && curr.subcode === subCode){
                        exists = true;
                        break;
                    }
                }
                if (exists){
                    Alert.alert("Error", "Course Already exists!")
                    onChangeLoading(false);
                }
                else{
                    const key = ref.child('courses').push().key;
                    let newCourse = {
                        code,
                        id: key,
                        subcode: subCode,
                        prof: user,
                        title: courseName,
                        secret
                    };
                    let updates = {}
                    updates[`/users/${user}/courses/${key}`] = true;
                    ref.update(updates)
                    ref.child('courses').child(key).update(newCourse);
                    console.log(JSON.stringify(data))

                    if (data.courses === undefined){
                        data.courses = {[key] : true}
                    }
                    else{
                        data.courses = {...data.courses, [key]: true}
                    }

                    onChangeLoading(false);
                    navigation.navigate("MainPage", {uid: user, data: data, update: true})
                }
            }
            catch (e) {
                Alert.alert("Error", e.message);
                onChangeLoading(false);
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{marginTop: 20, fontSize: 20}}>Sign up for a Course</Text>
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeCode(text)}
                value={code}
                placeholder={"Enter the Course Code for the course"}
            />
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeSubCode(text)}
                value={subCode}
                placeholder={"Enter the Sub Code for the course"}
            />
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeCourseName(text)}
                value={courseName}
                placeholder={"Enter the Course Name"}
            />
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeSecret(text)}
                value={secret}
                placeholder={"Enter the Course Secret"}
            />
            <View style={styles.btnRow}>
                <TouchableOpacity
                    onPress={() => createClass()}>
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

export default CreateClassScreen
