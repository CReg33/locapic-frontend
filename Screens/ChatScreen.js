import React, {useState, useEffect} from 'react';
import { View, ScrollView, KeyboardAvoidingView, Text, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {ListItem, Input, Button} from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; 
import {connect} from 'react-redux';
// Websockets 
import socketIOClient from "socket.io-client";
var socket = socketIOClient("http://192.168.1.15:3000/");

function ChatScreen(props) {
    const [currentMessage, setCurrentMessage] = useState();
    const [listMessage, setListMessage] = useState([]);

    const generateEmojis = (message) => {
        const myRegexSmile = /:\)/g;
        const myRegexTongue= /:p/g;
        const myRegexCoffee = /coffee/ig;
        message = message.replace(myRegexSmile,"\u263A").replace(myRegexTongue, "\uD83D\uDE1B").replace(myRegexCoffee, "\u2615");
        return message;
    }
    const moderateLanguage = (message) => {
        const myRegex = /[a-z]*fuck.*/ig;
        message = message.replace(myRegex, "\u2022\u2022\u2022");
        return message;
    }

    useEffect(() => {   
        socket.on('sendMessageToAll', (newMessage, userName)=> {
            newMessage = generateEmojis(newMessage);
            newMessage= moderateLanguage(newMessage);
            setListMessage([...listMessage, {content: newMessage, sender: userName}]);
        }); 
    }, [listMessage]); 

    const handleOnPress = () => {
        socket.emit("sendMessage", currentMessage, props.userName);
        setCurrentMessage('');
    }

    return(
        <View style={{flex:1, marginTop: 20}}>
            <ScrollView>
                {
                listMessage && listMessage.map((msg, i) => {
                    return (
                    <ListItem key={i} bottomDivider>
                        <ListItem.Content>
                            <ListItem.Title>{msg.content}</ListItem.Title>
                            <ListItem.Subtitle style={{fontWeight:'bold'}}>{msg.sender}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                )})
                } 
            </ScrollView>


            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex:1}} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{flex:1, padding:24 }}>
                    <Text>Hello {props.userName}, send a message here :</Text>
                        <Input placeholder='Type message...'
                            leftIcon={<Ionicons name="mail-outline" size={15} color="#eb4d4b" />}
                            onChangeText={(value) => setCurrentMessage(value)} value={currentMessage}
                        />
                        <View style={{backgroundColor:"white"}}>
                            <Button 
                                title="Send" 
                                buttonStyle={{backgroundColor:"#eb4d4b", width:'100%'}} 
                                onPress={()=> handleOnPress() }
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

function mapStateToProps(state) {
    return { userName: state.userName }}

export default connect(mapStateToProps, null)(ChatScreen);