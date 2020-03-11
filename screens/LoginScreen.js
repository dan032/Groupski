import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

function LoginScreen({navigation}) {
    const [userName, onChangeUserName] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [data, changeData] = React.useState([{
        'userName': 'Dan',
        'password': 1234,
        'courses': [
            {
                id: 1,
                code: 'PROG1234',
                title: 'Mobile Web Development',
                groups: [
                    {
                        id: 1,
                        members: [
                            {
                                userName: "Dan"
                            },
                            {
                                userName: "Taha"
                            },
                            {
                                userName: "Nathan"
                            }]
                    },
                    {
                        id: 2,
                        members: [
                            {
                                userName: "James"
                            },
                            {
                                userName: "Greg"
                            },
                            {
                                userName: "Jordan"
                            }]
                    }]
            },
            {
                id: 2,
                code: 'PROG5678',
                title: "Data Structures and Algorithms",
                groups: []
            }],
        groups: [1]
    }]);

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
                    onPress={() => navigation.navigate('MainPage',{
                        data,
                    })}>
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
