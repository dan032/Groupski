import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet, ScrollView,
    BackHandler
} from 'react-native';

import Group from '../components/Group';
import database from '@react-native-firebase/database';

function CourseScreen({route, navigation}) {
    const [groups, onGroupChange] = React.useState([])
    const {course, user, group, isProf, update, data} = route.params;
    const [isLoading, onLoadingChange] = React.useState(true);

    async function loadGroupData(groupId) {

        const ref = database().ref(`/groups/${groupId}`);
        const groupData = await ref.once('value');
        return new Promise((resolve, reject) => {
            if (course !== null){

                resolve({groupData})
            }
            else{
                reject(null)
            }

        });
    }

    const updateCourse = () => {
        onGroupChange([]);

        if (course.groups) {
            Object.keys(course.groups).map((groupId) => {
                loadGroupData(groupId).then(resolve => onGroupChange(groups => [...groups, resolve])).catch(() => {
                });
            })
        }
        route.params.update = false;
        onLoadingChange(false);
    };

    const navBack = () => {

        if (course.groups){
            const keys = Object.keys(course.groups);
            let newGroups = {};
            for (let i = 0; i < keys.length; i++){
                newGroups ={
                    ...newGroups,
                    [keys[i]] : true
                }
            }
            data.groups = {...data.courses.groups, ...newGroups}
            console.log(data)
        }

        navigation.navigate("MainPage", {data: data, uid: user, update: true});
        return true;
    }

    React.useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", navBack);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", navBack);
        }
    },[])

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text>{course.code}</Text>
            <TouchableOpacity
                style={styles.group}
                onPress={() => navigation.navigate('AddGroup', {user: user, course: course})}
            >
                {console.log("COURSE: " + JSON.stringify(course))}
                <Text>Add a Group</Text>
            </TouchableOpacity>
            {groups.map((group) => (
                <Group navigation={navigation} group={group.groupData.val()} user={user} isProf={isProf} course={course} data={{data}}/>
        ))}
        {groups.length === 0 && !isLoading && <Text style={{fontSize: 15, color: "red", marginTop: 20}}>{"There are no groups in the course yet"}</Text>}
        {update && updateCourse()}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    group: {
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


export default CourseScreen;
