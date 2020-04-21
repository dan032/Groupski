import * as React from 'react';
import style from '../css/style';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert, ScrollView,
} from 'react-native';

import database from '@react-native-firebase/database';

function AddGroupScreen({route, navigation}) {
    const [isLoading, onChangeLoading] = React.useState(false);
    const [groupName, onChangeGroupName] = React.useState("");
    const {user, course} = route.params;

    // Allows the user to create a group
    const createGroup = async () => {
        if (groupName === ""){
            Alert.alert("Error", "Please enter a group name");
        }
        else{
            onChangeLoading(true);

            // Acquires a reference of the database, and uses it to
            // create a UID for the new group
            const ref = database().ref();
            const key = ref.child('groups').push().key;
            const groupData = await ref.child('groups').once('value');
            let exits = false;

            if (groupData.val()){
                const groupKeys = Object.keys(groupData.val());

                // Ensures that there isn't a group in the class with the same name

                for (let i = 0; i < groupKeys.length; i++){
                    console.log(groupData.val()[groupKeys[i]]);
                    if (groupName === groupData.val()[groupKeys[i]].title && course.id === groupData.val()[groupKeys[i]].course){
                        exits = true;
                        break;
                    }
                }
            }

            if (exits){
                Alert.alert("Error", "Group already exists!");
                onChangeLoading(false)
            }
            else{
                let updates = {};
                const courseCode = course.id;
                let group = {
                    id: key,
                    beingGraded: false,
                    course: courseCode,
                    title: groupName
                };

                // Sets up relationship between the user, course and the group
                updates[`/groups/${key}/members/${user}`] = true;
                updates[`/users/${user}/groups/${key}`] = true;
                updates[`/courses/${course.id}/groups/${key}`] = true;
                ref.child('groups').child(key).update(group);
                ref.update(updates);

                // Updates data stored in the program to be sent back to CourseScreen
                if (course.groups === undefined){
                    course["groups"] = {
                        [key]: true
                    };
                }
                else{
                    course.groups = {...course.groups, [key]: true}
                }
                onChangeLoading(false);
                navigation.navigate("Course", {user: user, course: course, update: true})
            }
        }
    };

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={{marginTop: 20, fontSize: 20}}>Create a Group</Text>
            <TextInput
                style={[style.unit, style.txtInput]}
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    btn: {
        marginTop: 20,
        padding: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey"
    },
    btnSubmit: {
        backgroundColor: "lightgreen"
    },
    btnSignUp: {
        backgroundColor: "lightblue"
    }
});

export default AddGroupScreen

