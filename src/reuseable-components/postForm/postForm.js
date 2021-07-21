import React, { useEffect } from 'react'
// eslint-disable-next-line
import { render } from "@testing-library/react"
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { isEmpty } from "react-redux-firebase";
import { connect } from "react-redux";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import { createStructuredSelector } from "reselect";
import { makeStyles } from '@material-ui/core/styles';
import { projectFirestore } from "../../firebase/config"
import Autocomplete from '../AutoCompelete/AutoCompelete';
import Post from "../../entity/post"
import "firebase/firestore"
import firebase from "firebase/app"
import "../../pages/auth-page/_auth-page.scss"
// eslint-disable-next-line
import postsPage from '../../pages/posts-page/postsPage';
// eslint-disable-next-line
import { stat } from '@nodelib/fs.stat';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CardMedia from '@material-ui/core/CardMedia';
const initialState = {
  postTitle: "",
  postText: "",
};
const initialPlaceState = {
  name: "",
  formatted_address: ""
}
// eslint-disable-next-line
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
    maxWidth: '50wv'
  },
}));

const CreatePost = ({ currentUser, id }) => {
  const [state, setstate] = React.useState(initialState);
  const [location, setLocation] = React.useState(initialPlaceState);
  const [message, setMessage] = React.useState("");

  const [returnedPost, setReturnedPost] = React.useState();
  const [image, setImage] = React.useState({ url: '' });


  var postConventer = {
    toFirestore: function name(post) {
      return {
        userId: post.userId,
        postId: post.postId,
        createdTimestamp: post.createdTimestamp,
        loaction: post.loaction,
        title: post.title,
        context: post.context,
        imageUrl: post.imageUrl,
        likr: post.like,
      };
    },
    fromFirestore: function (snapshot, options) {
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

  function getPostByPostId() {
    // eslint-disable-next-line
    var post = projectFirestore.collection("posts").doc(currentUser.id)
      .collection("postsData")
      .doc(id.match.params.id).get().then((res) => {
        const title = res.data().title;
        const context = res.data().context;
        setstate({ ...state, "postTitle": title, "postText": context })
        setReturnedPost(res.data());
      })
  }

  useEffect(() => {
    if (!isEmpty(id.match.params.id)) {
      getPostByPostId();
    }
    // eslint-disable-next-line
  }, [])


  function writeUserInDB() {

    const timestamp = firebase.firestore.Timestamp.fromDate(new Date()).toDate();
    // eslint-disable-next-line
    const result = projectFirestore.collection("posts")
      .doc(currentUser.id)
      .collection("postsData")

      .withConverter(postConventer)
      .add(new Post(currentUser.id, "", timestamp, { location }, state["postTitle"], state["postText"], "", ""))
      .then((rslt) => {
        console.log("Pushed", rslt);
        console.log("Doc Id", rslt.id);
      })
      .catch((error) => {
        alert(error);
        console.log("Pushed", error);
      });
  }

  function editePostInDB() {
    const res = projectFirestore.collection("posts").doc(currentUser.id)
      .collection("postsData").doc(id.match.params.id);

    res.update({
      title: state["postTitle"],
      context: state["postText"],
      loaction: {
        location: {
          formatted_address: location["formatted_address"] === "" ?
            returnedPost.loaction.location.formatted_address : location["formatted_address"],
          name: location["name"] === "" ?
            returnedPost.loaction.location.name : location["name"],
        }
      }
    })
      .then(() => {
        console.log("Document successfully updated!");
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
      console.log("have id", id);
      editePostInDB();
    } else {
      console.log("havent id", id);
      writeUserInDB()
    }
  }

  function getLocation(place) {
    !isEmpty(place) ?
      setLocation({
        ...location,
        'name': place.name,
        'formatted_address': place.formatted_address
      }) : console.log("Place is empty");
  }

  function displayImage(value) {
    console.log("Value", value);
    setImage({
      ...image,
      "url": URL.createObjectURL(value.target.files[0])
    })
    console.log("image", image);
  }
  const classes = useStyles();
  return (
    <>
      {message &&
        <>
          <h3 className="message">
            {message}
          </h3>
          <i className="far fa-times-circle" onClick={() => setMessage("")}></i>
        </>}

      <form onSubmit={handleSubmit} onKeyDown={handelKeyDown}>


        <Autocomplete getLocation={getLocation} />
        {!isEmpty(returnedPost) &&
          <p>Your old destination was {returnedPost.loaction.location.name} enter a new destination if you want to change it</p>
        }
        <TextField
          id=""
          name="postTitle"
          label="Title"
          variant="outlined"
          value={state["postTitle"]}
          // eslint-disable-next-line
          error={state["postTitle"] == ""}
          onChange={handleChange}
        />

        <TextField
          id=""
          name="postText"
          multiline
          rowsMax={4}
          label="Text"
          variant="outlined"
          value={state["postText"]}
          // eslint-disable-next-line
          error={state["postText"] == ""}
          onChange={handleChange}
        />

        <CardMedia
          className={classes.media}
          image={image["url"]}
          // src={image["url"]}
          title="Paella dish"
        />
        {/* <image 
            src={image["url"]}
            alt="Image"
            /> */}
        <input
          accept="image/*"
          className={classes.input}
          id="icon-button-file"
          type="file"
          onChange={displayImage} />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
        </label>

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={!isEmpty(id.match.params.id) ? <EditIcon /> : <Icon>send</Icon>}
          type="submit"
        >
          {!isEmpty(id.match.params.id) ? "Edit" : "Post"}
          {/* Post */}
        </Button>
      </form>
    </>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})
export default connect(mapStateToProps)(CreatePost);