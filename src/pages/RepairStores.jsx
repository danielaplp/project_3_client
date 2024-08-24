import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/auth.context";
import {
  GoogleMap,
  useJsApiLoader,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";

import CycleAPIService from "../services/cycle.api";

const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "400px",
};

function RepairStores() {
  const [repairStores, setRepairStores] = useState([]);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${import.meta.env.VITE_GMAPS_API_KEY}`,
  });

  const center = {
    lat: 38.722357386512876,
    lng: -9.146005938990468,
  };

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const fetchData = async () => {
    try {
      const response = await cycleService.getAllRepairStores();
      setRepairStores(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("useEffect: Mounting");
    fetchData();
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, []);

  return (
    <div>
      <h1>Repair Stores</h1>

      {repairStores.map(repairstore => {
        return (
          <div key={repairstore._id}>
            <Link to={`/repairstore/${repairstore._id}`}>
              <h2>{repairstore.name}</h2>
            </Link>
            {/* <p>{cycleroute.startLocation?.lat || "No Lat"}</p>
            <p>{cycleroute.startLocation?.lng || "No Lng"}</p>
            <p>{cycleroute.endLocation?.lat || "No Lat"}</p>
            <p>{cycleroute.endLocation?.lng || "No Lng"}</p> */}

            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={zoom}
                onLoad={onLoad}
                center={repairstore.location}>
                <Marker
                  position={repairstore.location}
                  label="R"
                />
                
              
              </GoogleMap>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default RepairStores;