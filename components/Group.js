import * as React from 'react';
import database from '@react-native-firebase/database';
import Geolocation from "react-native-geolocation-service";

import {
    Text,
    TouchableOpacity,
    StyleSheet,
    PermissionsAndroid,
    Alert,
} from 'react-native';

function Group(props) {

    // Allows the teacher to delete a group
    const deleteGroup = async () => {
        const ref = database().ref();
        const userData = await ref.child(`/users`).once('value');
        const groupId = props.group.id;
        const userKeys = Object.keys(userData.val());

        // Removes the group from the course
        ref.child(`/courses/${props.course.id}/groups/${groupId}`).remove();

        // For all users in the group, the group is removed
        for (let i = 0; i < userKeys.length; i++){
            if (userData.val()[userKeys[i]].groups && groupId in userData.val()[userKeys[i]].groups){
                ref.child(`/users/${userKeys[i]}/groups/${groupId}`).remove();
            }
        }

        // Removes group from group table
        ref.child(`/groups/${groupId}`).remove();
        const updateCourseData = await ref.child(`/courses/${props.course.id}`).once('value');
        props.navigation.navigate("Course", {user: props.user, course:updateCourseData.val(), isProf: props.isProf, update: true})
    };

    // Allows the teacher to toggle if a group is able to be graded
    // It then takes the teacher's coordinates to ensure that when
    // students grade a group they need to be within 150m of the prof
    const toggleGroup = async () => {
        const ref = database().ref();
        const userData = await database().ref(`/users/${props.user}`).once('value');
        props.group.beingGraded = !props.group.beingGraded;
        ref.child(`/groups/${props.group.id}`).update(props.group);

        // Asks teacher for their location permissions
        if (props.group.beingGraded){
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Require Permissions',
                    'message': 'This application requires your location'
                }
            );

            let userUpdate = {...userData.val()};

            // Updates the teacher's location information in the db
            if (granted === PermissionsAndroid.RESULTS.GRANTED){
                await Geolocation.getCurrentPosition(
                    position => {
                        userUpdate.longitude = position.coords.longitude;
                        userUpdate.latitude = position.coords.latitude;
                        ref.child(`/users/${props.user}`).update(userUpdate);
                    },
                    error => {
                        Alert.alert("Error", error.message);
                    },
                    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
                )
            }
        }

        props.navigation.navigate("Course", {user:props.user, group:props.group, isProf:props.isProf, course:props.course, update: true, data: props.data})
    };

    const deleteAlert = () => {
        //only fire if admin/professor
        if(props.isProf){
            Alert.alert(
                'Menu',
                'Select an option',
                [
                    //delete logic
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'Delete', onPress: () => deleteGroup()},
                    {text: 'Toggle Activation', onPress: () => toggleGroup()},

                ],
                {cancelable: true},
            );
        }
    };

    // Below distance functions were taken from
    // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    // It calculates the distance between the prof and the student to ensure that the student is close enough
    // to grade the group

    const deg2rad = (deg) => {
        return deg * (Math.PI/180)
    };

    const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2-lat1);  // deg2rad below
        const dLon = deg2rad(lon2-lon1);
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c * 1000;
    };

    // Dictates where the user will go when clicking a group
    // If the group is active, they will be brought to the rubric.
    // Else they will be brought to the group screen
    const groupClick = async () => {
        if (props.group.beingGraded){
            const ref = database().ref();

            // Acquires prof data to check for location and user data
            // to ensure they are inside of a group within the course
            const profData = await ref.child(`/users/${props.course.prof}`).once('value');
            const userData = await ref.child(`/users/${props.user}`).once('value');

            let userUpdate = {...userData.val()};
            let hasGroup = false;

            if (userUpdate.groups){
                const userGroupKeys = Object.keys(userUpdate.groups);
                const courseGroupKeys = Object.keys(props.course.groups);

                for (let i = 0; i < userGroupKeys.length; i++){
                    if (courseGroupKeys.includes(userGroupKeys[i])){
                        hasGroup = true;
                    }
                }
            }

            if (hasGroup || props.isProf){
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                    .then( async (granted) => {
                        if (granted){
                            await Geolocation.getCurrentPosition(
                                position => {
                                    userUpdate.longitude = position.coords.longitude;
                                    userUpdate.latitude = position.coords.latitude;
                                    ref.child(`/users/${props.user}`).update(userUpdate);

                                    const distance = getDistanceFromLatLonInKm(userUpdate.latitude, userUpdate.longitude, profData.val().latitude, profData.val().longitude);
                                    if (distance  >= 0){
                                        props.navigation.navigate('Rubric', {group: props.group, user: props.user, isProf: props.isProf, course: props.course, update: true})
                                    }
                                },
                                error => {
                                    Alert.alert("Error", error.message);
                                },
                                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
                            )
                        }
                        else{
                            Alert.alert("Error", "Go into settings to enable location services")
                        }
                    }).catch(err => {
                        Alert.alert("Error", err.message);
                })
            }
            else{
                Alert.alert("Error", "You need to be in a group to mark")
            }
        }
        else{
            props.navigation.navigate('Group', {group: props.group, isProf: props.isProf, user: props.user, course: props.course, update: true})
        }
    };

    return(
        <TouchableOpacity
            onPress={() => groupClick()}
            style={[styles.group, props.group.beingGraded && styles.active]}
            onLongPress={() => deleteAlert()}
        >

            <Text>Group Name: {props.group.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    group: {
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
    },
    active: {
        backgroundColor: 'lightgreen'
    }
});

export default Group;
