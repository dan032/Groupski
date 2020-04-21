import * as React from 'react';
import style from '../css/style';
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

            <Text style={{fontSize: 25, marginTop: 20, fontWeight: "bold"}}>Welcome to the Main Page!</Text>
            <Text style={{marginTop: 10, fontSize: 20}}>Hello {data.name}</Text>
            {data.isProf && <TouchableOpacity
                style={[style.unit, style.lightgreen]}
                onPress={() => navigation.navigate('CreateClass', {user: uid, data: data})}
            >
                <Text>Create a Course</Text>
            </TouchableOpacity>}

            {!data.isProf && <TouchableOpacity
                style={[style.unit, style.lightgreen]}
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

});
export default MainPage;
