import React from "react";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CycleAPIService from "../services/cycle.api";
import { AuthContext } from "../contexts/auth.context";
import {
  GoogleMap,
  useJsApiLoader,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

function AddRepairStore() {
  const [repairStore, setRepairStore] = useState([]);
  const [name, setName] = useState("");

  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
 
  const [zoom, setZoom] = useState(10);
  const [polylineCreated, setPolylineCreated] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleName = event => {
    setName(event.target.value);
  };


  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    if (!location) {
      setLocation({ lat, lng });
    } else {
      setLocation({ lat, lng });
      
    }
  };

 

  const handleMarkerDragEnd = (event, setLocation) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (
      !location ||
      !location.lat ||
      !location.lng 
    ) {
      //
      alert("Please select both start and end locations.");
      return;
    }
    try {
      /*  const cycleRoute ={
          type, startLocation: {
            lat: startLocationLat,
            lng: startLocationLng
          }, endLocation: {
            lat: endLocationLat,
            lng: endLocationLng
          }, */
      const repairStore = {
        name,
       location: {
          lat: location.lat,
          lng: location.lng,
        },
       
        userId: user._id,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/repairstore`,
        repairStore,
      );

      navigate("/repairstore");
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost
    } catch (error) {
      console.log("error creating the repair store", error);
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/repairstore/${_id}`,
      );
      set(repairStore.filter(b => b._id !== _id));
      console.log(`Cycle Route com ID ${_id} excluída com sucesso`);
    } catch (error) {
      console.log("Erro ao excluir a cycleroute:", error);
    }
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
    console.log("useEffect: Mounting");
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, []);

  return (
    <div>
      <div className="bg-green-600 text-white py-4 px-6">
        <h1 className="text-3xl font-bold">Add Repair Store</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleName}
        />
      
        <button type="submit">Add Repair Store</button>
      </form>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={zoom}
          onLoad={onLoad}
          onClick={handleMapClick}
          center={center}>
          {location && (
            <Marker
              position={location}
              label="R"
              draggable={true}
              onDragEnd={event => handleMarkerDragEnd(event, setLocation)}
            />
          )}
         
         
          {/* <Marker
                  position={null}
                  label="Início"
                />
                <Marker
                  position={null}
                  label="Fim"
                />
                <Polyline
                  options={{ strokeColor: "#FF0000", strokeWeight: 2 }}
                /> */}
        </GoogleMap>
      )}
    </div>
  );
}

export default AddRepairStore;
