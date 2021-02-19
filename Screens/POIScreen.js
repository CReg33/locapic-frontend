import React from 'react';
import { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import {connect} from 'react-redux';

function POIScreen(props) {
        return(
        <View style={{marginTop:30, paddingLeft:20,paddingRight:20}}>
            <Text style={{marginBottom:20}}>Press a Point of Interest to remove it from list.</Text>
        {
            props.POI.map((POI, i) => (
            <ListItem key={i} bottomDivider onPress={()=> props.onPressDeletePOI(POI)}>
                <ListItem.Content>
                    <ListItem.Title>{POI.title}</ListItem.Title>
                    <ListItem.Subtitle>{POI.description}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        ))
        }
        </View>
    )
}
function mapDispatchToProps(dispatch) {
    return {
      onPressDeletePOI: function(POI) {
            dispatch({type:'deletePOI', POI} )} 
      }
}
function mapStateToProps(state) {
    return { POI: state.POI }
}
export default connect( mapStateToProps, mapDispatchToProps)(POIScreen);

