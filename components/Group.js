import * as React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

function Group(props) {

    const groupClick = () => {
        if (props.group.beingGraded){
            props.navigation.navigate('Rubric', {group: props.group})
        }
        else{
            props.navigation.navigate('Group', {group: props.group})
        }
    }

    return(
        <TouchableOpacity
            onPress={() => groupClick()}
            style={[styles.group, props.group.beingGraded && styles.active]}
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
    },
    active: {
        backgroundColor: 'lightgreen'
    }
})

export default Group;
