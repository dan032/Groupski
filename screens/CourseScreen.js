import * as React from 'react';
import {
    Button,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from 'react-native';

import Group from '../components/Group';

function CourseScreen({route, navigation}) {
    const {user} = route.params;
    const {course} = route.params;
    const groups = route.params.course.groups.filter(group => {
        return user.groups.includes(group.id)
    });

    return (
        <View style={styles.container}>
            <Text>{course.code}</Text>
            {groups.map((group) => (
                <Group navigation={navigation} group={group}/>
        ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
})


export default CourseScreen;
