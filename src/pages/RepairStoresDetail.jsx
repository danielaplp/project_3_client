import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import CycleAPIService from "../services/cycle.api";
import { AuthContext } from "../contexts/auth.context";
import {
  GoogleMap,
  useJsApiLoader,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";

const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

const RepairStoreDetail = () => {
  const [repairStore, setRepairStore] = useState(null);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const { repairstoreId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(repairstoreId);

  const getSingleRepairStore = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/repairstore/${_id}`,
      );
      setRepairStore(response.data);
    } catch (error) {
      console.log("error fetching the repair store", error);
    }
  };
  const deleteHandler = async _id => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/repairstore/${_id}`,
      );
      console.log(`Repair Store with ID ${_id} deleted`);
    } catch (error) {
      console.log("Error of deleting repair store", error);
    }
    navigate("/repairstore");
  };

  const EditHandler = async _id => {
    navigate(`/repairstore/edit/${_id}`);
  };

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
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  useEffect(() => {
    getSingleRepairStore(repairstoreId);
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, [repairstoreId]);

  return (
    <div>
     <div className="bg-green-600 text-white py-4 px-6">
        <h1 className="text-3xl font-bold">Repair Store Details</h1>
      </div>
      {!repairStore && <h3>No Repair Store found</h3>}
      {repairStore && (
        <div>
          <h2>{repairStore.name}</h2>
        </div>
      )}

      {repairStore && (
        <div key={repairStore._id}>
          <p>{repairStore.location?.lat || "No Lat"}</p>
          <p>{repairStore.location?.lng || "No Lng"}</p>

          {user._id === repairStore.creator && (
            <>
              <button onClick={() => deleteHandler(repairStore._id)}>
                Delete
              </button>

              <button onClick={() => EditHandler(repairStore._id)}>Edit</button>
            </>
          )}

          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={zoom}
              onLoad={onLoad}
              center={repairStore.location}>
              <Marker
                position={repairStore.lotation}
                label="R"
              />

            
            </GoogleMap>
          )}
        </div>
      )}

      <Link to="/repairstore">Back to Repair Stores</Link>
    </div>
  );
};

export default RepairStoreDetail;
