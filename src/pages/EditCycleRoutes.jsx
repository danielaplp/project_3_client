import { useState } from "react";
import axios from 'axios';
import { useNavigate} from "react-router-dom";
import CycleAPIService from '../services/cycle.api';



function EditCycleRoute() {
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

      await axios.put(`${import.meta.env.VITE_API_URL}/api/cycleroutes`, cycleRoute)
      


      navigate("/cycleroutes")
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost


    } catch (error) {
      console.log('error creating the cycle route', error)
  }
}




  return (
    <div>
        <h2>Edit Cycle Route</h2>
        <form onSubmit={handleSubmit}>
                <label>Type</label>
                <input type="text" name="type" value={type} onChange={handleType} />

                <label>Start Location</label>
                <textarea itemType="text" name="start location" value={startLocation} onChange={handleStartLocation}></textarea>
                <label>End Location</label>
                <textarea itemType="text" name="end location" value={endLocation} onChange={handleEndLocation}></textarea>
                <button type="submit">Edit Cycle Route</button>
                </form>
              
                

    </div>
  )
}

export default EditCycleRoute
