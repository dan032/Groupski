import * as React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import Course from '../components/Course';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

function MainPage({route, navigation}) {
    const data = route.params.data;
    const uid = route.params.uid;
    const [courses, onCourseChange] = React.useState([])

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

    React.useState(() => {
        Object.keys(data.courses).map((courseId) => {
            loadCourseData(courseId).then(resolve => onCourseChange(courses => [...courses, resolve])).catch(() => {
                console.log("Error courses")
            });
        })

    },[]);

    return (

        <View style={styles.container}>
            <Text style={{fontSize: 20, marginTop: 20}}>Main Page</Text>
            <Text style={{marginTop: 10}}>Hello {data.name}</Text>

            {courses.map(course => (

                <Course course={course} user={uid} navigation={navigation}/>
            ))}

        </View>
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
