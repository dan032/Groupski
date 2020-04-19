import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet, ScrollView,
} from 'react-native';

import Group from '../components/Group';
import database from '@react-native-firebase/database';

function CourseScreen({route, navigation}) {
    const [groups, onGroupChange] = React.useState([])
    const {course, user, group} = route.params;
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

    React.useState(() => {
        if (course.groups){
            Object.keys(course.groups).map((groupId) =>{
                loadGroupData(groupId).then(resolve => onGroupChange(groups => [...groups, resolve])).catch(() => {
                });
            })
        }
        onLoadingChange(false);
        }, []);

    return (
        <View style={styles.container}>
            <Text>{course.code}</Text>
            {groups.map((group) => (
                <Group navigation={navigation} group={group.groupData.val()}/>
        ))}
        {groups.length === 0 && !isLoading && <Text style={{fontSize: 15, color: "red", marginTop: 20}}>{"There are no groups in the course yet"}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
})


export default CourseScreen;
