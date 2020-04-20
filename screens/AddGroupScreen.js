import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';

import database from '@react-native-firebase/database';

function AddGroupScreen({route, navigation}) {
    const [isLoading, onChangeLoading] = React.useState(false);
    const [groupName, onChangeGroupName] = React.useState("");
    const {user, course} = route.params;

    const createGroup = async () => {
        if (groupName === ""){
            Alert.alert("Error", "Please enter a group name");
        }
        else{
            onChangeLoading(true);
            const ref = database().ref();
            const groupData = await ref.child('groups').once('value');
            const key = ref.child('groups').push().key;

            if (groupName in groupData.val()){
                Alert.alert("Error", "Group already exists!");
            }
            else{
                let updates = {};
                console.log(course)
                const courseCode = course.id;
                let group = {
                    id: key,
                    beingGraded: false,
                    course: courseCode,
                    title: groupName
                };
                updates[`/groups/${key}/members/${user}`] = true;
                updates[`/users/${user}/groups/${key}`] = true;
                updates[`/courses/${course.id}/groups/${key}`] = true;

                ref.child('groups').child(key).update(group);
                ref.update(updates);

                if (course.groups === undefined){
                    course["groups"] = {
                        [key]: true
                    };
                }
                else{
                    course.groups = {...course.groups, [key]: true}
                }
                console.log("KEY: " + key);
                console.log("Course: " + JSON.stringify(course));
                onChangeLoading(false);
                navigation.navigate("Course", {user: user, course: course, update: true})
            }
        }
    }

    return(
        <View style={styles.container}>
            <Text style={{marginTop: 20, fontSize: 20}}>Create a Group</Text>
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeGroupName(text)}
                value={groupName}
                placeholder={"Enter the Group name"}
            />
            <View style={styles.btnRow}>
                <TouchableOpacity
                    onPress={() => createGroup()}>
                    <Text style={[styles.btn, styles.btnSubmit]}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Text style={[styles.btn, styles.btnSignUp]}>Cancel</Text>
                </TouchableOpacity>
            </View>
            {isLoading && <ActivityIndicator color={"#333"} style={{"marginTop": 20}}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    txtInput : {
        height: 40,
        borderColor: 'gray',
        width: "80%",
        borderWidth: 1,
        marginTop: 20,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        textAlign: "center"
    },
    btn: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5
    },
    btnSubmit: {
        backgroundColor: "lightgreen"
    },
    btnSignUp: {
        backgroundColor: "lightblue"
    }
});

export default AddGroupScreen

