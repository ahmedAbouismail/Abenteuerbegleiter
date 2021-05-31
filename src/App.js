
import { Switch, Route } from "react-router-dom";

import './App.css';
import AuthPage from "./pages/auth-page/auth-page";
import Navbar from "./reuseable-components/navbar/navbar.component";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" component={AuthPage} />
      </Switch>
    </div>
  );
}

export default App;
