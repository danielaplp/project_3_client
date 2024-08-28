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

function AddParking() {
  const [parkings, setParkings] = useState([]);
  const [type, setType] = useState("");
  /* const [startLocationLat, setStartLocationLat] = useState(0);
  const [startLocationLng, setStartLocationLng] = useState(0);
  const [endLocationLat, setEndLocationLat] = useState(0);
  const [endLocationLng, setEndLocationLng] = useState(0); */
  const [location, setLocation] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [parkingPic, setParkingPic] = useState("");
  const [loading, setLoading] = useState(false);

  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

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
  const handleQuantity = event => {
    setQuantity(event.target.value);
  };

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    console.log({ lat, lng})
      setLocation({ lat, lng });
    
  };

  const handleFileUpload = async event => {
    //confoiguring how to send the file
    const uploadData = new FormData();

    uploadData.append("imgUrl", event.target.files[0]);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        uploadData,
      );
      setLoading(false);
      setParkingPic(response.data.fileUrl);
      console.log(response.data.fileUrl);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const handleMarkerDragEnd = (event, setLocation) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!location || !location.lat || !location.lng) {
      alert("Please select both start and end locations.");
      return;
    }
    try {
      const parking = {
        type,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        quantity,
        parkingPic,
        userId: user._id,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/parking`, parking);

      navigate("/parking");
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost
    } catch (error) {
      console.log("error creating the parking, error");
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/parking/${_id}`);
      set(parkings.filter(b => b._id !== _id));
      console.log(`Parking com ID ${_id} excluído com sucesso`);
    } catch (error) {
      console.log("Erro ao excluir a parking:", error);
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
        <h1 className="text-3xl font-bold">Add Parking</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Type</label>
        <input
          type="text"
          name="type"
          value={type}
          onChange={handleType}
        />

        {/* <label>Start Location</label>
      <input type="number" name="start location" value={startLocationLat} onChange={handleStartLocationLat}></input>
      <input type="number" name="start location" value={startLocationLng} onChange={handleStartLocationLng}></input>
      
      
      <label>End Location</label>
      <input type="number" name="end location" value={endLocationLat} onChange={handleEndLocationLat}></input>
      <input type="number" name="end location" value={endLocationLng} onChange={handleEndLocationLng}></input>
 */}
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={quantity}
          onChange={handleQuantity}></input>

        <label>Picture</label>
        <input
          type="file"
          name="imgUrl"
          onChange={handleFileUpload}></input>

        <button
          type="submit"
          disabled={loading}>
          Add Parking
        </button>
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
            label="Start"
            draggable={true}
              onDragEnd={event => handleMarkerDragEnd(event, setLocation)}
          />
            )}
          
          
        </GoogleMap>
      )}
    </div>
  );
}

export default AddParking;
