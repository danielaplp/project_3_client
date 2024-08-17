import React from 'react'
import { useState, useContext } from "react";
import axios from 'axios';
import { useNavigate} from "react-router-dom";
import CycleAPIService from '../services/cycle.api';
import { AuthContext } from '../contexts/auth.context';



//fazer a mesma coisa com endLocation
function AddCycleRoute() {
  const [cycleRoutes, setCycleRoutes] = useState([]);
  const [type, setType] = useState("")
  const [startLocationLat, setStartLocationLat] = useState(0)
  const [startLocationLng, setStartLocationLng] = useState(0)
  const [endLocationLat, setEndLocationLat] = useState(0)
  const [endLocationLng, setEndLocationLng] = useState(0)
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const handleType = (event) => {
    setType(event.target.value)
}
const handleStartLocationLat = (event) => {
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
}

const handleSubmit = async (event) => {
  event.preventDefault()

  try {
      const cycleRoute ={
          type, startLocation: {
            lat: startLocationLat,
            lng: startLocationLng
          }, endLocation: {
            lat: endLocationLat,
            lng: endLocationLng
          },
          userId: user._id
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/cycleroutes`, cycleRoute)



      navigate("/cycleroutes")
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost


    } catch (error) {
      console.log('error creating the cycle route', error)
  }
}

const deleteHandler = async (_id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`);
    set(cycleRoutes.filter(b => b._id !== _id));
    console.log(`Cycle Route com ID ${_id} excluída com sucesso`);
  } catch (error) {
    console.log('Erro ao excluir a cycleroute:', error);
  }
};



return (
  <div>
    <h2>Add Cycle Route</h2>
    <form onSubmit={handleSubmit}>
      <label>Type</label>
      <input type="text" name="type" value={type} onChange={handleType} />

      <label>Start Location</label>
      <input type="number" name="start location" value={startLocationLat} onChange={handleStartLocationLat}></input>
      <input type="number" name="start location" value={startLocationLng} onChange={handleStartLocationLng}></input>
      
      
      <label>End Location</label>
      <input type="number" name="end location" value={endLocationLat} onChange={handleEndLocationLat}></input>
      <input type="number" name="end location" value={endLocationLng} onChange={handleEndLocationLng}></input>
      
      <button type="submit">Add Cycle Route</button>
    </form>
  </div>
);
}

export default AddCycleRoute;
