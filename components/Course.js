import * as React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';

import database from '@react-native-firebase/database';


function Course(props) {

    // Allows the teacher to delete a course
    const deleteCourse = async () => {
        const courseId = props.course.courseData.val().id;
        const ref = database().ref();
        const userData = await ref.child('users').once('value');
        const groupData = await ref.child('groups').once('value');

        const userKeys = Object.keys(userData.val());
        const groupKeys = Object.keys(groupData.val());

        // Removes the course from all users
        for (let i = 0; i < userKeys.length; i++){
            if (userData.val()[userKeys[i]].courses && courseId in userData.val()[userKeys[i]].courses){
                ref.child(`/users/${userKeys[i]}/courses/${courseId}`).remove()
            }
        }

        // Removes the course from all groups
        for (let i = 0; i < groupKeys.length; i++){
            if (groupData.val()[groupKeys[i]].course && courseId === groupData.val()[groupKeys[i]].course){
                ref.child(`/groups/${groupKeys[i]}`).remove()
            }
        }

        //Removes the course from the course table
        ref.child(`/courses/${courseId}`).remove();

        const updatedUserData = await ref.child(`users/${props.user}`).once('value');
        props.navigation.navigate("MainPage", {uid: props.user, data:updatedUserData.val(), update: true})
    };

    // This 'beautifully' function was definitely not written by Dan. O(N^3) is the best big O

    // It calculates the final grade for all group presentation grades.
    // 50% of the grade comes from other groups, 50% of the grade comes from the prof,
    // but if a groups's total submitted marks (grading other groups) is more than 5% away from the prof's,
    // then they will incur a 0.5 out of 12 penalty on their grade.
    const calculateGrades = () => {
        const clickedCourse = props.course.courseData.val();

        if (!clickedCourse.profGrades || !clickedCourse.studentGrades){
            Alert.alert("Error","Grading has not been done for this course yet")
        }
        else{
            const studentGradeKeys = Object.keys(clickedCourse.studentGrades);
            const groupKeys = Object.keys(clickedCourse.groups);
            const ref = database().ref();

            // Iterate through all groups in the course
            for (let i = 0; i < groupKeys.length; i++) {
                const currGroup = groupKeys[i];
                let totalMarked = 0;    // the sum of all the grades they've given other groups
                let totalGiven = 0;     // the sum of all the grades other groups have given them
                const profMark = clickedCourse.profGrades[currGroup];   // the grade the prof gave for the current course

                // Iterate through all marked groups within student grades
                for (let j = 0; j < studentGradeKeys.length; j++) {
                    const markedGroup = clickedCourse.studentGrades[studentGradeKeys[j]];   // the group that was marked
                    const markingGroupKeys = Object.keys(markedGroup);

                    // Iterate through all marking groups within student grades
                    for (let k = 0; k < markingGroupKeys.length; k++) {
                        const markingGroupGrades = markedGroup[markingGroupKeys[k]];       // the group that was marking

                        if (studentGradeKeys[j] === currGroup) {
                            totalGiven += markingGroupGrades;
                        }

                        if (studentGradeKeys[k] === currGroup) {
                            totalMarked += markingGroupGrades;
                        }
                    }
                }

                // If the group's mark is within 5% of the prof then no penalty,
                // otherwise there will be a 0.5/12 grade penalty
                let currGroupAvgMark = totalMarked / groupKeys.length;
                if (currGroupAvgMark / profMark < 0.95 || currGroupAvgMark / profMark > 0.95) {
                    currGroupAvgMark = parseFloat((((currGroupAvgMark-.5)/12)*.5) + (profMark/12)*.5).toFixed(2) * 100;
                    ref.child(`/groups/${currGroup}/finalGrade`).set(currGroupAvgMark)
                } else {
                    currGroupAvgMark = parseFloat((((currGroupAvgMark)/12)*.5) + (profMark/12)*.5).toFixed(2) * 100;
                    ref.child(`/groups/${currGroup}/finalGrade`).set(currGroupAvgMark)
                }
            }
        }
    };

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
    };

    return(
        <TouchableOpacity
            style={styles.course}
            onPress={() => props.navigation.navigate('Course',
                {course: props.course.courseData.val(), user: props.user, isProf: props.isProf, update: true, data: props.data})}
            onLongPress={() => {deleteAlert()}}
        >
            <Text style={{fontWeight: "bold", fontSize: 15, textAlign: 'center'}}> {props.course.courseData.val().code} {props.course.courseData.val().title}</Text>
            {/*<Text>{</Text>*/}
            <Text style={{fontSize:10}}>{props.course.courseData.val().subcode}</Text>

        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    course: {
        padding: 33,
        height: 40,
        borderColor: 'gray',
        width: "80%",
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue"
}});

export default Course;
