import React, { useEffect } from 'react'
import { render } from "@testing-library/react"
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { isEmpty } from "react-redux-firebase";
import { connect } from "react-redux";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import { createStructuredSelector } from "reselect";
import { makeStyles } from '@material-ui/core/styles';
import { projectFirestore, projectStorage } from "../../firebase/config"
import Autocomplete from '../AutoCompelete/AutoCompelete';
import Post from "../../entity/post"
import "firebase/firestore"
import firebase from "firebase/app"
import "../../pages/auth-page/_auth-page.scss"
import postsPage from '../../pages/posts-page/postsPage';
import { stat } from '@nodelib/fs.stat';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CardMedia from '@material-ui/core/CardMedia';
import Alert from '@material-ui/lab/Alert';
import placeholder from "../../assets/placeholder-image.png"
import Grid from '@material-ui/core/Grid';
import zIndex from '@material-ui/core/styles/zIndex';
import { Typography } from '@material-ui/core';
import Container from "@material-ui/core/Container";
import AutoComplete from '../google-autocomplete/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
const initialState = {
  postTitle: "",
  postText: "",
  imageUrl: "",
};
const initialPlaceState = {
  name: "",
  formatted_address: ""
}

const postState = {
  ownerId: null,
  postId: null,
  title: null,
  context: null,
  location: null,
}
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', 
    maxWidth: '50wv',
  },

  progress: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  color:{
    backgroundColor: 'black',
    border: "5px solid blue",
    zIndex:"7",
    position: 'static'
  },

  snackbar:{
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  }
}));

const CreatePost= ({currentUser, id})=>{
    const [state, setstate] = React.useState(initialState);
    const [location, setLocation] = React.useState(initialPlaceState);
    const [message, setMessage] = React.useState("");

    const [returnedPost, setReturnedPost] = React.useState();
    const [image, setImage] = React.useState({url: null});
    const [imagePath, setImagePath] = React.useState();
    const [downloadUrl, setDownloadURL] = React.useState();

    const[warning, setWarning] = React.useState(false);
    
    const[locationField, setLoacationField] = React.useState({
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
    })

    const [open, setOpen] = React.useState(false);
    // const [openError, setOpenError] = React.useState(false);
    const [finish, setFinish] = React.useState(true);
    function getLoaded(mapApiLoaded, mapInstance, mapApi){
      setLoacationField({mapApiLoaded: mapApiLoaded, mapInstance: mapInstance, mapApi: mapApi})
    }

    function addPlace (place){
      getLocation(place)
    };
    function getLocation(place){

      !isEmpty(place)?
      
      setLocation({...location,
              'id': place.place_id, 
              'name': place.name,
              'formatted_address': place.formatted_address,
              'lat': place.geometry.location.lat(),
              'lng': place.geometry.location.lng(),
              }) : console.log("Place is empty");

              // console.log("location", place)
    }


    var postConventer={
        toFirestore: function name(post) {
            return{
                userId: post.userId,
                postId : post.postId,
                createdTimestamp: post.createdTimestamp,
                location: post.location,
                title: post.title,
                context: post.context,
                imageUrl: post.imageUrl,
                likes: post.likes,
            };
        },
        fromFirestore: function(snapshot, options){
            const data = snapshot.data(options);
            console.log(data);
        }
    }
  
  function handleChange({ target: { type, name, value, checked } }) {
    switch (type) {
      case "number":
        setstate({ ...state, [name]: parseInt(value) });
        break;
      case "checkbox":
        setstate({ ...state, [name]: checked });
        break;
      default:
        setstate({ ...state, [name]: value });
    }
  }

    function getPostByPostId(){
      var post = projectFirestore.collection("posts").doc(currentUser.id)
      .collection("postsData")
      .doc(id.match.params.id).get().then((res)=>{
          const title = res.data().title;
          const context = res.data().context;
          const imageUrl = res.data().imageUrl;
          setstate({...state, "postTitle": title, "postText": context, "imageUrl": imageUrl})
          setReturnedPost(res.data());
      })
    }

    useEffect(()=>{
      if(!isEmpty(id.match.params.id)){
        getPostByPostId();
      }  
  }, [])

  function beforeWriteInDB(){
    if(isEmpty(state["postTitle"]) ||isEmpty(state["postText"]) || isEmpty(location["name"])){
      setWarning(true);
      if(isEmpty(state["postTitle"]) && isEmpty(state["postText"]) && isEmpty(location["name"])){
        setMessage("Please fill out the form");
      }else if(isEmpty(state["postTitle"])){
        setMessage("Please enter the title of your post");
      }else if(isEmpty(state["postText"])){
        setMessage("Plese enter the context of your post");
      }else if(isEmpty(location["name"])){
        setMessage("Please enter the location");
      }
    }else{
      setWarning(false);
      writePostInDB();
    }
  }
   
    function writePostInDB(){
        setFinish(false);
        const timestamp = firebase.firestore.Timestamp.fromDate(new Date()).toDate();
        const result = projectFirestore.collection("posts")
                      .doc(currentUser.id)
                      .collection("postsData")
                
                      .withConverter(postConventer)
                      .add(new Post(currentUser.id, "" ,timestamp ,{location}, state["postTitle"], state["postText"], "", []))
                      .then((rslt)=>{
                        rslt.update({
                          postId: rslt.id,
                        })
                        uploadImgae(rslt.id);
                        
                        setFinish(true);
                        setOpen(true);
                    })
                    .catch((error) =>{
                        alert(error);
                    });
    }

    function editePostInDB(){
      setFinish(false);
      const res = projectFirestore.collection("posts").doc(currentUser.id)
                                  .collection("postsData").doc(id.match.params.id);
            uploadImgae(id.match.params.id);
            res.update({
              title: state["postTitle"],
              context: state["postText"],
              location:{
                location:{
                  formatted_address: location["formatted_address"] === "" ? 
                  returnedPost.location.location.formatted_address : location["formatted_address"],
                name: location["name"] === ""?
                returnedPost.location.location.name: location["name"],
                }
              }
            })
          .then(() => {
              console.log("Document successfully updated!");
              setFinish(true);
              setOpen(true);
          })
          .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });
    }
    function handelKeyDown(e) {
      console.log("Key event", e);
      if (e.code === 'Enter') e.preventDefault();
    }
    function handleSubmit(e) {
        e.preventDefault();
        if (!isEmpty(id.match.params.id)) {
          editePostInDB();
        }else{
          // writeUserInDB();
          beforeWriteInDB();
        }
    }

    function uploadImgae(docId){
      console.log("image path", imagePath);
      console.log("image", image);
      const storageRef = projectStorage.ref("posts").child(`${currentUser.id}` + "&" +`${docId}`);

      const uploadTask = null;
      if (!isEmpty(state["imageUrl"]) && !isEmpty(image["url"])) {
        // uploadTask = storageRef.put(placeholder);
      }
      if(!isEmpty(image["url"])){
        const uploadTask = storageRef.put(imagePath);

        uploadTask.on('state_changed', 
        (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: 
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: 
              console.log('Upload is running');
              break;
            }
        }, 
          (error) => {
          
        }, 
          () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            // setDownloadURL(downloadURL);
            projectFirestore.collection("posts").doc(currentUser.id)
            .collection("postsData").doc(docId).update({
              imageUrl: downloadURL,
            })
          });
          }
        );
        }
        
    }

    

    function displayImage(value){
      console.log("Value", value);
      setImagePath(value.target.files[0]);
      setImage({...image, 
        "url": URL.createObjectURL(value.target.files[0])})
        console.log("image", image);
    }


    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
      setWarning(false);
    };

    const classes = useStyles();
  
   return(
        <>
        <Autocomplete key={'googleMap'} getLocation = {getLocation} getLoaded={getLoaded} location={location}/>    
          {!finish ?
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
            <CircularProgress color="secondary"/>
            </Box> 
            : 
            <div className={classes.snackbar}>
              <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                  Done!
                </Alert>
              </Snackbar>
            </div>}

            { warning &&
             
            <div className={classes.snackbar}>
              <Snackbar open={warning} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                  {message}
                </Alert>
              </Snackbar>
                
            </div>
            }
         <Grid
            container
            direction="column"
            alignItems="flex-start"
            justify="center"
            spacing={3}
        >
          
        
        <form onSubmit={handleSubmit} onKeyDown={handelKeyDown}>
          <Container 
          maxWidth="sm" 
          style={{ minHeight:'100% ',backgroundColor: "rgba(100, 94, 104, 0.10)", zIndex:'10', position:'relative', border:'1px solid rgba(100, 94, 104, 0.10)', borderRadius:'1%'}}>

            <Typography variant="h4" 
            color="dark" 
            style={{position:"realtive", zIndex: "5"}}
            >
                Create Post
            </Typography> 
            {locationField.mapApiLoaded && (
              <AutoComplete map={locationField.mapInstance} mapApi={locationField.mapApi} addplace={addPlace} />
            )}
            {!isEmpty(returnedPost)&&
            <Typography 
            variant="body1"
            color="primary"
            style={{backgroundColor:'rgba(100, 94, 104, 0.40)', marginBottom: '1%'}}
            >
              Your old destination was {returnedPost.location.location.name} enter a new destination if you want to change it
            </Typography>
            // <p>Your old destination was {returnedPost.location.location.name} enter a new destination if you want to change it</p>
            }
            
           
            
            <TextField 
            id=""
            fullWidth
            style={{marginBottom:"1em"}}
            name="postTitle" 
            label="Title" 
            variant="outlined"
            value={state["postTitle"]}
            // error = {state["postTitle"] == ""}
            onChange={handleChange}
            />
            
             
            <TextField 
            id=""
            fullWidth
            name="postText"
            multiline
            rows={3}
            label="Text" 
            variant="outlined"
            value={state["postText"]}
            // error = {state["postText"]== ""}
            onChange={handleChange}
            />
            
            {!isEmpty(state["imageUrl"]) ? 
            <CardMedia
            className={classes.media}
            image={state["imageUrl"]}
            title="Paella dish"
            style={{ border: "1px solid #000", borderRadius: "3px", width: "100%", marginTop: "4%", position:'relative'}}
            /> : 
            <CardMedia
            className={classes.media}
            image={!isEmpty(image["url"])? image["url"] : placeholder}
            title="Paella dish"
            style={{ border: "1px solid #000", borderRadius: "3px", width: "100%", marginTop: "4%", position:'relative'}}
            />
            }
            
            
            <input 
            accept="image/*" 
            className={classes.input} 
            id="icon-button-file" 
            type="file" 
            onChange= {displayImage}/>
            <label htmlFor="icon-button-file">
              <IconButton 
              color="primary" 
              aria-label="upload picture" 
              component="span"
              style={{position: 'relative', marginTop: "4%"}}
              >
                <PhotoCamera />
              </IconButton>
            </label>

            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={!isEmpty(id.match.params.id)? <EditIcon/> :<Icon>send</Icon>}
                type="submit"
                style={{position: 'relative', marginTop: "4%"}}
                >
                  {!isEmpty(id.match.params.id)? "Edit": "Post"}
            </Button>
            
            
        </Container>
        </form>
        
        </Grid>
        </>
   )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})
export default connect(mapStateToProps)(CreatePost);