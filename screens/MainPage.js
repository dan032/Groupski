import * as React from 'react';
import {
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

import Course from '../components/Course';
import database from '@react-native-firebase/database';

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

    // Updates page when visited
    const updateData =  () => {
        if (data.courses){
            onCourseChange([]);
            Object.keys(data.courses).map((courseId) => {

                loadCourseData(courseId).then(resolve => onCourseChange(courses => [...courses, resolve])).catch(() => {
                });
            });

        }
        route.params.update = false;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={{fontSize: 20, marginTop: 20}}>Main Page</Text>
            <Text style={{marginTop: 10}}>Hello {data.name}</Text>
            {data.isProf && <TouchableOpacity
                style={styles.course}
                onPress={() => navigation.navigate('CreateClass', {user: uid, data: data})}
            >
                <Text>Create a Course</Text>
            </TouchableOpacity>}

            {!data.isProf && <TouchableOpacity
                style={styles.course}
                onPress={() => navigation.navigate('AddClass', {user: uid, data: data})}
            >
                <Text>Add a Course</Text>
            </TouchableOpacity>}

            {courses.map((course, i) => (

                <Course key={i} course={course} user={uid} navigation={navigation} isProf={data.isProf} update={true} data={data}/>
            ))}
            {route.params.update && updateData() && <ActivityIndicator color={"#333"} style={{"marginTop": 20}}/>}
            {courses.length === 0 && !route.params.update && <Text style={{fontSize: 15, color: "red", marginTop: 20}}>You are not signed up for any courses</Text>}
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
});
export default MainPage;
