import React, { useRef, useState } from "react";
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import data from "./data";
import treeImg from "./images/tree.png";
import "./Mapbox.css";
import useSupercluster from "use-supercluster";

const API_KEY = process.env.REACT_APP_MAPBOX_API_KEY;

const Mapbox = () => {
  const [viewport, setViewport] = useState({
    width: 800,
    height: 800,
    latitude: 51.509865,
    longitude: -0.118092,
    zoom: 8,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef();

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

  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null;

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    option: { radius: 200, maxZoom: 20 },
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

        return (
          <Marker latitude={lat} longitude={lng} key={treeId}>
            <div
              className="mapbox__cluster"
              onClick={() => {
                const expansionZoom = Math.min(
                  20,
                  supercluster.getClusterExpansionZoom(cluster.id)
                );
                setViewport({
                  ...viewport,
                  latitude: lat,
                  longitude: lng,
                  zoom: expansionZoom,
                  transitionInterpolator: new FlyToInterpolator({
                    speed: 2,
                  }),
                  transitionDuration: "auto",
                });
              }}
              style={{ width: `${dimension}px`, height: `${dimension}px` }}
            >
              {point_count}
            </div>
          </Marker>
        );
      } else {
        return (
          <Marker latitude={lat} longitude={lng} key={treeId}>
            <div
              style={{ width: 25, height: 25 }}
              onClick={() => setSelectedMarker(cluster)}
            >
              <img src={treeImg} alt="" className="mapbox__marker--svg" />
            </div>
          </Marker>
        );
      }
    });
  };

  return (
    <div>
      <ReactMapGL
        mapboxApiAccessToken={API_KEY}
        mapStyle="mapbox://styles/floroz/ckhbtjzf50u4718lle7journb"
        {...viewport}
        onViewportChange={(nextViewport) => {
          setViewport({ ...nextViewport });
        }}
        ref={mapRef}
        maxZoom={20}
      >
        {generateClusters()}
        {selectedMarker && (
          <Popup
            latitude={selectedMarker.geometry.coordinates[1]}
            longitude={selectedMarker.geometry.coordinates[0]}
            onClose={() => setSelectedMarker(null)}
          >
            <h1>{selectedMarker.properties.name}</h1>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
};

export default Mapbox;
