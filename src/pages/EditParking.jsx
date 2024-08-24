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

function EditParking() {
  const { parkingId } = useParams();
  console.log(parkingId);

  const [parking, setParking] = useState(null);
  const [type, setType] = useState("");
  const [location, setLocation] = useState(null);

  const [quantity, setQuantity] = useState(0);
  const [parkingPic, setParkingPic] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  //
  const getSingleParking = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/parking/${_id}`,
      );
      setParking(response.data);
      setType(response.data.type);
      setLocation(response.data.location);
      setQuantity(response.data.quantity);
      setCurrentImage(response.data.parkingPic);

      console.log(response.data);
    } catch (error) {
      console.log("error fetching the parking", error);
    }
  };
  useEffect(() => {
    getSingleParking(parkingId);
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, [parkingId]);

  const handleType = event => {
    setType(event.target.value);
  };

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    console.log({ lat, lng });
    setLocation({ lat, lng });
  };

  const handleQuantity = event => {
    setQuantity(event.target.value);
  };
  const handleParkingPic = event => {
    setParkingPic(event.target.value);
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
      setCurrentImage(response.data.fileUrl);
      console.log(response.data.fileUrl);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const parking = {
        type,
        location,
        quantity,
        parkingPic,
        userId: user._id,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/parking/${parkingId}`,
        parking,
      );

      navigate("/parking");
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost
    } catch (error) {
      console.log("error creating the parking", error);
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/parking/${_id}`);
      set(parking.filter(b => b._id !== _id));
      console.log(`Parking com ID ${_id} excluída `);
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
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  return (
    <div>
      <h2>edit Parking</h2>
      <form onSubmit={handleSubmit}>
        <label>Type</label>
        <input
          type="text"
          name="type"
          value={type}
          onChange={handleType}
        />

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
        <img
          src={currentImage}
          alt=""
        />
        <button type="submit">Edit Parking</button>
      </form>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={zoom}
          onLoad={onLoad}
          onClick={handleMapClick}>
          <Marker
            position={location}
            label="P"
          />

          <Polyline options={{ strokeColor: "#FF0000", strokeWeight: 2 }} />
        </GoogleMap>
      )}
    </div>
  );
}

export default EditParking;
