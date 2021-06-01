import { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { AuthContext } from "./firebase/auth";

import AuthPage from "./pages/auth-page/auth-page";
import Navbar from "./reuseable-components/navbar/navbar.component";

import './App.css';
import Homepage from "./pages/homepage/homepage";

function App() {

  const { currentUser } = useContext(AuthContext)

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => 
          currentUser ?
            <Homepage /> :
            <AuthPage /> }
        />
        
        {!currentUser &&
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

export default App;
