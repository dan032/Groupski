import * as React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

function Group(props) {
    return(
        <TouchableOpacity
            onPress={() => props.navigation.navigate('Group', {group: props.group})}
            style={styles.group}
        >
            <Text>Group Name: {props.group.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
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

export default Group;
