import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  return (
    <main className="homepage__main">
      <h1 className="homepage__title">Choose your prototype</h1>
      <div className="homepage__link-group">
        <Link to="/google-map">google-maps-react Map</Link>
        <Link to="/react-map">react-google-maps Map</Link>
      </div>
    </main>
  );
};

export default Homepage;
