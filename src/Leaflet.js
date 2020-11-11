import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import data from "./data";
import treeImg from "./images/tree.png";
import useSupercluster from "use-supercluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import MarkerClusterGroup from "react-leaflet-markercluster";

const DEFAULT_ZOOM = 8;

const Map = () => {
  const map = useMap();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const points = data.map((tree) => ({
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

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    option: { radius: 200, maxZoom: 20 },
  });

  const updateMap = useCallback(() => {
    const b = map.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);

    setZoom(map.getZoom());
  }, []);

  useEffect(() => {
    updateMap();
  }, [updateMap]);

  useMapEvents({
    update: updateMap,
  });

  const treeIcon = new L.icon({
    iconUrl: treeImg,
    iconSize: [25, 25],
  });

  const generateClusters = () => {
    return clusters.map((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const { cluster: isCluster, treeId, point_count } = cluster.properties;

      if (isCluster) {
        const dimension = Math.min(
          80,
          25 + (point_count / points.length) * 500
        );

        return <Marker position={[lng, lat]} key={treeId} />;
      } else {
        return <Marker position={[lng, lat]} key={treeId} icon={treeIcon} />;
      }
    });
  };

  return generateClusters();
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
        <MarkerClusterGroup>
          <Map />
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default Leaflet;
