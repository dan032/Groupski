import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import * as React from 'react';
import {useState} from 'react';
import {
    View,
    Button,
    Text,
    StyleSheet, SafeAreaView, ScrollView, TouchableHighlight, TouchableOpacity
} from 'react-native';

function RubricScreen() {
    const [choices, setChoices] = useState();

    var radio_props_implementation = [
        {label: "Poor", value: 0 },
        {label: "Satisfactory", value: 1 },
        {label: "Good", value: 2 },
        {label: "Excelent", value: 3 }
    ];

    const onPress = (e) => {

        // ReactDOM.getElementById("1");
    };

    return (
        <SafeAreaView>
            <ScrollView style={styles.scrollView}>
            <View style={styles.innerContainer}>
            <Text style={{marginTop: 20, fontSize: 20}}>Evaluation Rubric</Text>

            <View style={styles.eval}>
                <TouchableOpacity
                    style={styles.selected}
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                    onPress={onPress("1")}>
                <Text nativeID="1" style={styles.subHeading}>Implementation</Text>
                </TouchableOpacity>
                <RadioForm
                    radio_props={radio_props_implementation}
                    initial={0}
                    formHorizontal = {true}
                    labelHorizontal = {false}
                    onPress={(value) => {setChoices(5)} } //works,
                    labelStyle={styles.radio}
                >

                </RadioForm>
                <Text style={styles.choices}><Text style={{color:"red"}}>Poor:</Text> The student did so andsnllklklklklklkklklo</Text>
                <Text style={styles.choices}><Text style={{color:"orange"}}>Satisfactory:</Text> The student did so andsnllklklklklklkklklo</Text>
                <Text style={styles.choices}><Text style={{color:"blue"}}>Good: </Text>The student did so andsnllklklklklklkklklo</Text>
                <Text style={styles.choices}><Text style={{color:"green"}}>Excelent:</Text> The student did so andsnllklklklklklkklklo</Text>
            </View>
            <View style={styles.eval}>
                <Text style={styles.subHeading}>Design</Text>
                <Text style={styles.choices}><Text style={{color:"red"}}>Poor:</Text> The student did so andsnllklklklklklkklklo</Text>
                <Text style={styles.choices}><Text style={{color:"orange"}}>Satisfactory:</Text> The student did so andsnllklklklklklkklklo</Text>
                <Text style={styles.choices}><Text style={{color:"blue"}}>Good: </Text>The student did so andsnllklklklklklkklklo</Text>
                <Text style={styles.choices}><Text style={{color:"green"}}>Excelent:</Text> The student did so andsnllklklklklklkklklo</Text>

            </View>
            <View style={styles.eval}>
                <Text style={styles.subHeading}>Delivery</Text>
                <Text style={styles.choices}><Text style={{color:"red"}}>Poor:</Text> The student did so andsnllklklklklklkklklo</Text>
                <Text style={styles.choices}><Text style={{color:"orange"}}>Satisfactory:</Text> The student did so andsnllklklklklklkklklo</Text>
                <Text style={styles.choices}><Text style={{color:"blue"}}>Good: </Text>The student did so andsnllklklklklklkklklo</Text>
                <Text style={styles.choices}><Text style={{color:"green"}}>Excelent:</Text> The student did so andsnllklklklklklkklklo</Text>
            </View>

            <Button title={"Submit"}></Button>
        </View>
            </ScrollView>
        </SafeAreaView>
    )
}




const styles = StyleSheet.create({
    radio:{

    },
    innerContainer: {
        alignItems: "center",
        // flexDirection: "column"
    },
    selected:{
        fontSize:30
    },
    subHeading:{
        fontSize: 20,
        textAlign: "left",
        paddingLeft: 20,
        paddingRight:20,
        marginBottom: 5
    },
    choices:{
        fontSize: 20,
        textAlign: "left",
        paddingLeft: 20,
        paddingRight:20,
        paddingTop:15,
        backgroundColor: "#fdf5e6"

    },
    eval:{
      marginTop: 10,
        marginLeft:10,
        marginRight:10
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
export default RubricScreen;
