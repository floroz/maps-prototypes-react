import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GoogleMap from "./GoogleMap";
import Homepage from "./Homepage";
import ReactGoogleMap from "./ReactGoogleMap";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/google-map" exact component={GoogleMap} />
        <Route path="/react-map" component={ReactGoogleMap} />
      </Switch>
    </Router>
  );
}
export default App;
