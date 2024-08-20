import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

import CycleAPIService from "../services/cycle.api";

const cycleService = new CycleAPIService();

function EditParking() {
  const { parkingId } = useParams();
  console.log(parkingId);

  const [parking, setParking] = useState(null);
  const [type, setType] = useState("");
  const [startLocationLat, setStartLocationLat] = useState(0);
  const [startLocationLng, setStartLocationLng] = useState(0);
  const [endLocationLat, setEndLocationLat] = useState(0);
  const [endLocationLng, setEndLocationLng] = useState(0);
  const [quantity, setQuantity] = useState(0)
  const [parkingPic, setParkingPic] = useState("")
  const [currentImage, setCurrentImage] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)

  //
  const getSingleParking = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/parking/${_id}`,
      );
      setParking(response.data);
      setType(response.data.type);
      setStartLocationLat(response.data.startLocation.lat);
      setStartLocationLng(response.data.startLocation.lng);
      setEndLocationLat(response.data.endLocation.lat);
      setEndLocationLng(response.data.endLocation.lng);
      setQuantity(response.data.quantity);
      setCurrentImage(response.data.parkingPic)
    
      console.log(response.data);
    } catch (error) {
      console.log("error fetching the parking", error);
    }
  };
  useEffect(() => {
    getSingleParking(parkingId);
  }, [parkingId]);

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

  const handleQuantity = (event) => {
    setQuantity(event.target.value)
  }
  const handleParkingPic = (event) => {
    setParkingPic(event.target.value)
  }

  const handleFileUpload = async (event) => {
    //confoiguring how to send the file
    const uploadData = new FormData()
  
    uploadData.append("imgUrl", event.target.files[0]);
  
    try {
        setLoading(true)
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, uploadData);
        setLoading(false);
        setParkingPic(response.data.fileUrl);
        setCurrentImage(response.data.fileUrl)
        console.log(response.data.fileUrl);
  
    } catch (error) {
        setLoading(false);
        console.error(error)
    }
  }

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const parking = {
        type,
        startLocation: {
          lat: startLocationLat,
          lng: startLocationLng,
        },
        endLocation: {
          lat: endLocationLat,
          lng: endLocationLng,
        },
        quantity,
        parkingPic,
        userId: user._id
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
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/parking/${_id}`,
      );
      set(parking.filter(b => b._id !== _id));
      console.log(`Parking com ID ${_id} excluída `);
    } catch (error) {
      console.log("Erro ao excluir a parking:", error);
    }
  };


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
    
        <label>Start Location</label>
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
          onChange={handleEndLocationLng}></input>

       <label>Quantity</label>
      <input type="number" name="quantity" value={quantity} onChange={handleQuantity}></input>

      <label>Picture</label>
      <input type="file" name="imgUrl"  onChange={handleFileUpload}></input>
<img src={currentImage} alt="" />
        <button type="submit">Edit Parking</button>
      </form>
    </div>
  );
}

export default EditParking;