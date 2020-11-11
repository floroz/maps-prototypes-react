import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import data from "./data";
import treeImg from "./images/tree.png";
import "leaflet/dist/leaflet.css";

const DEFAULT_ZOOM = 8;

const Map = () => {
  const points = data.slice(0, 50).map((tree) => ({
    type: "Feature",
    properties: {
      cluster: false,
      treeId: tree.id,
      name: tree.name,
    },
    geometry: {
      type: "Point",
      coordinates: [parseFloat(tree.lng), parseFloat(tree.lat)],
    },
  }));

  const treeIcon = new L.icon({
    iconUrl: treeImg,
    iconSize: [25, 25],
  });

  return points.map((point) => (
    <Marker
      position={[point.geometry.coordinates[1], point.geometry.coordinates[0]]}
      key={point.properties.treeId}
      icon={treeIcon}
    />
  ));
};

const Leaflet = () => {
  /**
   * Having a child component is required as MapContainer shares the props through Context API
   */

  return (
    <div style={{ height: 800, width: 800 }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={DEFAULT_ZOOM}
        maxZoom={20}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Map />
      </MapContainer>
    </div>
  );
};

export default Leaflet;
