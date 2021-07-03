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

import { projectFirestore } from "../../firebase/config"
import "firebase/firestore"
import firebase from "firebase/app"
import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selectors";
import {firestoreConnect, isEmpty} from 'react-redux-firebase'
import {compose} from 'redux'
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect, Route, useHistory  } from "react-router-dom";
import PostPage from "../../pages/creatPost-page/creatPost-page"
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
}]

const ITEM_HEIGHT = 48;
const Post = ({currentUser}) => {
    let history = useHistory();

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [postData, setPostData] = React.useState(postState);
  const newState = []

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [selectedP, setSelectedPostId] = React.useState(null);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const redirect = (id) => {
    history.push(`/creatPost/${id}`)
  }
  const readAllPostsFromDB = () =>{
     var posts = projectFirestore.collectionGroup("postsData");
     posts.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const ownerId = doc.data().userId
            const title = doc.data(). title
            const context = doc.data().context
            const location = doc.data().location
            
            newState.push({"ownerId": ownerId ,"postId": doc.id, 'title': title, 'context': context, 'location': location})
            console.log(doc.id, ' => ', doc.data().title);
        });
    })
    .then(()=>{
        setPostData(newState);

        console.log("postsState", postData);
    })
  }

  useEffect(()=>{
      readAllPostsFromDB();     
  }, [])
 


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log("Presses", event.currentTarget);
    console.log("Presses Id", event.currentTarget.id);
    setSelectedPostId(event.currentTarget.id);
  };


  const handleClose = (event) => {
    setAnchorEl(null);
    console.log("Presses", event.currentTarget.innerText);
   
    
   
    switch (event.currentTarget.innerText) {
        case "Edit":
            var post = projectFirestore.collection("posts").doc(currentUser.id)
            .collection("postsData")
            .doc(selectedP).get().then((res)=>{
                console.log(res.data())
                redirect(selectedP)
            });
            break;
        case "Delete":
        
            break;
        default:
            break;
    }
  };

  return (
      <>

    
    {
    !isEmpty(postData), console.log("empty") &&
    console.log("is nit empty"),
        postData.map((post)=>(
            <Card className={classes.root}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  R
                </Avatar>
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
              subheader="September 14, 2016"
            />
            <CardMedia
              className={classes.media}
              image="/static/images/cards/paella.jpg"
              title="Paella dish"
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                This impressive paella is a perfect party dish and a fun meal to cook together with your
                guests. Add 1 cup of frozen peas along with the mussels, if you like. {post.postId}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>Method:</Typography>
                <Typography paragraph>
                  Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                  minutes.
                </Typography>
                <Typography paragraph>
                  Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                  heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                  browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                  and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                  pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                  saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                </Typography>
                <Typography paragraph>
                  Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                  without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                  medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                  again without stirring, until mussels have opened and rice is just tender, 5 to 7
                  minutes more. (Discard any mussels that don’t open.)
                </Typography>
                <Typography>
                  Set aside off of the heat to let rest for 10 minutes, and then serve.
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        ))
    }
   
    </>
  );
}

export default connect(mapStateToProps) (Post)
