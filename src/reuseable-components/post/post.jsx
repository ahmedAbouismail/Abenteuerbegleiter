import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Container from "@material-ui/core/Container";
import { projectFirestore, projectStorage } from "../../firebase/config"
import "firebase/firestore"
import firebase from "firebase/app"
import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import { isEmpty } from 'react-redux-firebase'
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import ChatIcon from '@material-ui/icons/Chat';





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

const Post = ({ currentUser, searchLoc }) => {
  let history = useHistory();

  const classes = useStyles();
  const [postData, setPostData] = React.useState(postState);
  const [tempPostData, setTempPostData] = React.useState([])
  const newState = []
  const newUser = []
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userData, setUserData] = React.useState(userState);
  const open = Boolean(anchorEl);

  const [selectedP, setSelectedPostId] = React.useState(null);

  const redirect = (id) => {
    history.push(`/createPost/${id}`)
  }
  const readAllPostsFromDB = () => {
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
        if (!isEmpty(likes)) {
          likes.forEach((like) => {
            if (like.id === currentUser.id) {
              likeStatus = true;
              console.log("found like", like.id);
            }
          })
        }
        newState.push({ "ownerId": ownerId, "postId": doc.id, 'title': title, 'context': context, 'location': location.location.name, "imageUrl": imageUrl, "like": likeStatus, "likesCount": count, "createdTimestamp": createdTimestamp.toDate().toString() })
        console.log(doc.id, ' => ', doc.data().title);
      });
    })
      .then(() => {
        setPostData(newState);

        console.log("postsState", postData);
      })
  }

  function getUserData() {
    const data = projectFirestore.collection("users").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const email = doc.data().email
          const id = doc.data().id
          const phoneNumber = doc.data().phoneNumber
          const picUrl = doc.data().picUrl
          const displayName = doc.data().displayName
          newUser.push({ "email": email, "id": id, "phoneNumber": phoneNumber, "picUrl": picUrl, "displayName": displayName })
        });
      }).then(() => {
        setUserData(newUser)
      });

  }

  useEffect(() => {
    readAllPostsFromDB();
    getUserData();
  }, [])

  useEffect(() => {
    if (searchLoc) {
      if (postData && postData.length > 0 && tempPostData.length === 0) {
        setTempPostData(postData)
      }
      const lowerCase = searchLoc.toLowerCase()
      if (tempPostData && tempPostData.length > 0) {
        const tempArray = tempPostData
        const filtered = tempArray.filter(item => {
          // console.log(item.location.toLowerCase().includes(lowerCase))
          return item.location.toLowerCase().includes(lowerCase)
        })
        // console.log(tempPostData);
        setPostData(filtered)
      }
    } else {
      console.log("empty search box");
      setPostData(tempPostData)
    }
  }, [searchLoc])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log("Presses", event.currentTarget);
    console.log("Presses Id", event.currentTarget.id);
    setSelectedPostId(event.currentTarget.id);
  };

  function checkLikeStatus(event) {
    var d = null;
    var c = null;
    const post = projectFirestore.collectionGroup("postsData")
      .where("postId", "==", event.currentTarget.id).get()
      .then((res) => {
        res.forEach((doc) => {
          if (isEmpty(doc.data().likes)) {
            d = doc;
            c = false;
          } else {
            doc.data().likes.forEach((like) => {
              if (like.id === currentUser.id) {
                c = true;
                d = doc;
                console.log("The User liked this", d);
              } else {
                c = false;
                d = doc;
                console.log("The User liked this", d);
              }
            })
          }
        }
        )
        if (!c) {
          console.log("put", d);
          putLike(d);

        } else {
          console.log("remove", d);
          removeLike(d)

        }
      })

  }

  function putLike(d) {
    console.log("Put Like Function");
    const like = d.ref.update({
      likes: firebase.firestore.FieldValue.arrayUnion({
        id: currentUser.id,
        status: true
      })
    }).then(() => {
      readAllPostsFromDB()
    })
    console.log("Add Like", d);
  }

  function removeLike(d) {
    console.log("Remove Function");
    const like = d.ref.update({
      likes: firebase.firestore.FieldValue.arrayRemove({
        id: currentUser.id,
        status: true
      })
    }).then(() => {
      readAllPostsFromDB();
    })

    console.log("Removed Like", d);
  }
  function handleLike(event) {
    checkLikeStatus(event);
  }

  const handleClose = (event) => {
    setAnchorEl(null);
    console.log("Presses", event.currentTarget.innerText);

    switch (event.currentTarget.innerText) {
      case "Edit":
        const editRes = projectFirestore.collection("posts").doc(currentUser.id)
          .collection("postsData")
          .doc(selectedP).get().then((res) => {
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

  function openChat() {
    history.push("/chats")
  }
  return (
    <>


      {// eslint-disable-next-line
        !isEmpty(postData) ?
          postData.map((post, i) => (
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="center"
              spacing={3}
              key={"grid" + i}
            >
              <Container
                key={"container" + 4}
                // maxWidth="sm" 
                style={{ width: "50vw", hight: "100%" }}
              >


                <Card key={"card" + i} className={classes.root}>

                  <CardHeader
                  key={"cardheader" + i}
                    avatar={!isEmpty(userData) &&
                      userData.map((data, d) => (
                        <div key={"dataheader" + d}>
                          {data.id === post.ownerId &&
                            <Avatar
                              key={"Avatar"}
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
                          key={7}
                          id={post.postId}
                          aria-label="settings"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={handleClick}>
                          <MoreVertIcon 
                          key={"MoreVertIcon "}/>
                        </IconButton>
                        <Menu
                          key={8}
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
                    key={9}
                    component="img"
                    alt="Contemplative Reptile"
                    height="500"
                    image={post.imageUrl}
                    title="Contemplative Reptile"
                  />

               
                  <CardContent
                    key={10}
                  >
                    <Typography key={11} variant="body2" color="textPrimary" component="p">
                      {post.context}
                    </Typography>
                    <Typography key={12} variant="body2" color="textSecondary" component="p">
                      Destination: {post.location}
                    </Typography>

                    {!isEmpty(userData) &&
                      userData.map((data, indexData) => (
                        <div key={"contentdata" + indexData}>
                          {data.id === post.ownerId &&
                            <div>
                              <Typography key={13} variant="body2" color="textSecondary" component="p">
                                Name: {data.displayName}
                              </Typography>
                              <Typography key={14} variant="body2" color="textSecondary" component="p">
                                Email: {data.email}
                              </Typography>
                            </div>
                          }
                        </div>

                      ))
                    }

                  </CardContent>

                  <CardActions key={15} disableSpacing>
                    <IconButton
                      key={16}
                      id={post.postId}
                      aria-label="Like"
                      onClick={handleLike}
                    >
                      {(post.like === true) ? <FavoriteIcon key={19} style={{ color: red[500] }} /> : <FavoriteIcon />}
                      <p style={{ fontSize: 15, color: 'black' }}> {" " + post.likesCount}</p>
                    </IconButton>
                    <IconButton key={17} onClick={openChat}  aria-label="share">
                      <ChatIcon
                        key={18}
                        />
                    </IconButton>
                  </CardActions>


                </Card>
              </Container>
            </Grid>
          )) :
          <Grid
            key={20}
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={3}
          >
            <Container key={21} style={{ width: "50vw", hight: "50vh" }} >
              <Card key={22} className={classes.root} style={{height: "75vh", backgroundColor: "transparent", boxShadow: "none"}}>
                <h1>not found</h1>
              </Card>
            </Container>
          </Grid>
      }

    </>
  );
}

export default connect(mapStateToProps)(Post)
