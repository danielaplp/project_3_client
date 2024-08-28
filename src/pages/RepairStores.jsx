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
import DetailCardRepairStores from "../components/DetailCardRepairStores";

const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

function RepairStores() {
  const [repairStores, setRepairStores] = useState([]);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [location, setLocation] = useState(null)
  const [selectedRepairStore, setSelectedRepairStore] = useState(null);

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

  const handleRepairStoreClick = (repairStoreId) => {
    navigate(`/repairstore/${repairStoreId}`);
  };

  const handleMarkerMouseOver = (repairstore) => {
    setSelectedRepairStore(repairstore);
  };
  
  const handleMarkerMouseOut = () => {
    setSelectedRepairStore(null);
  };
  
  return (
    <div>
      <div className="bg-green-600 text-white py-4 px-6">
        <h1 className="text-3xl font-bold">Repair Stores</h1>
      </div>
      
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={zoom}
          onLoad={onLoad}
          center={center} // Center map to a central location or calculate dynamically
        >
          {repairStores.map((repairstore) => (
            <Marker
              key={repairstore._id}
              position={repairstore.location}
              label="R"
              onClick={() => handleRepairStoreClick(repairstore._id)}
              onMouseOver={() => handleMarkerMouseOver(repairstore)}
              onMouseOut={handleMarkerMouseOut}
              />
          ))}

{selectedRepairStore && (
            <DetailCardRepairStores
              repairstore={selectedRepairStore}
              onClose={() => setSelectedRepairStore(null)}
            />
          )}

        </GoogleMap>
      )}

      {/* List of repair stores with links */}
      <div>
        {repairStores.map((repairstore) => (
          <div key={repairstore._id}>
            <Link to={`/repairstore/${repairstore._id}`}>
              {/* <h2>{repairstore.name}</h2> */}
            </Link>
            {/* <p>{repairstore.description || "No description available"}</p> */}
            {/* Conditionally render content based on user permissions */}
            {user._id === repairstore.creator && (
              <>
                {/* Add buttons or links for edit/delete if needed */}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default RepairStores;




/* return (
    <div>
      <h1>Repair Stores</h1>

      {repairStores.map(repairstore => {
        return (
          <div key={repairstore._id}>
            <Link to={`/repairstore/${repairstore._id}`}>
              <h2>{repairstore.name}</h2>
            </Link>
            

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
  ); */