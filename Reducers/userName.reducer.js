export default function(userName='', action) {
     if(action.type == 'saveUserName') {
         const newUser = action.userName;
       return newUser;
     } else {
       return userName; 
    } 
}