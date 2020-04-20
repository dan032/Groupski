import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import * as React from 'react';
import {useState} from 'react';
import {
    View,
    Button,
    Text,
    StyleSheet, SafeAreaView, ScrollView, TouchableHighlight, TouchableOpacity
} from 'react-native';

import database from '@react-native-firebase/database';



function RubricScreen({route, navigation}) {

    const {isProf, course, user, group} = route.params;
    var radio_props_implementation = [
        {label: "Poor", value: 0 },
        {label: "Satisfactory", value: 1 },
        {label: "Good", value: 2 },
        {label: "Excelent", value: 3 }
    ];


    //Submission code here
    const submit = async () => {
        const ref = database().ref();
        const groupData = await ref.child(`groups`).once('value');
        const groupBeingMarked = group.id;
        const currCourseId = course.id;
        const currUser = user;
        let grade = parseFloat(((c1 + c2 + c3)/3).toFixed(2));
        if (isProf){
            ref.child(`/grades/${groupBeingMarked}/profGrade`).set(grade);
        }
        else{
            const groupKeys = Object.keys(groupData.val());
            let markingGroup = {};
            for (let i = 0; i < groupKeys.length; i++){
                const tmp  = groupData.val()[groupKeys[i]];
                if (tmp.course === currCourseId && currUser in tmp.members){
                    markingGroup = tmp;
                }
            }

            ref.child(`/grades/${groupBeingMarked}/${markingGroup.id}`).set(grade)
        }

        navigation.navigate("MainPage", {isProf: isProf, course: course, user: user, group: group})
    };

    //results are stored here as 0,1,2,3 where c1 is implementation, c2 design etc
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
    };

    return (
        <SafeAreaView>
            <ScrollView style={styles.scrollView}>
                <View style={styles.innerContainer}>
                    <Text style={{marginTop: 20, fontSize: 20, fontWeight: "bold"}}>Evaluation Rubric</Text>

                    <View style={styles.eval}>

                        <Text nativeID="1" style={styles.subHeading}>Implementation</Text>
                        <Text style={styles.description}>The the presenters has implemented all features</Text>
                        <RadioForm
                            radio_props={radio_props_implementation}
                            initial={-1}
                            formHorizontal = {true}
                            labelHorizontal = {false}
                            onPress={(value) => {onPressImp(value, "Implementation")}} //works,
                            labelStyle={styles.radio}
                        />

                        <Text style={styles.subHeading}>Design</Text>
                        <Text style={styles.description}>The the presentation meets design standards </Text>
                        <RadioForm
                            radio_props={radio_props_implementation}
                            initial={-1}
                            formHorizontal = {true}
                            labelHorizontal = {false}
                            onPress={(value) => {onPressImp(value, "Design")}} //works,

                            labelStyle={styles.radio}
                        />

                        <Text style={styles.subHeading}>Delivery</Text>
                        <Text style={styles.description}>The presentation was delivered in a manner expected from college students  </Text>
                        <RadioForm
                            radio_props={radio_props_implementation}
                            initial={-1}
                            formHorizontal = {true}
                            labelHorizontal = {false}
                            onPress={(value) => {onPressImp(value, "Delivery")}} //works,
                            labelStyle={styles.radio}
                        />
                    </View>

                    <Button title={"Submit"} onPress={submit}></Button>
                </View>
            </ScrollView >
        </SafeAreaView>
    )
}




const styles = StyleSheet.create({
    scrollView:{marginBottom:25},
    radio:{
        marginTop: 10,
        margin: 10,
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
