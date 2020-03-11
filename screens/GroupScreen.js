import * as React from 'react';
import {
    Button,
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';

function GroupScreen({route, navigation}) {
    const {members} = route.params;
    return (
        <View style={styles.container}>
            {console.log(members)}
            {members.map((member) => (
                // console.log(member.userName)
                <Text style={styles.member}>{member.userName}</Text>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // flexDirection: "column"
    },
    member: {
        // paddingHorizontal: 1,
        height: 40,
        borderColor: 'gray',
        width: "80%",
        borderWidth: 1,
        marginTop: 20,
        textAlign: "center",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 0x00fa9aff
    }
})
export default GroupScreen
