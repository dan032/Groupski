import * as React from 'react';
import {
    Button,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from 'react-native';

function Course({route, navigation}) {
    const {user} = route.params;
    const {course} = route.params;
    const groups = route.params.course.groups.filter(group => {
        return user.groups.includes(group.id)
    });

    return (
        <View style={styles.container}>
            <Text>{course.code}</Text>
            {console.log(course.groups)}
            {console.log(user.groups.includes(groups[0]))}
            {groups.map((group) => (
                <TouchableOpacity
                onPress={() => navigation.navigate('Group', group)}
                style={styles.group}
                >
                    <Text>Group #{group.id}</Text>
                </TouchableOpacity>
        ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // flexDirection: "column"
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


export default Course;
