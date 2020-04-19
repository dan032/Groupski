import * as React from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet, TouchableOpacity,
} from 'react-native';

import Course from '../components/Course';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

function MainPage({route, navigation}) {
    const data = route.params.data;
    const uid = route.params.uid;
    const [courses, onCourseChange] = React.useState([]);

    async function loadCourseData(courseId) {
        const ref = database().ref(`/courses/${courseId}`);
        const courseData = await ref.once('value');
        return new Promise((resolve, reject) => {
            if (data !== null){
                resolve({courseData})
            }
            else{
                reject(null)
            }

        });
    }

    const updateData = () => {
        onCourseChange([]);
        Object.keys(data.courses).map((courseId) => {
            loadCourseData(courseId).then(resolve => onCourseChange(courses => [...courses, resolve])).catch(() => {
                console.log("Error courses")
            });
        })
        route.params.update = false;
    }

    React.useState(() => {
        console.log("IN US: " + JSON.stringify(data));
        if (data.courses){
            Object.keys(data.courses).map((courseId) => {
                loadCourseData(courseId).then(resolve => onCourseChange(courses => [...courses, resolve])).catch(() => {
                    console.log("Error courses")
                });
            })
        }
    },[]);

    return (

        <ScrollView contentContainerStyle={styles.container}>
            <Text style={{fontSize: 20, marginTop: 20}}>Main Page</Text>
            <Text style={{marginTop: 10}}>Hello {data.name}</Text>

            <TouchableOpacity
                style={styles.course}
                onPress={() => navigation.navigate('AddClass', {user: uid, data: data})}
            >
                <Text>{"Add a Course"}</Text>
            </TouchableOpacity>
            {courses.map(course => (

                <Course course={course} user={uid} navigation={navigation}/>
            ))}
            {courses.length === 0 && <Text style={{fontSize: 15, color: "red", marginTop: 20}}>{"You are not signed up for any courses"}</Text>}
            {route.params.update && updateData()}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
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
    }
})
export default MainPage;
