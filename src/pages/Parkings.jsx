import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from 'axios'

import CycleAPIService from '../services/cycle.api';


const cycleService = new CycleAPIService();

function Parkings() {
const [parkings, setParkings] = useState([]);
const navigate = useNavigate();

const fetchData = async () => {
  try {
      const response = await cycleService.getAllParkings();
      setParkings(response.data); 
      console.log(response.data);
  } catch (error) {
      console.error(error);
  }
};


const deleteHandler = async (_id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/parking/${_id}`);
    setParkings(parkings.filter(b => b._id !== _id));
    console.log(`Parking with ID ${_id} deleted`);
  } catch (error) {
    console.log('Error of deleting parking:', error);
  }
};

const EditHandler = async (_id) => {
  navigate(`/parking/edit/${_id}`);
  /* try {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`);
    setCycleRoutes(cycleroutes.filter(b => b._id !== _id));
    console.log(`Cycle Route with ID ${_id} updated`);
  } catch (error) {
    console.log('Error of editing cycleroute:', error);
  } */
};


useEffect(() => {
console.log('useEffect: Mounting')
fetchData();
},  []);

  return (
    <div>
      
      <h1>Parkings</h1>
           
            {parkings.map(parking => {
                return (
                    <div key={parking._id}>
                        <Link to={`/parkings/${parking._id}`}>
                        <h2>{parking.type}</h2>
                        </Link>
                        <p>{parking.startLocation?.lat || 'No Lat'}</p>
                        <p>{parking.startLocation?.lng || 'No Lng'}</p>
                        <p>{parking.endLocation?.lat || 'No Lat'}</p>
                        <p>{parking.endLocation?.lng || 'No Lng'}</p>
                        <p>{parking.quantity || 'No quantity'}</p>
                        <p>{parking.parkingPic || 'No Pic'}</p>
                        <button onClick={() => deleteHandler(parking._id)}>Delete</button>
                        {/* <button onClick={() => updateHandler(cycleroute._id)}>Edit</button> */}
                        <button onClick={() => EditHandler(parking._id)}>Edit</button>
                        </div>
                );
                
        
            })}
            
            
      
      
      </div>
  )
}

export default Parkings