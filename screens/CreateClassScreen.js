import * as React from 'react';
import style from '../css/style';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';

import database from '@react-native-firebase/database';


function CreateClassScreen({route, navigation}) {
    const [code, onChangeCode] = React.useState("");
    const [subCode, onChangeSubCode] = React.useState("");
    const [courseName, onChangeCourseName] = React.useState("");
    const [secret, onChangeSecret] = React.useState("");
    const [isLoading, onChangeLoading] = React.useState(false);
    const {user, data} = route.params;

    // Allows the teacher to create a class
    const createClass = async () => {
        if (code === "" || subCode === "" || courseName === "" ||secret === ""){
            Alert.alert("Error", "Please enter all required information");
        }
        else{
            try{
                onChangeLoading(true);
                const ref = database().ref();
                const courseData = await ref.child('courses').once('value');
                let exists = false;
                if (courseData.val()){
                    const coursesKeys =  Object.keys(courseData.val());
                    const length = coursesKeys.length;

                    // Ensures that the prof doesn't try to create a course
                    // that already exists
                    for (let i = 0; i < length; i++){
                        const curr = courseData.val()[coursesKeys[i]];
                        if (curr.code === code && curr.subcode === subCode){
                            exists = true;
                            break;
                        }
                    }
                }

                if (exists){
                    Alert.alert("Error", "Course Already exists!");
                    onChangeLoading(false);
                }
                else{
                    // Gets a id for the course
                    const key = ref.child('courses').push().key;
                    let newCourse = {
                        code,
                        id: key,
                        subcode: subCode,
                        prof: user,
                        title: courseName,
                        secret
                    };

                    // Updates the course table and teacher with the course
                    let updates = {};
                    updates[`/users/${user}/courses/${key}`] = true;
                    ref.update(updates);
                    ref.child('courses').child(key).update(newCourse);

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
    };

    return (
        <ScrollView contentContainerStyle={style.container}>
            <Text style={{fontSize: 25, marginTop: 20, fontWeight: "bold"}}>Create a Course</Text>
            <TextInput
                style={[style.unit, style.txtInput]}
                onChangeText={text=> onChangeCode(text)}
                value={code}
                placeholder={"Enter the Course Code for the course"}
            />
            <TextInput
                style={[style.unit, style.txtInput]}
                onChangeText={text=> onChangeSubCode(text)}
                value={subCode}
                placeholder={"Enter the Sub Code for the course"}
            />
            <TextInput
                style={[style.unit, style.txtInput]}
                onChangeText={text=> onChangeCourseName(text)}
                value={courseName}
                placeholder={"Enter the Course Name"}
            />
            <TextInput
                style={[style.unit, style.txtInput]}
                onChangeText={text=> onChangeSecret(text)}
                value={secret}
                placeholder={"Enter the Course Secret"}
            />
            <View>
                <TouchableOpacity
                    onPress={() => createClass()}>
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

export default CreateClassScreen
