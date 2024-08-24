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
  height: "400px",
};

function AddCycleRoute() {
  const [cycleRoutes, setCycleRoutes] = useState([]);
  const [type, setType] = useState("");
  const [startLocationLat, setStartLocationLat] = useState(0);
  const [startLocationLng, setStartLocationLng] = useState(0);
  const [endLocationLat, setEndLocationLat] = useState(0);
  const [endLocationLng, setEndLocationLng] = useState(0);
  const [map, setMap] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [polylineCreated, setPolylineCreated] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleType = event => {
    setType(event.target.value);
  };
  /* const handleStartLocationLat = (event) => {
  setStartLocationLat(event.target.value)
}
const handleStartLocationLng = (event) => {
  setStartLocationLng(event.target.value)
}
const handleEndLocationLat = (event) => {
  setEndLocationLat(event.target.value)
}
const handleEndLocationLng = (event) => {
  setEndLocationLng(event.target.value)
} */

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    if (!startLocation) {
      setStartLocation({ lat, lng });
    } else if (!endLocation) {
      setEndLocation({ lat, lng });
    } else {
      setStartLocation({ lat, lng });
      setEndLocation(null);
    }
  };

  /*   if (!startLocationLat && !startLocationLng) {
    setStartLocationLat({ lat, lng });
    setStartLocationLng({ lat, lng });
  } 
  
  else if (!endLocationLat && !endLocationLng) {
    setEndLocationLat({ lat, lng });
    setEndLocationLng({ lat, lng });
    setPolylineCreated(true)
  } 
  
  else {
    setStartLocationLat({ lat, lng });
    setStartLocationLng({ lat, lng });
    setEndLocationLat(null);
    setEndLocationLng(null);
  }
}; */

  const handleMarkerDragEnd = (event, setLocation) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (
      !startLocation ||
      !startLocation.lat ||
      !startLocation.lng ||
      !endLocation ||
      !endLocation.lat ||
      !endLocation.lng
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
      const cycleRoute = {
        type,
        startLocation: {
          lat: startLocation.lat,
          lng: startLocation.lng,
        },
        endLocation: {
          lat: endLocation.lat,
          lng: endLocation.lng,
        },
        userId: user._id,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes`,
        cycleRoute,
      );

      navigate("/cycleroutes");
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost
    } catch (error) {
      console.log("error creating the cycle route", error);
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`,
      );
      set(cycleRoutes.filter(b => b._id !== _id));
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
      <h2>Add Cycle Route</h2>
      <form onSubmit={handleSubmit}>
        <label>Type</label>
        <select name="type" id="type" onChange={handleType} value={type}>
          <option value="Path"> Path</option>
          <option value="U Turn"> U turn</option>
        </select>
       
        {/* 
      <label>Start Location</label>
      <input type="number" name="start location" value={startLocationLat} onChange={handleStartLocationLat} ></input>
      <input type="number" name="start location" value={startLocationLng} onChange={handleStartLocationLng}></input>
      
      
      <label>End Location</label>
      <input type="number" name="end location" value={endLocationLat} onChange={handleEndLocationLat} ></input>
      <input type="number" name="end location" value={endLocationLng} onChange={handleEndLocationLng} ></input>
       */}
        <button type="submit">Add Cycle Route</button>
      </form>

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={zoom}
          onLoad={onLoad}
          onClick={handleMapClick}
          center={center}>
          {startLocation && (
            <Marker
              position={startLocation}
              label="Start"
              draggable={true}
              onDragEnd={event => handleMarkerDragEnd(event, setStartLocation)}
            />
          )}
          {endLocation && (
            <Marker
              position={endLocation}
              label="End"
              draggable={true}
              onDragEnd={event => handleMarkerDragEnd(event, setEndLocation)}
            />
          )}
          {startLocation && endLocation && (
            <Polyline
              path={[startLocation, endLocation]}
              options={{ strokeColor: "green", strokeWeight: 5 }}
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

export default AddCycleRoute;
