import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';

import database from '@react-native-firebase/database';


function Course(props) {

    //course deletion here
    const deleteCourse = async () => {
        const courseId = props.course.courseData.val().id;
        const ref = database().ref();
        const userData = await ref.child('users').once('value');
        const groupData = await ref.child('groups').once('value');

        const userKeys = Object.keys(userData.val());
        const groupKeys = Object.keys(groupData.val());

        for (let i = 0; i < userKeys.length; i++){
            if (userData.val()[userKeys[i]].courses && courseId in userData.val()[userKeys[i]].courses){
                ref.child(`/users/${userKeys[i]}/courses/${courseId}`).remove()
            }
        }

        for (let i = 0; i < groupKeys.length; i++){
            if (groupData.val()[groupKeys[i]].course && courseId === groupData.val()[groupKeys[i]].course){
                ref.child(`/groups/${groupKeys[i]}`).remove()
            }
        }

        const updatedUserData = await ref.child(`users/${props.user}`).once('value');

        ref.child(`/courses/${courseId}`).remove();
        props.navigation.navigate("MainPage", {uid: props.user, data:updatedUserData.val(), update: true})
    };

    const deleteAlert = () => {
        //only fire if admin/professor
        if(props.isProf){
            Alert.alert(
                'Notice!',
                'Do you want to delete this course?',
                [
                    //delete logic
                    {text: 'Yes', onPress: () => deleteCourse()},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: true},
            );
        }
    }

    return(
        <TouchableOpacity
            style={styles.course}
            onPress={() => props.navigation.navigate('Course',
                {course: props.course.courseData.val(), user: props.user, isProf: props.isProf, update: true, data: props.data})}
            onLongPress={() => {deleteAlert()}}
        >
            <Text>{props.course.courseData.val().code}</Text>
            <Text>{props.course.courseData.val().title}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    course: {
        padding: 30,
        height: 40,
        borderColor: 'gray',
        width: "80%",
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue"
}})

export default Course;
