import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert, ScrollView,
} from 'react-native';
import database from '@react-native-firebase/database';

function GroupScreen({route, navigation}) {
    const {group, user, isProf,course} = route.params;
    const [members, onMembersChange] = React.useState([]);
    const [isLoading, onLoadingChange] = React.useState(true);
    const [inGroup, onChangeInGroup] = React.useState(true);
    const [inThisGroup, onChangeInThisGroup] = React.useState(true);

    // Allows the prof or the current user to take themselves out of a group
    async function removeFromGroup(member){

        const userInGroups = database().ref(`/groups/${group.id}/members/${member.id}`);
        const groupInUser = database().ref(`/users/${member.id}/groups/${group.id}`);
        console.log(`removing user in groups: ${(await userInGroups.once('value')).val()}`);
        console.log(`removing group in user: ${(await groupInUser.once('value')).val()}`);
        userInGroups.remove();
        groupInUser.remove();

        const ref = database().ref(`/groups/${group.id}`);
        const updatedGroupData = await ref.once('value');
        navigation.navigate("Course", {group:updatedGroupData.val(), user, isProf, course, update: true})

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
        let itg = false;
        let alreadyInGroup = false;
        if (currUserData.val().groups){
            const userGroupKeys = Object.keys(currUserData.val().groups);


            for (let i = 0; i < userGroupKeys.length; i++){
                if (userGroupKeys[i] in course.groups){
                    alreadyInGroup = true;
                }
                if (user in group.members){
                    itg = true;
                }
            }
        }
        return new Promise((resolve) => {
            resolve([alreadyInGroup, itg])
        })
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

        groupCheck().then((ig) => {
            onChangeInGroup(ig[0]);
            onChangeInThisGroup(ig[1]);
        });
        route.params.update = false;
        onLoadingChange(false);
    };
    const clickAlert = (member) => {
        if (isProf || member.id === user) {
            const msg = member.id !== user ? "Remove from group?": "Do you want to leave the group?";
            Alert.alert(
                'Warning!',
                msg,
                [
                    {text: 'Leave', onPress: () => removeFromGroup(member)},
                    {text: 'Cancel', style: 'cancel'},
                ])

        } else {
            Alert.alert("Error", "You must be a professor to remove members other than yourself.")
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{group.title} Page</Text>
            <View style={styles.finalGradeContainer}>
                {group.finalGrade && (inThisGroup || isProf) &&
                <Text style={styles.finalGrade}>
                    {`Final Grade is: ${group.finalGrade} %`}
                </Text>}
            </View>
            {!inGroup &&
            <TouchableOpacity
                style={[styles.member, styles.btn]}
                onPress={() => addUser()}
            >
                <Text>{"Join group"}</Text>
            </TouchableOpacity>}

            {members.map((member, i) => (
                <TouchableOpacity key={i} style={styles.member} onLongPress={()=>clickAlert(member.memberData.val())}>
                    <Text >{member.memberData.val().name}</Text>
                </TouchableOpacity>
            ))}
            {route.params.update && updateData()}
            {members.length === 0 && !isLoading && <Text style={{fontSize: 15, color: "red", marginTop: 20}}>{"There are no members in the group yet"}</Text>}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    header: {
        fontSize: 25,
        marginTop: 20,
        fontWeight: "bold"
    },
    finalGradeContainer: {
        marginTop: 20,

    },
    finalGrade: {
        fontSize: 20,
        color: "darkred"
    },
    member: {
        height: 40,
        paddingVertical: 30,
        borderColor: 'gray',
        width: "80%",
        borderWidth: 1,
        marginTop: 20,
        textAlign: "center",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue"
    },
    btn:{
         backgroundColor: "lightgreen"
    }
});
export default GroupScreen
