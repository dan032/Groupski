import * as React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import database from '@react-native-firebase/database';

function GroupScreen({route, navigation}) {
    const {group} = route.params;
    const [members, onMembersChange] = React.useState([])
    const [isLoading, onLoadingChange] = React.useState(true);

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

                <Text style={styles.member}>{member.memberData.val().name}</Text>
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
