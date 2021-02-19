export default function(userPOI = [], action) {
    if(action.type == 'addPOIList') {
        return action.POIList;
    } if (action.type === 'deletePOI') {
        const userDeletePOI = userPOI.filter(p=>(p.title!== action.POI.title));
        return userDeletePOI;   
    } else {
      return userPOI; 
   } 
}