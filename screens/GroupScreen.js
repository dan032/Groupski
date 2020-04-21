import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import database from '@react-native-firebase/database';

function GroupScreen({route, navigation}) {
    const {group, user, isProf,course} = route.params;
    let {update} = route.params;
    const [members, onMembersChange] = React.useState([]);
    const [isLoading, onLoadingChange] = React.useState(true);
    const [inGroup, onChangeInGroup] = React.useState(true);

    // Allows the prof or the current user to take themselves out of a group
    async function removeFromGroup(member){
        if(isProf || member.id === user){
            const userInGroups = database().ref(`/groups/${group.id}/members/${member.id}`);
            const groupInUser = database().ref(`/users/${member.id}/groups/${group.id}`);
            console.log(`removing user in groups: ${(await userInGroups.once('value')).val()}`);
            console.log(`removing group in user: ${(await groupInUser.once('value')).val()}`);
            userInGroups.remove();
            groupInUser.remove();

            const ref = database().ref(`/groups/${group.id}`);
            const updatedGroupData = await ref.once('value');
            navigation.navigate("Course", {group:updatedGroupData.val(), user, isProf, course, update: true})

        }else{
            Alert.alert("Error","You must be a professor to remove members other than yourself.")
        }
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

    // Checks if the user is currently in a group
    // Used so users not in a group cannot grade another group
    const groupCheck = async () => {
        const ref = database().ref();
        const currUserData = await ref.child(`/users/${user}`).once('value');
        if (currUserData.val().groups){
            const userGroupKeys = Object.keys(currUserData.val().groups);
            let alreadyInGroup = false;
            for (let i = 0; i < userGroupKeys.length; i++){
                if (userGroupKeys[i] in course.groups){
                    alreadyInGroup = true;
                }
            }
            return new Promise((resolve) => {
                resolve(alreadyInGroup)
            })
        }
    };

    // Adds the user to the group
    const addUser = () => {
        const ref = database().ref();
        let updates = {};
        updates[`/groups/${group.id}/members/${user}`] = true;
        updates[`/users/${user}/groups/${group.id}`] = true;

        ref.update(updates);
        group.member = {
            ...group.member, [user] : true
        };
        course.groups = {
            ...course.groups, [group.id] : true
        };
        navigation.navigate("Course", {group, user, isProf, course, update: true})
    };

    // Used to update the screen when visited
    const updateData = () => {
        if (group.members){
            onMembersChange([]);
            Object.keys(group.members).map(member => {
                loadMemberData(member).then(resolve => onMembersChange(members => [...members, resolve])).catch(() => {})

            })
        }
        route.params.update = false;
        groupCheck().then((res) => {
            onChangeInGroup(res)
        });

        onLoadingChange(false);
    };

    return (
        <View style={styles.container}>
            <Text>{group.title}</Text>
            <View>
                {group.finalGrade && <Text>
                    {`Final Grade is: ${group.finalGrade}`}
                </Text>}
            </View>
            {members.map(member => (
                <TouchableOpacity style={styles.member} onLongPress={()=>removeFromGroup(member.memberData.val())}>
                    <Text >{member.memberData.val().name}</Text>
                </TouchableOpacity>
            ))}
            {route.params.update && updateData()}
            {members.length === 0 && !isLoading && <Text style={{fontSize: 15, color: "red", marginTop: 20}}>{"There are no members in the group yet"}</Text>}
            {!inGroup &&
            <TouchableOpacity
                style={styles.member}
                onPress={() => addUser()}
            >
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
});
export default GroupScreen
