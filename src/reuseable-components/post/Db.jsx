import { projectFirestore } from "../../firebase/config"
import "firebase/firestore"
import firebase from "firebase/app"
import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import React from 'react';

const postState = [{
    title: null,
    context: null,
    location: null,
}]


const ReadAllPostsFromDB = () =>{
    const [postData, setPostData] = React.useState(postState);
    const newState = [];

    var posts = projectFirestore.collectionGroup("postsData");
    posts.get().then((querySnapshot) => {
       querySnapshot.forEach((doc) => {
           const title = doc.data(). title
           const context = doc.data().context
           const location = doc.data().location
           
           newState.push({'title': title, 'context': context, 'location': location})
           console.log(doc.id, ' => ', doc.data().title);
       });
       console.log("new State", newState); 
   });
    setPostData([...postData, newState]);
   console.log("postDataState", postData);
   return(postData)
 }

 export default ReadAllPostsFromDB()
