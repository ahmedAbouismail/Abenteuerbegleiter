import React from 'react'
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
// import "./_post.styles.scss"
import "../../pages/auth-page/_auth-page.scss"
const initialState = {
  postTitle: "",
  postText: "",
};
const initialPlaceState = {
  name: "",
  formatted_address: ""
}

const CreatePost = ({ currentUser }) => {
  const [state, setstate] = React.useState(initialState);
  const [location, setLocation] = React.useState(initialPlaceState);
  const [message, setMessage] = React.useState("");

  const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

  var postConventer = {
    toFirestore: function name(post) {
      return {
        createdTimestamp: post.createdTimestamp,
        loaction: post.loaction,
        title: post.title,
        context: post.context,
        image: post.image,
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

  function writeUserInDB() {
    // if (state["postTitle"] === "") {
    //   setMessage("Please enter the title of the Post");
    // }else if (state["postText"] === ""){
    //   setMessage("plese enter the contxt of your Post")
    // }else if(place === ""){
    //   setMessage("plese enter the Location")
    // }else{
    const timestamp = firebase.firestore.Timestamp.fromDate(new Date()).toDate();
    // console.log("timstamp", timestamp);
    projectFirestore.collection("posts")
      .doc(currentUser.id)
      .collection("postsData")
      // .doc(state["postTitle"] + " " + timestamp)
      // .doc()
      .withConverter(postConventer)
      .add(new Post(timestamp, { location }, state["postTitle"], state["postText"], "", ""))
      .then((rslt) => {
        console.log("Pushed", rslt);
        console.log("Doc Id", rslt.id);
      })
      .catch((error) => {
        alert(error);
        console.log("Pushed", error);
      });
    // }
  }
  function handleSubmit(e) {
    console.log("event", e);
    e.preventDefault();
    writeUserInDB()
  }
  function getLocation(place) {
    console.log("returend", place);
    !isEmpty(place) ?
      setLocation({
        ...location,
        'name': place.name,
        'formatted_address': place.formatted_address
      }) : console.log("Place is empty");
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
      <form onSubmit={handleSubmit}>
        <Autocomplete getLocation={getLocation} />
        <TextField
          id=""
          name="postTitle"
          label="Title"
          variant="outlined"
          value={state["postTitle"]}
          error={state["postTitle"] === ""}
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
          error={state["postText"] === ""}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<Icon>send</Icon>}
          type="submit"
        >
          Post
        </Button>

      </form>
    </>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})
export default connect(mapStateToProps)(CreatePost);