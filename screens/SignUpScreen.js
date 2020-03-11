import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet, TextInput,
} from 'react-native';

function SignUpScreen({route, navigation}) {
    const [userName, onChangeUserName] = React.useState('');
    const [password, onChangePassword] = React.useState('');

    return (
        <View style={styles.container}>
            <Text style={{marginTop: 20, fontSize: 20}}>Sign up Page</Text>
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
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.btn, styles.btnSubmit]}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Text style={[styles.btn, styles.btnSignUp]}>Cancel</Text>
                </TouchableOpacity>
            </View>

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
