import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

function MainPage({route, navigation}) {
    const {data} = route.params;
    return (

        <View style={styles.container}>
            <Text style={{fontSize: 20, marginTop: 20}}>Main Page</Text>
            <Text style={{marginTop: 10}}>Hello {data[0].userName}</Text>

            {data[0].courses.map(course => (
                <TouchableOpacity
                    style={styles.course}
                    onPress={() => navigation.navigate('Course', {course, user: data[0]})}
                >
                    <Text>{course.code}</Text>
                    <Text>{course.title}</Text>
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
