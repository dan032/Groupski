import * as React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet, PermissionsAndroid, Alert,
} from 'react-native';

import database from '@react-native-firebase/database';
import Geolocation from "react-native-geolocation-service";


function Group(props) {

    //course deletion here
    const deleteGroup = () => {
        console.log('deleting press confirmed')
    }

    const toggleGroup = async () => {
        const ref = database().ref();
        const userData = await database().ref(`/users/${props.user}`).once('value');
        props.group.beingGraded = !props.group.beingGraded;
        ref.child(`/groups/${props.group.id}`).update(props.group);

        if (props.group.beingGraded){
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Require Permissions',
                    'message': 'This application requires your location'
                }
            );

            let userUpdate = {...userData.val()}

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
    }

    const deleteAlert = () => {
        //only fire if admin/professor
        if(props.isProf){
            console.log("is prof")
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
        else{
            console.log("not prof, go away")
        }
    };

    // Below distance functions were taken from
    // https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula

    const deg2rad = (deg) => {
        return deg * (Math.PI/180)
    };

    const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
        console.log("Coords 1:" + lat1 + ", " + lon1);
        console.log("Coords 2:" + lat2 + ", " + lon2);
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

    const groupClick = async () => {
        if (props.group.beingGraded){

            const ref = database().ref();
            const profData = await ref.child(`/users/${props.course.prof}`).once('value');
            const userData = await ref.child(`/users/${props.user}`).once('value');

            let userUpdate = {...userData.val()};

            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                .then( async (granted) => {
                    console.log(granted)
                    if (granted){
                        await Geolocation.getCurrentPosition(
                            position => {
                                userUpdate.longitude = position.coords.longitude;
                                userUpdate.latitude = position.coords.latitude;
                                ref.child(`/users/${props.user}`).update(userUpdate);

                                const distance = getDistanceFromLatLonInKm(userUpdate.latitude, userUpdate.longitude, profData.val().latitude, profData.val().longitude)
                                console.log(distance)
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
                    console.log("C: " + err.message)
                })




            // navigation.navigate("Course", {user, group, isProf, course, update: true})



            // Get user location

            // Save user location

            // Calculate Distance, if it within 100m let them into rubric

        }
        else{
            props.navigation.navigate('Group', {group: props.group, isProf: props.isProf, user: props.user, course: props.course})
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
})

export default Group;
