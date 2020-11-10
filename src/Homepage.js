import React from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  return (
    <main className="homepage__main">
      <h1 className="homepage__title">Choose your prototype</h1>
      <div className="homepage__link-group">
        <Link to="/google-map">Google Map</Link>
        <Link to="/mapbox">Mapbox</Link>
      </div>
    </main>
  );
};

export default Homepage;
