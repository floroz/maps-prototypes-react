import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GoogleMap from "./GoogleMap";
import Homepage from "./Homepage";
import Mapbox from "./Mapbox";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/google-map" exact component={GoogleMap} />
        <Route path="/mapbox" component={Mapbox} />
      </Switch>
    </Router>
  );
}

export default App;
