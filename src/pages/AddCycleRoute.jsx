import { useState } from "react";
import axios from 'axios';
import { useNavigate} from "react-router-dom";
import CycleAPIService from '../services/cycle.api';



function AddCycleRoute() {
  const [cycleroutes, setCycleRoutes] = useState([]);
  const [type, setType] = useState("")
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const navigate = useNavigate()

  const handleType = (event) => {
    setType(event.target.value)
}
const handleStartLocation = (event) => {
  setStartLocation(event.target.value)
}
const handleEndLocation = (event) => {
  setEndLocation(event.target.value)
}

const handleSubmit = async (event) => {
  event.preventDefault()

  try {
      const cycleRoute ={
          type, startLocation, endLocation
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
    set(cycleroutes.filter(b => b._id !== _id));
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
                <textarea itemType="text" name="start location" value={startLocation} onChange={handleStartLocation}></textarea>
                <label>End Location</label>
                <textarea itemType="text" name="end location" value={endLocation} onChange={handleEndLocation}></textarea>
                <button type="submit">Add Cycle Route</button>
                </form>
              
                

    </div>
  )
}

export default AddCycleRoute




