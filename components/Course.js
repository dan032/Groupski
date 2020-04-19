import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';


function Course(props) {

    return(
        <TouchableOpacity
            style={styles.course}
            onPress={() => props.navigation.navigate('Course', {course: props.course.courseData.val(), user: props.user})}
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
