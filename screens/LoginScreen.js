import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


/**
 * @return {null}
 */
function LoginScreen({navigation}) {
    const [userName, onChangeUserName] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    function startRegister(){
        register().then(resolve => navigation.navigate('MainPage', {data:resolve.data._snapshot.value, uid:resolve.uid})).catch(() => {
            console.log("ERROR BRO")
        });
    }
    async function register() {
        try {
            await auth().signInWithEmailAndPassword(userName, password);
            const uid = auth().currentUser.uid;
            const ref = database().ref(`/users/${uid}`);
            const data = await ref.once('value');
            return new Promise((resolve, reject) => {
                if (data !== null){
                    resolve({data, uid})
                }
                else{
                    reject(null)
                }

            });

        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{marginTop: 20, fontSize: 20}}>Login Page</Text>
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeUserName(text)}
                value={userName}
                placeholder={"Enter Username"}
            />
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangePassword(text)}
                value={password}
                placeholder={"Enter Password"}
            />
            <View style={styles.btnRow}>
                <TouchableOpacity
                    // onPress={() => navigation.navigate('MainPage',{
                    //     data})}
                    onPress={() => startRegister()}
                >
                    <Text style={[styles.btn, styles.btnSubmit]}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    title={"Sign Up"}
                    onPress={() => navigation.navigate('SignUp')}>
                    <Text style={[styles.btn, styles.btnSignUp]}>Sign Up</Text>
                </TouchableOpacity>
            </View>

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
        padding: 15,
        borderRadius: 5,
    },
    btnSubmit: {
        backgroundColor: "lightgreen"
    },
    btnSignUp: {
        backgroundColor: "lightblue"
    }
});

export default LoginScreen;
