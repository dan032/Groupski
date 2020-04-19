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
        Object.keys(group.members).map(member => {
            loadMemberData(member).then(resolve => onMembersChange(members => [...members, resolve])).catch(() => {})

        })
    })


    return (
        <View style={styles.container}>

            {members.map(member => (

                <Text style={styles.member}>{member.memberData.val().name}</Text>
            ))}

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
