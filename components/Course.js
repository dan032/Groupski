import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';

import database from '@react-native-firebase/database';


function Course(props) {

    //course deletion here
    const deleteCourse = async () => {
        const courseId = props.course.courseData.val().id;
        const ref = database().ref();
        const userData = await ref.child('users').once('value');
        const groupData = await ref.child('groups').once('value');

        const userKeys = Object.keys(userData.val());
        const groupKeys = Object.keys(groupData.val());

        for (let i = 0; i < userKeys.length; i++){
            if (userData.val()[userKeys[i]].courses && courseId in userData.val()[userKeys[i]].courses){
                ref.child(`/users/${userKeys[i]}/courses/${courseId}`).remove()
            }
        }

        for (let i = 0; i < groupKeys.length; i++){
            if (groupData.val()[groupKeys[i]].course && courseId === groupData.val()[groupKeys[i]].course){
                ref.child(`/groups/${groupKeys[i]}`).remove()
            }
        }

        const updatedUserData = await ref.child(`users/${props.user}`).once('value');

        ref.child(`/courses/${courseId}`).remove();
        props.navigation.navigate("MainPage", {uid: props.user, data:updatedUserData.val(), update: true})
    };

    const calculateGrades = () => {
        const clickedCourse = props.course.courseData.val()
        const profGradeKeys = Object.keys(clickedCourse.profGrades)
        const studentGradeKeys = Object.keys(clickedCourse.studentGrades)
        const groupKeys = Object.keys(clickedCourse.groups);
        const ref = database().ref();
        let totalProfGrade = 0;

        for (let i = 0; i < profGradeKeys.length; i++){
            totalProfGrade += clickedCourse.profGrades[profGradeKeys[i]];
        }


        for (let i = 0; i < groupKeys.length; i++){
            const currGroup = groupKeys[i];
            let totalMarked = 0;
            let totalGiven = 0;
            const profMark = clickedCourse.profGrades[currGroup];

            for (let j = 0; j < studentGradeKeys.length; j++){
                const markedGroup = clickedCourse.studentGrades[studentGradeKeys[j]]
                const markingGroupKeys = Object.keys(markedGroup);
                for (let k = 0; k < markingGroupKeys.length; k++){
                    const markingGroupGrades = markedGroup[markingGroupKeys[k]]

                    if (studentGradeKeys[j] === currGroup){
                        totalGiven += markingGroupGrades
                    }

                    if (studentGradeKeys[k] === currGroup){
                        totalMarked += markingGroupGrades
                    }
                }
            }

            let currGroupAvgMark = totalMarked/groupKeys.length;
            if (currGroupAvgMark/profMark < 0.95 || currGroupAvgMark/profMark > 0.95){
                currGroupAvgMark = parseFloat(((currGroupAvgMark-.5)/.12).toFixed(2))
                ref.child(`/groups/${currGroup}/finalGrade`).set(currGroupAvgMark)
            }else{
                currGroupAvgMark = parseFloat(((currGroupAvgMark)/.12).toFixed(2))
                ref.child(`/groups/${currGroup}/finalGrade`).set(currGroupAvgMark)
            }


        }
        // iterate through groups
            // totalMarked = 0
            // totalGiven = 0
            // profMark = profGrades[group]
            // iterate through student grades
                // iterate through marking groups
                    // if markedGroup = inital group
                        // totalGiven += mark
                    // if markingGroup = initial group
                        // totalMark += mark
            // if total - prof = +-5%
                // push to db ((totalGiven/possibleMark*numberOfGroups) * 50 + (profMark/possibleMark) * 50) - 5
            // else
                // push to db ((totalGiven/possibleMark*numberOfGroups) * 50 + (profMark/possibleMark) * 50)







        //
        // for (let i = 0; i < studentGradeKeys.length; i++){
        //
        //
        //     const markingGradeKeys = Object.keys(clickedCourse.studentGrades[studentGradeKeys[i]])
        //     let total = 0;
        //     const perfectGrade = markingGradeKeys.length * 12;
        //     const profGrade = clickedCourse.profGrades[studentGradeKeys[i]];
        //     totalProfGrade += profGrade;
        //
        //     for (let j = 0; j < markingGradeKeys.length; j++){
        //         total += clickedCourse.studentGrades[studentGradeKeys[i]][markingGradeKeys[j]]
        //         totalClassGrade += clickedCourse.studentGrades[studentGradeKeys[i]][markingGradeKeys[j]]
        //     }
        //
        //
        //     total = parseFloat(((total/perfectGrade * 50) + (profGrade/12 * 50)).toFixed(2));
        //     ref.child(`/groups/${studentGradeKeys[i]}/finalGrade`).set(total)


    }

    const deleteAlert = () => {
        //only fire if admin/professor
        if(props.isProf){
            Alert.alert(
                'Menu!',
                'Select an option',
                [
                    //delete logic
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'Delete', onPress: () => deleteCourse()},
                    {text: 'Calculate Grades', onPress: () => calculateGrades()},
                ],
                {cancelable: true},
            );
        }
    }

    return(
        <TouchableOpacity
            style={styles.course}
            onPress={() => props.navigation.navigate('Course',
                {course: props.course.courseData.val(), user: props.user, isProf: props.isProf, update: true, data: props.data})}
            onLongPress={() => {deleteAlert()}}
        >
            <Text>{props.course.courseData.val().code}</Text>
            <Text>{props.course.courseData.val().title}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    course: {
        padding: 30,
        height: 40,
        borderColor: 'gray',
        width: "80%",
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue"
}})

export default Course;
