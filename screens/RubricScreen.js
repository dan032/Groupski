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
    const [choices, setChoices] = useState([
        {id: 0, description: "Default Choice"}
        ]);

    const [impDes, setImpDesc] = useState();



    var radio_props_implementation = [
        {label: "Poor", value: 0 },
        {label: "Satisfactory", value: 1 },
        {label: "Good", value: 2 },
        {label: "Excelent", value: 3 }
    ];

    //results are stored here
    var c1,c2,c3;

    const onPressImp = (e, category) => {
        // setChoices({id:5, description: "test"})
        if(category == "Implementation"){
            c1=e;
            console.log("Implementation: " + c1)
        }
        else if(category == "Design"){
            c2=e;
            console.log("Design choice: " + c2)
        }
        else if(category == "Delivery"){
            c3=e;
            console.log("Delivery choice: " + c3)
        }
        else{
            console.log("Unknown Category selected")
        }
        // c1=e;
        // console.log(category)
        // console.log(e)
        // console.log(choices.id)

        // ReactDOM.getElementById("1");
    };

    return (
        <SafeAreaView>
            <ScrollView style={styles.scrollView}>
            <View style={styles.innerContainer}>
            <Text style={{marginTop: 20, fontSize: 20, fontWeight: "bold"}}>Evaluation Rubric</Text>

            <View style={styles.eval}>
                {/*<TouchableOpacity*/}
                {/*    style={styles.selected}*/}
                {/*    activeOpacity={0.6}*/}
                {/*    underlayColor="#DDDDDD"*/}
                {/*    onPress={onPressImp("1")}>*/}
                <Text nativeID="1" style={styles.subHeading}>Implementation</Text>
                {/*</TouchableOpacity>*/}
                <Text style={styles.description}>The the presenters has implemented all features</Text>
                <RadioForm
                    radio_props={radio_props_implementation}
                    initial={1}
                    formHorizontal = {true}
                    labelHorizontal = {false}
                    // onPress={(value) => {setChoices(value)}} //works,
                    onPress={(value) => {onPressImp(value, "Implementation")}} //works,
                    // onPress={(value) => {this.setState({value:value})}}

                    labelStyle={styles.radio}
                />

                    <Text style={styles.subHeading}>Design</Text>
                <Text style={styles.description}>The the presentation meets design standards </Text>
                <RadioForm
                    radio_props={radio_props_implementation}
                    initial={1}
                    formHorizontal = {true}
                    labelHorizontal = {false}
                    // onPress={(value) => {setChoices(value)}} //works,
                    onPress={(value) => {onPressImp(value, "Design")}} //works,
                    // onPress={(value) => {this.setState({value:value})}}

                    labelStyle={styles.radio}
                />

                <Text style={styles.subHeading}>Delivery</Text>
                <Text style={styles.description}>The presentation was delivered in a manner expected from college students  </Text>
                <RadioForm
                    radio_props={radio_props_implementation}
                    initial={1}
                    formHorizontal = {true}
                    labelHorizontal = {false}
                    // onPress={(value) => {setChoices(value)}} //works,
                    onPress={(value) => {onPressImp(value, "Delivery")}} //works,
                    // onPress={(value) => {this.setState({value:value})}}

                    labelStyle={styles.radio}
                />

                {/*<Text style={styles.choices}><Text style={{color:"red"}}>Poor:</Text> {this.state.impDes}</Text>*/}
                {/*<Text style={styles.choices}><Text style={{color:"red"}}>Poor:</Text> The student did so andsnllklklklklklkklklo</Text>*/}
                {/*<Text style={styles.choices}><Text style={{color:"orange"}}>Satisfactory:</Text> The student did so andsnllklklklklklkklklo</Text>*/}
                {/*<Text style={styles.choices}><Text style={{color:"blue"}}>Good: </Text>The student did so andsnllklklklklklkklklo</Text>*/}
                {/*<Text style={styles.choices}><Text style={{color:"green"}}>Excelent:</Text> The student did so andsnllklklklklklkklklo</Text>*/}
            </View>
            {/*<View style={styles.eval}>*/}
            {/*    <Text style={styles.subHeading}>Design</Text>*/}
            {/*    <Text style={styles.choices}><Text style={{color:"red"}}>Poor:</Text> The student did so andsnllklklklklklkklklo</Text>*/}
            {/*    <Text style={styles.choices}><Text style={{color:"orange"}}>Satisfactory:</Text> The student did so andsnllklklklklklkklklo</Text>*/}
            {/*    <Text style={styles.choices}><Text style={{color:"blue"}}>Good: </Text>The student did so andsnllklklklklklkklklo</Text>*/}
            {/*    <Text style={styles.choices}><Text style={{color:"green"}}>Excelent:</Text> The student did so andsnllklklklklklkklklo</Text>*/}

            {/*</View>*/}
            {/*<View style={styles.eval}>*/}
            {/*    <Text style={styles.subHeading}>Delivery</Text>*/}
            {/*    <Text style={styles.choices}><Text style={{color:"red"}}>Poor:</Text> The student did so andsnllklklklklklkklklo</Text>*/}
            {/*    <Text style={styles.choices}><Text style={{color:"orange"}}>Satisfactory:</Text> The student did so andsnllklklklklklkklklo</Text>*/}
            {/*    <Text style={styles.choices}><Text style={{color:"blue"}}>Good: </Text>The student did so andsnllklklklklklkklklo</Text>*/}
            {/*    <Text style={styles.choices}><Text style={{color:"green"}}>Excelent:</Text> The student did so andsnllklklklklklkklklo</Text>*/}
            {/*</View>*/}

            <Button title={"Submit"}></Button>
        </View>
            </ScrollView >
        </SafeAreaView>
    )
}




const styles = StyleSheet.create({
    scrollView:{marginBottom:25},
    radio:{
        marginTop: 10,
        margin: 25,
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
        color: 'blue',
        textAlign: "left",
        paddingLeft: 20,
        paddingRight:20,
        marginBottom: 5
    },
    description:{
        fontSize: 20,
        textAlign: "left",
        padding: 20,
        marginBottom: 10,
        // paddingLeft: 20,
        // paddingRight:20,
        // paddingTop:15,
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
