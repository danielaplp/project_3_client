import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
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

function EditRepairStore() {
  const { repairStoreId } = useParams();
  console.log(repairStoreId);

  const [cycleroute, setCycleRoute] = useState(null);
  const [name, setName] = useState("");
  
  const [location, setLocation] = useState(null);
  

  const [dragging, setDragging]= useState(null);

  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  //
  const getSingleRepairStore = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/repairstore/${_id}`,
      );
      setRepairStore(response.data);
      setType(response.data.type);
      setStartLocation(response.data.startLocation);
   
      setEndLocation(response.data.endLocation);
     
      console.log(response.data);
    } catch (error) {
      console.log("error fetching the cycleroute", error);
    }
  };

  useEffect(() => {
    getSingleCycleRoute(cycleRouteId);
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, [cycleRouteId]);

  const handleType = event => {
    setType(event.target.value);
  };
  const handleStartLocationLat = event => {
    setStartLocationLat(event.target.value);
  };
  const handleStartLocationLng = event => {
    setStartLocationLng(event.target.value);
  };
  const handleEndLocationLat = event => {
    setEndLocationLat(event.target.value);
  };
  const handleEndLocationLng = event => {
    setEndLocationLng(event.target.value);
  };

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

  const handleMarkerDragStart = (marker) => {
    setDragging(marker); 
  };
  const handleMarkerDragEnd = (event) => {
    const newLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };

    if (dragging === "start") {
      setStartLocation(newLocation);
    } else if (dragging === "end") {
      setEndLocation(newLocation);
    }

    setDragging(null); 
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
      /* const cycleRoute = {
        type,
        startLocation: {
          lat: startLocationLat,
          lng: startLocationLng,
        },
        endLocation: {
          lat: endLocationLat,
          lng: endLocationLng,
        },
        userId: user._id,
      }; */

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${cycleRouteId}`,
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
      console.log(`Cycle Route com ID ${_id} excluída`);
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

  return (
    <div>
      <h2>edit Cycle Route</h2>
      <form onSubmit={handleSubmit}>
        <label>Type</label>
        <input
          type="text"
          name="type"
          value={type}
          onChange={handleType}
        />

        {/* <label>Start Location</label>
        <input
          type="number"
          name="start location"
          value={startLocationLat}
          onChange={handleStartLocationLat}></input>
        <input
          type="number"
          name="start location"
          value={startLocationLng}
          onChange={handleStartLocationLng}></input>

        <label>End Location</label>
        <input
          type="number"
          name="end location"
          value={endLocationLat}
          onChange={handleEndLocationLat}></input>
        <input
          type="number"
          name="end location"
          value={endLocationLng}
          onChange={handleEndLocationLng}></input> */}

        <button type="submit">Edit Cycle Route</button>
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
              position={cycleroute.startLocation}
              label="Start"
              draggable={true}
              onDragStart={() => handleMarkerDragStart("start")}
              onDragEnd={event => handleMarkerDragEnd(event, setStartLocation)}
            />
          )}
          {endLocation && (
          <Marker
            position={cycleroute.endLocation}
            label="End"
            draggable={true}
            onDragStart={() => handleMarkerDragStart("end")}
              onDragEnd={event => handleMarkerDragEnd(event, setEndLocation)}
          />
        )}
          {startLocation && endLocation && (
            <Polyline
              path={[startLocation, endLocation]}
              options={{ strokeColor: "green", strokeWeight: 5 }}
            />
          )}
          
        </GoogleMap>
      )}
    </div>
  );
}

export default EditCycleRoute;
