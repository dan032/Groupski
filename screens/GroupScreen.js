import * as React from 'react';
import {
    View,
    Text,
    StyleSheet, TouchableOpacity, ScrollView, PermissionsAndroid, Alert,
} from 'react-native';
import database from '@react-native-firebase/database';
import Geolocation from "react-native-geolocation-service";

function GroupScreen({route, navigation}) {
    const {group, user, isProf,course} = route.params;
    const [members, onMembersChange] = React.useState([])
    const [isLoading, onLoadingChange] = React.useState(true);
    const [inGroup, onChangeInGroup] = React.useState(true);

    //UI does not update to reflect removed members
    //Need to check if user removing is leader or removing themselves to allow removal
    async function removeFromGroup(memberId){
        const ref = database().ref(`/groups/${group.id}/members/${memberId}`);
        console.log(`removing: ${(await ref.once('value')).val()}`)
        //ref.remove();
    }

    async function loadMemberData(memberId) {
        const ref = database().ref(`/users/${memberId}`);
        const memberData = await ref.once('value');
        return new Promise((resolve, reject) => {
            if (group !== null){
                resolve({memberData})
            }
            else{
                reject(null)
            }

        });
    }

    const groupCheck = async () => {
        const ref = database().ref()
        const currUserData = await ref.child(`/users/${user}`).once('value');
        console.log(JSON.stringify(course))
        if (currUserData.val().groups){
            const userGroupKeys = Object.keys(currUserData.val().groups);
            let alreadyInGroup = false;
            for (let i = 0; i < userGroupKeys.length; i++){
                if (userGroupKeys[i] in course.groups){
                    alreadyInGroup = true;
                }
            }
            return new Promise((resolve, reject) => {
                resolve(alreadyInGroup)
            })
        }
    };

    React.useState( () => {
        if (group.members){
            Object.keys(group.members).map(member => {
                loadMemberData(member).then(resolve => onMembersChange(members => [...members, resolve])).catch(() => {})

            })
        }

        groupCheck().then((res) => {
            onChangeInGroup(res)
            console.log(res)
        })

        onLoadingChange(false);
    });


    return (
        <View style={styles.container}>

            {members.map(member => (
                <TouchableOpacity onLongPress={()=>removeFromGroup(member.memberData.val().id)}>
                    <Text style={styles.member}>{member.memberData.val().name}</Text>
                </TouchableOpacity>
            ))}
            {members.length === 0 && !isLoading && <Text style={{fontSize: 15, color: "red", marginTop: 20}}>{"There are no members in the group yet"}</Text>}
            {!inGroup &&
            <TouchableOpacity style={styles.member}>
                <Text>{"Join group"}</Text>
            </TouchableOpacity>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    member: {
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
