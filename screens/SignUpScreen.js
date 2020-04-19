import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator, PermissionsAndroid,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import { CheckBox} from 'react-native-elements'

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


function SignUpScreen({route, navigation}) {
    const [userName, onChangeUserName] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [isStudent, onChangeStudent] = React.useState(true);
    const [isTeacher, onChangeTeacher] = React.useState(false);
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

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Require Permissions',
                        'message': 'This application requires your location'
                    }
                );
                let user = {};
                user['name'] = userName;
                user['email'] = email;
                user['isProf'] = isTeacher;
                if (granted === PermissionsAndroid.RESULTS.GRANTED){
                    try{
                        console.log("Granted")
                        await Geolocation.getCurrentPosition(
                            position => {

                                user['longitude'] = position.coords.longitude;
                                user['latitude'] = position.coords.latitude;
                                ref.update(user).then(() => {
                                    onChangeLoading(false);
                                    navigation.navigate("Login", {message: "Registration complete, please login"})
                                }).catch(err => {
                                    Alert.alert("Error", err.message);
                                    onChangeLoading(false);
                                });
                            },
                            error => {
                                Alert.alert("Error", error.message);
                            },
                            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
                        )
                    }
                    catch (e) {
                        Alert.alert("Error", e.message);
                    }
                }else{
                    user['longitude'] = 0;
                    user['latitude'] = 0;
                    ref.update(user).then(() => {
                        onChangeLoading(false);
                        navigation.navigate("Login", {message: "Registration complete, please login"})
                    }).catch(err => {
                        Alert.alert("Error", err.message);
                        onChangeLoading(false);
                    });
                }


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
    };

    const onClickCheckBox = (e) => {
        if ((e === 1 && !isStudent) || (e === 2 && !isTeacher)){
            onChangeStudent(!isStudent)
            onChangeTeacher(!isTeacher)
            console.log("yes")
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
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
                <CheckBox title='Student'
                          checked={isStudent}
                          onPress={() => onClickCheckBox(1)}
                          checkedIcon={'dot-circle-o'}
                          uncheckedIcon={'circle-o'}

                />
                <CheckBox title='Teacher'
                          checked={isTeacher}
                          onPress={() => onClickCheckBox(2)}
                          checkedIcon={'dot-circle-o'}
                          uncheckedIcon={'circle-o'}
                />
            </View>


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
    innerContainer: {
        alignItems: "center",
        // flexDirection: "column"
    },
    txtInput : {
        marginHorizontal: "auto",
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
    },
    btnRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-evenly"
    }
});


export default SignUpScreen
