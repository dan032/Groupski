import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


/**
 * @return {null}
 */
function LoginScreen({route, navigation}) {
    const [userName, onChangeUserName] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [isLoading, onChangeLoading] = React.useState(false);


    function startRegister(){
        register().then(resolve => navigation.navigate('MainPage', {data:resolve.data.val(), uid:resolve.uid})).catch(() => {
            console.log("ERROR BRO")
        });
    }
    async function register() {
        try {
            onChangeLoading(true);
            await auth().signInWithEmailAndPassword(userName, password);
            const uid = auth().currentUser.uid;
            const ref = database().ref(`/users/${uid}`);
            const data = await ref.once('value').then(onChangeLoading(false));
            return new Promise((resolve, reject) => {
                if (data !== null){
                    resolve({data, uid})
                }
                else{
                    reject(null)
                }

            });

        } catch (e) {
            switch (e.code) {
                case 'auth/user-not-found':
                    Alert.alert("Error", "User not Found");
                    break;
                case 'auth/invalid-email':
                    Alert.alert("Error", "Invalid Email");
                    break;
                case 'auth/invalid-password':
                    Alert.alert("Error", "Invalid Password, needs to be 6 characters or more");
                    break;
                case 'auth/wrong-password':
                    Alert.alert("Error", "Wrong Password");
                    break;
                default:
                    Alert.alert("Error", e.code.toString());
                    break;
            }
        }
    }

    return (
        <View style={styles.container}>
            {route.params && route.params.message && <Text style={{color:"green", marginTop: 20}}>{route.params.message}</Text>}
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
