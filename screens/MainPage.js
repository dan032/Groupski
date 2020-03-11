import * as React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import Course from '../components/Course';

function MainPage({route, navigation}) {
    const data = route.params.resolve._snapshot.value;
    return (

        <View style={styles.container}>
            <Text style={{fontSize: 20, marginTop: 20}}>Main Page</Text>
            <Text style={{marginTop: 10}}>Hello {data.userName}</Text>

            {data.courses.map(course => (
                <Course course={course} user={data} navigation={navigation}/>
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
