import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet, TextInput, Alert, ActivityIndicator,
} from 'react-native';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


function SignUpScreen({route, navigation}) {
    const [userName, onChangeUserName] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [isLoading, onChangeLoading] = React.useState(false);

    const  registerUser = async () =>{
        if (userName === '' || password === '' || email === ''){
            Alert.alert("Error", "Please enter appropriate details");
        }
        else if (password.length < 6){
            Alert.alert("Error", "Password needs to be 6 characters or greater");
        }
        else{
            onChangeLoading(true);
            auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (res) => {
                await auth().signInWithEmailAndPassword(email, password);
                const uid = auth().currentUser.uid;
                const ref = database().ref(`/users/${uid}`);

                ref.update({name:userName}).then(() => {
                    onChangeLoading(false);
                    navigation.navigate("Login", {message: "Registration complete, please login"})
                });
            })
            .catch((err) => {
                switch (err.code) {
                    case 'auth/email-already-in-use':
                        Alert.alert("Error", "Email is already in use");
                        break;
                    case 'auth/invalid-email':
                        Alert.alert("Error", "Invalid Email");
                        break;
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{marginTop: 20, fontSize: 20}}>Sign up Page</Text>
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeUserName(text)}
                value={userName}
                placeholder={"Enter your full name"}
            />
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangeEmail(text)}
                value={email}
                placeholder={"Enter Email"}
            />
            <TextInput
                style={styles.txtInput}
                onChangeText={text=> onChangePassword(text)}
                value={password}
                placeholder={"Enter Password"}
            />
            <View style={styles.btnRow}>
                <TouchableOpacity
                    onPress={() => registerUser()}>
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
        // flexDirection: "column"
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


export default SignUpScreen
