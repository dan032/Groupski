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

    //UI does not update to reflect removed members
    //Need to check if user removing is leader or removing themselves to allow removal
    async function removeFromGroup(member){
        console.log(user.id);
        if(isProf || member.id === user.id){
        const userInGroups = database().ref(`/groups/${group.id}/members/${member.id}`);
        const groupInUser = database().ref(`/users/${member.id}/groups/${group.id}`);
        console.log(`removing user in groups: ${(await userInGroups.once('value')).val()}`);
        console.log(`removing group in user: ${(await groupInUser.once('value')).val()}`);
        }
        //userInGroups.remove();
        //groupInUser.remove();
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


    React.useState(() => {
        if (group.members){
            Object.keys(group.members).map(member => {
                loadMemberData(member).then(resolve => onMembersChange(members => [...members, resolve])).catch(() => {})

            })
        }
        onLoadingChange(false);
    });


    return (
        <View style={styles.container}>

            {members.map(member => (
                <TouchableOpacity onLongPress={()=>removeFromGroup(member.memberData.val())}>
                    <Text style={styles.member}>{member.memberData.val().name}</Text>
                </TouchableOpacity>
            ))}
            {members.length === 0 && !isLoading && <Text style={{fontSize: 15, color: "red", marginTop: 20}}>{"There are no members in the group yet"}</Text>}

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
