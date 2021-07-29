import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Container from "@material-ui/core/Container";

import { projectFirestore, projectStorage } from "../../firebase/config"
import "firebase/firestore"
import firebase from "firebase/app"
import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selectors";
// eslint-disable-next-line
import {firestoreConnect, isEmpty} from 'react-redux-firebase'
// eslint-disable-next-line
import {compose} from 'redux'
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
// eslint-disable-next-line
import { Redirect, Route, useHistory  } from "react-router-dom";
// eslint-disable-next-line
import PostPage from "../../pages/creatPost-page/creatPost-page"
import { Remove, Sync } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import ChatIcon from '@material-ui/icons/Chat';

// import {ReadAllPostsFromDB} from './Db'
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 100,
    // maxWidth: 345,
    maxWidth: '50wv',

  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
  })


const postState = [{
    ownerId: null,
    postId: null,
    title: null,
    context: null,
    location: null,
    imageUrl: null,
    like: null,
    likesCount: null,
    createdTimestamp: null,
}]

const userState = [{
  email: null,
  id: null,
  phoneNumber: null,
  picUrl: null,
  displayName: null,
}]
const ITEM_HEIGHT = 48;

var ev = null;
const Post = ({currentUser}) => {
    let history = useHistory();

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [postData, setPostData] = React.useState(postState);
  const [like, setLike] = React.useState(false);
  const [docu, setDocu] = React.useState();
  const newState = []
  const newUser = []
  const [avatar, setAvatar] = React.useState();
  const [likeEvent, setLikeEvent] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userData, setUserData] = React.useState(userState);
  const open = Boolean(anchorEl);

  const [selectedP, setSelectedPostId] = React.useState(null);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const redirect = (id) => {
    history.push(`/createPost/${id}`)
  }
  const readAllPostsFromDB = () =>{
     var posts = projectFirestore.collectionGroup("postsData");
     posts.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const ownerId = doc.data().userId
            const title = doc.data().title
            const context = doc.data().context
            const location = doc.data().location

            const imageUrl = doc.data().imageUrl
            const likes = doc.data().likes
            const createdTimestamp = doc.data().createdTimestamp
   
            const count = likes == null ? 0 : likes.length;
            
            console.log("locar", location.location.name);
            var likeStatus = false;
            if(!isEmpty(likes)){
              likes.forEach((like)=>{
                if(like.id === currentUser.id){
                  likeStatus = true;
                  console.log("found like", like.id);
                }
              })
            }
            newState.push({"ownerId": ownerId ,"postId": doc.id, 'title': title, 'context': context, 'location': location.location.name, "imageUrl" : imageUrl, "like":likeStatus, "likesCount": count, "createdTimestamp": createdTimestamp.toDate().toString()})
            console.log(doc.id, ' => ', doc.data().title);
        });
    })
    .then(()=>{
        setPostData(newState);

        console.log("postsState", postData);
    })
  }

  function getUserData(){
    const data = projectFirestore.collection("users").get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const email = doc.data().email
        const id = doc.data().id
        const phoneNumber = doc.data().phoneNumber
        const picUrl = doc.data().picUrl
        const displayName = doc.data().displayName
        newUser.push({"email": email, "id": id, "phoneNumber": phoneNumber, "picUrl": picUrl, "displayName": displayName})
      });
  }).then(()=>{
    setUserData(newUser)
  });
    
  }

  useEffect(()=>{
      readAllPostsFromDB();  
      getUserData();
      // eslint-disable-next-line  
  }, [])

  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log("Presses", event.currentTarget);
    console.log("Presses Id", event.currentTarget.id);
    setSelectedPostId(event.currentTarget.id);
  };

  function checkLikeStatus(event){
    const x = event;
    var d = null;
    var c = null;
    const post = projectFirestore.collectionGroup("postsData")
    .where("postId", "==", event.currentTarget.id).get()
    .then((res)=>{
      res.forEach((doc)=>{
        if(isEmpty(doc.data().likes)){
          d = doc;
          c  = false;
        }else{
          doc.data().likes.forEach((like)=>{
            if(like.id === currentUser.id){
              c = true;
              d = doc;
              console.log("The User liked this", d);
            }else{
              c = false;
              d = doc;
              console.log("The User liked this", d);
            }
          })
        }
        }
      )
      if(!c){
        console.log("put", d);
        putLike(d);
        
      }else{
        console.log("remove", d);
        removeLike(d)
        
      }
    })
    
  }

  function putLike(d){
    console.log("Put Like Function");
    const like = d.ref.update({likes: firebase.firestore.FieldValue.arrayUnion({
      id: currentUser.id,
      status: true
    })}).then(()=>{
      readAllPostsFromDB()
    })
    console.log("Add Like", d);
  }

  function removeLike(d){
    console.log("Remove Function");
    const like = d.ref.update({likes: firebase.firestore.FieldValue.arrayRemove({
            id: currentUser.id,
            status: true
          })}).then(()=>{
            readAllPostsFromDB();
          })
   
    console.log("Removed Like", d);
  }
  function handleLike(event){
    checkLikeStatus(event);
    }

  const handleClose = (event) => {
    setAnchorEl(null);
    console.log("Presses", event.currentTarget.innerText);
   
    switch (event.currentTarget.innerText) {
        case "Edit":
            const editRes = projectFirestore.collection("posts").doc(currentUser.id)
            .collection("postsData")
            .doc(selectedP).get().then((res)=>{
                console.log(res.data())
                redirect(selectedP)
            });
            break;
        case "Delete":
            const deleteRes = projectFirestore.collection("posts")
            .doc(currentUser.id).collection("postsData").doc(selectedP)
            .delete().then(() => {
                readAllPostsFromDB();
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });

            const desertRef = projectStorage.ref(`posts/${currentUser.id} +"&"+ ${selectedP}`);
            
                console.log("IMage found", desertRef);
                desertRef.delete().then(() => {
                    // File deleted successfully
                  }).catch((error) => {
                    // Uh-oh, an error occurred!
                    console.log("Error while deleting the image", error);
                  });
            
           
            break;
        default:
            break;
    }
  };

  function openChat(){
    history.push("/chats")
  }
  return (
      <>

    
    {// eslint-disable-next-line
    !isEmpty(postData)&&
        postData.map((post)=>(
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={3}
        >
          <Container
          // maxWidth="sm" 
          style={{  width:"50vw", hight:"100%"}}
          >

         
            <Card className={classes.root}>
             
            <CardHeader
                avatar={!isEmpty(userData) && 
                  userData.map((data)=>(
                    <div>
                     {data.id === post.ownerId &&
                        <Avatar
                        aria-label="recipe"
                        src={data.picUrl}
                        className={classes.avatar}
                        /> 
                     }
                    </div>
                  )) 
                 }
              action=
                
                    {post.ownerId === currentUser.id &&
                    <div>
                        <IconButton
                         
                        id={post.postId}
                        aria-label="settings"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                        id={"Long"}
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                        }}
                        >
                            <MenuItem 
                            key={1}
                            // id={post.postId}
                            name="Edit"
                            onClick={handleClose}>
                                Edit
                            </MenuItem>

                            <MenuItem 
                            key={2}
                            // id={post.postId}
                            name="Delete"
                            onClick={handleClose}>
                                Delete
                            </MenuItem>
                        </Menu>
                    </div>
                }
                   
              title={post.title}
              subheader={post.createdTimestamp}
            />
            
            
            <CardMedia
              className={classes.media}
              image={post.imageUrl}
            />
            <CardContent>
              <Typography variant="body2" color="textPrimary" component="p">
               {post.context}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Destination: {post.location}
              </Typography>
             
              {!isEmpty(userData) &&
              userData.map((data)=>(
                <div>
                  {data.id === post.ownerId &&
                  <div>
                      <Typography variant="body2" color="textSecondary" component="p">
                        Name: {data.displayName}
                      </Typography> 
                     <Typography variant="body2" color="textSecondary" component="p">
                        Email: {data.email}
                     </Typography>
                     </div>
                  }
                </div>
                
              ))
              }
           
            </CardContent>
            
            <CardActions disableSpacing>
              <IconButton
               id={post.postId}
               aria-label="Like"
               onClick={handleLike}
              >
                {(post.like == true)?   <FavoriteIcon style={{ color: red[500] }}/> :  <FavoriteIcon/>} 
                <p style={{fontSize: 15, color: 'black'}}> {" " + post.likesCount}</p>
              </IconButton>
              <IconButton aria-label="share">
                <ChatIcon
                 onClick={openChat}/>
              </IconButton>
            </CardActions>

          
          </Card>
          </Container>
        </Grid>
        ))
    }
   
    </>
  );
}

export default connect(mapStateToProps) (Post)
