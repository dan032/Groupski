import * as React from 'react';
import style from '../css/style';
import {
    Image,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator, ScrollView,
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

    // Begins login process for user
    function startLogin(){
        if(userName === '' || password === ''){
            Alert.alert('Invalid Input',
                'You must enter a username and a password!',
                [{text: 'OK', onPress:() => {}}] ,
                {cancelable: true})
        }
        else{
            register()
                .then((res) => {
                    if (res){
                        navigation.navigate('MainPage', {data:res.data.val(), uid:res.uid, update: true});
                    }
                })
        }
    }

    // Responsible for authentication during login acquires user data for application
    async function register() {
        try {
            onChangeLoading(true);
            await auth().signInWithEmailAndPassword(userName, password);
            const uid = auth().currentUser.uid;
            const ref = database().ref(`/users/${uid}`);
            const data = await ref.once('value');
            if (data.val()){
                return new Promise((resolve) => {
                    onChangeLoading(false);
                    resolve({data, uid});
                });
            }
            else{
                onChangeLoading(false);
                Alert.alert("Error", "Unexpected Error has occurred");
            }


        } catch (e) {
            onChangeLoading(false);
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
        <ScrollView contentContainerStyle={styles.container}>
            {route.params && route.params.message && <Text style={{color:"green", marginTop: 20}}>{route.params.message}</Text>}
            <Image style={styles.img} source={require('../images/Groupski.png')}/>
            <Text style={{marginTop: 20, fontSize: 20}}>Login Page</Text>
            <TextInput
                style={[style.unit,styles.txtInput]}
                onChangeText={text=> onChangeUserName(text)}
                value={userName}
                placeholder={"Enter Username"}
            />
            <TextInput
                secureTextEntry = {true}
                style={[style.unit,styles.txtInput]}
                onChangeText={text=> onChangePassword(text)}
                value={password}
                placeholder={"Enter Password"}

            />
            <View style={styles.btnRow}>
                <TouchableOpacity
                    onPress={() => startLogin()}
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    txtInput : {
        padding: 0,
        marginBottom: 10,
        borderRadius: 5,
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0)"
    },
    btn: {
        marginTop: 20,
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey"
    },
    btnSubmit: {
        backgroundColor: "lightgreen"
    },
    btnSignUp: {
        backgroundColor: "lightblue"
    },
    img: {
        marginTop: 20,
        width: 300,
        height: 150,
        resizeMode: 'contain'
    }
});

export default LoginScreen;
