import { useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import data from "./data";
import tree from "./images/tree.png";
import "./GoogleMap.css";

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const Marker = ({ children }) => children;

const customOptionStyles = [
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#cfe9d1",
      },
    ],
  },
  {
    featureType: "road",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        weight: 1,
      },
    ],
  },
];

const GoogleMap = () => {
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(8);
  const [bounds, setBounds] = useState(null);

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
    option: { radius: 50, maxZoom: 20 },
  });

  const onMarkerClick = (clusterProperties) => {
    console.log(clusterProperties);
  };

  const onClusterClick = ({ clusterId, lat, lng }) => {
    const zoomLevel = Math.min(
      20,
      supercluster.getClusterExpansionZoom(clusterId)
    );
    if (mapRef.current) {
      mapRef.current.setZoom(zoomLevel);
      mapRef.current.panTo({ lat, lng });
    }
  };

  return (
    <div className="map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: API_KEY }}
        defaultZoom={8}
        style={{ width: " 80%", height: "80%" }}
        defaultCenter={{ lat: 51.509865, lng: -0.118092 }}
        ref={mapRef}
        zoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => (mapRef.current = map)}
        onChange={({ zoom, bounds }) => {
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat,
          ]);
          setZoom(zoom);
        }}
        options={{ styles: customOptionStyles }}
      >
        {clusters.map((cluster) => {
          const [lng, lat] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            treeId,
            point_count,
          } = cluster.properties;

          if (isCluster) {
            const dimension = Math.min(
              80,
              25 + (point_count / points.length) * 500
            );

            return (
              <Marker lat={lat} lng={lng} key={cluster.id}>
                <div
                  className="cluster"
                  style={{
                    width: `${dimension}px`,
                    height: `${dimension}px`,
                  }}
                  onClick={() =>
                    onClusterClick({ clusterId: cluster.id, lat, lng })
                  }
                >
                  <p> {point_count}</p>
                </div>
              </Marker>
            );
          } else {
            return (
              <Marker lat={lat} lng={lng} key={`${treeId}${Math.random()}`}>
                <button
                  className="marker--button"
                  onClick={() => onMarkerClick(cluster.properties)}
                >
                  <img src={tree} alt="" className="marker--svg" />
                </button>
              </Marker>
            );
          }
        })}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
