import React, {useState, useEffect} from 'react';
import { StyleSheet, View, ImageBackground, Text } from 'react-native';
import { Input, Button} from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons'; 
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen(props) {
    const [userName, setUserName] = useState('');
    const [hasName, setHasName] = useState(false);

    const onButtonPress = () => {
        props.navigation.navigate('BottomNav', {screen: 'MapScreen'});
        props.onClickSaveUserName(userName);
        AsyncStorage.setItem("userName", userName);
    }

    useEffect(() => { 
        // const cleanAsyncStorage = async () => {
        //     await AsyncStorage.clear()
        // } 
        // cleanAsyncStorage();
        const getUserFromAsyncStorage = async () => {
            await AsyncStorage.getItem("userName", (error, name)=>{ 
                setUserName(name);
                setHasName(true);
            })
        } 
        getUserFromAsyncStorage();
    }, []); 

    const welcomeExistingUser = () => {
        return(
            <View>
                <Text style={{backgroundColor:'#FFFFFF',opacity:0.7, padding:20 }}>Welcome back {userName}</Text> 
                <Button 
                        title=" Go to Map"   
                        icon={<FontAwesome name="arrow-right" size={15} color='#eb4d4b' />}
                        onPress={() => props.navigation.navigate('BottomNav', {screen: 'MapScreen'})}>
                    </Button>
            </View>
            )
    }

    const registerNewUser = () => {
        return(
            <View style={{flex:1, alignItems: 'center', justifyContent:'center', width:'80%'}}>
                    <Input 
                        style={{backgroundColor:'#FFFFFF', opacity:0.4}}
                        placeholder="Enter your name" 
                        leftIcon={{ type: 'font-awesome', name: 'user', color:'#eb4d4b' }} 
                        onChangeText={(value) => setUserName(value)}
                        value={userName} 
                    /> 
                    <Button 
                        title=" Go to Map"   
                        icon={<FontAwesome name="arrow-right" size={15} color='#eb4d4b' />}
                        onPress={() => onButtonPress()}>
                    </Button>
            </View>
        )
    }

    return(
        <ImageBackground source={require('../assets/home-background.jpg')} style={styles.image}>
            <View style={{flex:1, alignItems: 'center', justifyContent:'center', }}>
                {hasName ? welcomeExistingUser() : registerNewUser()}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
      flex: 1,
    },
  });

 
function mapDispatchToProps(dispatch) {
  return {
    onClickSaveUserName: function(userName) {
          dispatch({type: 'saveUserName', userName} )} 
    }
}
export default connect(null, mapDispatchToProps)(HomeScreen);  