// Desactivate warnings 
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
// Imports
import React from 'react';
import { StyleSheet} from 'react-native';
// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Icons
import { Ionicons} from '@expo/vector-icons'; 
// Screens
import HomeScreen from './Screens/HomeScreen';
import MapScreen from './Screens/MapScreen';
import ChatScreen from './Screens/ChatScreen';
import POIScreen from './Screens/POIScreen';
// Redux
import userName from './Reducers/userName.reducer';
import POI from './Reducers/POI.reducer';
import { Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
const store = createStore(combineReducers({userName, POI}));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomNav() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color }) => {
        let iconName;
        if (route.name === 'Map') {
          iconName = 'ios-navigate-outline';
        } else if (route.name === 'Chat') {
          iconName = 'ios-chatbubbles-outline' ;          }
          else if (route.name === 'Points of Interest') {
            iconName='ios-bookmark-outline'
          }
        return <Ionicons name={iconName} size={24} color={color} />;
      },     
    })} 
      tabBarOptions={{
        activeTintColor: '#eb4d4b',
        inactiveTintColor: '#FFFFFF',
        style:{backgroundColor:'#130f40'}
      }}      
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Points of Interest" component={POIScreen} />
    </Tab.Navigator> );}

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer style={styles.container}>
     <Stack.Navigator screenOptions={{headerShown: false}}>
       <Stack.Screen name="Home" component={HomeScreen} />
       <Stack.Screen name="BottomNav" component={BottomNav}/>
     </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 