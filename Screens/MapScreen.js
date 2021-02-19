import React, {useState, useEffect} from 'react';
import { Text, View } from 'react-native'; 
import MapView, { Marker } from 'react-native-maps';
import {Input, Button, Overlay} from 'react-native-elements';
import * as Location from 'expo-location';
import {connect} from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MapScreen(props) {

    const [myLocation, setMyLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({distanceInterval:2});
        setMyLocation({latitude: location.coords.latitude, longitude: location.coords.longitude});
      })();
    }, []);
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (myLocation) {
      text = JSON.stringify(myLocation);
    }

    const [isDisabled, setDisabled]=useState(false);
    const [newPOI, setNewPOI] = useState({});
    const [titlePOI, setTitlePOI] = useState();
    const [descPOI, setDescPOI] = useState();

    useEffect(()=> {
        // const cleanAsyncStorage = async () => {
        //     await AsyncStorage.clear()
        // } 
        // cleanAsyncStorage();
        const getPOIFromAsyncStorage = async() => {
            await AsyncStorage.getItem("POI", (error, poi)=>{ 
                if (poi) {
                    const existingPOIFromLocalStorage = JSON.parse(poi);
                    console.log('existing POI LIST', existingPOIFromLocalStorage); 
                    props.addPOIList(existingPOIFromLocalStorage);
                }
          })}
          getPOIFromAsyncStorage();
    }, []);

    const openModalToAddNewPOI = (e) => {
        if (isDisabled) {
        toggleOverlay();
        setNewPOI({latitude:e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
        }    
    }

    const addInfoOfNewPOI = () => {
        const newPOIinfo = {latitude: newPOI.latitude, longitude: newPOI.longitude, title: titlePOI, description:descPOI}
        const newPOIlist = [...props.POI, newPOIinfo];        
        props.addPOIList(newPOIlist);
        AsyncStorage.setItem("POI", JSON.stringify(newPOIlist));
        toggleOverlay();
        setDisabled(false);
        setTitlePOI('');
        setDescPOI('');
    }

    const [visible, setVisible] = useState(false);
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    console.log("POI in Map Screen", props.POI);

    return(
        <View style={{flex : 1}}>
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                <View>
                    <Text>You can add a name and description to this Point of Interest :</Text>
                    <Input placeholder='Name' onChangeText={(value) => setTitlePOI(value)} value={titlePOI}/>
                    <Input placeholder='Description' onChangeText={(value) => setDescPOI(value)} value={descPOI}/>
                    <Button
                        title="Add Point of Interest" 
                        icon={<Ionicons name="location-outline" size={15} color="#FFFFFF" />}
                        buttonStyle={{backgroundColor:"#eb4d4b", width:'100%'}} 
                        onPress={()=> addInfoOfNewPOI()}
                    />
                </View>
            </Overlay>
        <MapView style={{flex : 1}}
            initialRegion={{
            latitude: 48.866667,
            longitude: 2.333333,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
            onPress={(e)=>openModalToAddNewPOI(e)}
        >
            {myLocation !== null ? 
                <Marker
                    pinColor='#eb4d4b'
                    coordinate={myLocation}
                    title={props.userName}
                    description="You are here."
            /> : <View></View>
            }

            {props.POI.map((POI,i) => {
            return(
                <Marker 
                    key={i}
                    pinColor='#130f40'
                    coordinate={{latitude: POI.latitude, longitude: POI.longitude}}
                    title={POI.title}
                    description={POI.description}
                 />
            )})}
        </MapView>
        <Button 
            disabled={isDisabled}
            title="Add Point of Interest" 
            icon={<Ionicons name="location-outline" size={15} color="#FFFFFF" />}
            buttonStyle={{backgroundColor:"#eb4d4b", width:'100%'}} 
            onPress={() => setDisabled(true)} >
        </Button>
        </View>        
    )
}

function mapDispatchToProps(dispatch) {
    return {
      addPOIList: function(POIList) {
            dispatch({type:'addPOIList', POIList} )} 
      }
}
function mapStateToProps(state) {
    return { userName: state.userName, POI: state.POI }}

export default connect( mapStateToProps, mapDispatchToProps )(MapScreen);