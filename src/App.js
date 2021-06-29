import { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect";

import AuthPage from "./pages/auth-page/auth-page";
import Navbar from "./reuseable-components/navbar/navbar.component";
import Homepage from "./pages/homepage/homepage";
import ProfilePage from "./pages/profile-page/profile-page";
import PostPage from './pages/creatPost-page/creatPost-page'
import postsPage from './pages/posts-page/postsPage'
import { projectAuth } from "./firebase/config";
import { projectFirestore } from "./firebase/config";

import { setCurrentUser } from "./redux/user/user.actions";
import { selectCurrentUser } from "./redux/user/user.selectors";


import './App.css';

const collection = projectFirestore.collection("users")

function App({ currentUser, setCurrentUser }) {

  useEffect(() => {
    projectAuth.onAuthStateChanged((user) => {
      if (user) {
        collection
          .where("id", "==", user.uid)
          .onSnapshot((query) => {
            const items = []
            query.forEach(doc => {
              items.push(doc.data())
            })
            const [userData] = items
            setCurrentUser(userData)
          })
      }

    })
    // eslint-disable-next-line
  }, [])

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" render={() =>
          currentUser ?
            <Homepage /> :
            <AuthPage />}
        />

        {currentUser ?
          <Switch>
            <Route exact path="/profile" component={ProfilePage} />
            <Route exact path="/createPost" component={PostPage} />
            <Route exact path="/posts" component={postsPage} />
          </Switch> :
          <Route path="/:somePath" component={PageNotFound} />}

      </Switch>
    </div>
  )
}

const PageNotFound = () => {
  const style = {
    marginTop: "70px"
  }

  return (
    <h1 style={style}>Page is not available</h1>
  )
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
