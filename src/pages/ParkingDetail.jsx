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

const ParkingDetail = () => {
  const [parking, setParking] = useState(null);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const { parkingId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(parkingId);

  const getSingleParking = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/parking/${_id}`,
      );
      setParking(response.data);
    } catch (error) {
      console.log("error fetching the parking", error);
    }
  };
  const deleteHandler = async _id => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/parking/${_id}`);
      console.log(`Parking with ID ${_id} deleted`);
    } catch (error) {
      console.log("Error of deleting parking:", error);
    }
    navigate("/parking");
  };

  const EditHandler = async _id => {
    navigate(`/parking/edit/${_id}`);
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
    getSingleParking(parkingId);
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, [parkingId]);

  return (
    <div>
      <div className="bg-green-600 text-white py-4 px-6">
        <h1 className="text-3xl font-bold">Parking Details</h1>
      </div>
      {!parking && <h3>No Parking found</h3>}
      {parking && (
        <div>
          <h2>{parking.type}</h2>
        </div>
      )}

      {parking && (
        <div key={parking._id}>
          <p>{parking.startLocation?.lat || "No Lat"}</p>
          <p>{parking.startLocation?.lng || "No Lng"}</p>
          <p>{parking.endLocation?.lat || "No Lat"}</p>
          <p>{parking.endLocation?.lng || "No Lng"}</p>
          <p>{parking.quantity}</p>
          <p>{parking.parkingPic}</p>
          
          {user._id === parking.creator && (
            <>
              <button onClick={() => deleteHandler(parking._id)}>Delete</button>

              <button onClick={() => EditHandler(parking._id)}>Edit</button>
            </>
          )}

          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={zoom}
              onLoad={onLoad}>
              <Marker
                position={parking.location}
                label="Início"
              />
              <Marker
                position={null}
                label="Fim"
              />
              <Polyline options={{ strokeColor: "#FF0000", strokeWeight: 2 }} />
            </GoogleMap>
          )}
        </div>
      )}

      <Link to="/parking">Back to Parking</Link>
    </div>
  );
};

export default ParkingDetail;
