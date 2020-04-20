import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';


function Course(props) {

    //course deletion here
    const deleteCourse = () => {
        console.log('deleting press confirmed')
    }

    const deleteAlert = () => {
        //only fire if admin/professor
        if(props.isProf){
            console.log("is prof")
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
        else{
            console.log("not prof, go away")
        }
    }

    return(
        <TouchableOpacity
            style={styles.course}
            onPress={() => props.navigation.navigate('Course',
                {course: props.course.courseData.val(), user: props.user, isProf: props.isProf, update: true, data: props.data})}
            onLongPress={() => {deleteAlert()}}
        >
            {console.log("Course: "+ JSON.stringify(props.course))}
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
