import React from 'react'
import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from 'axios'
import CycleAPIService from '../services/cycle.api';


const cycleService = new CycleAPIService();

function CycleRoutes() {
  const [cycleroutes, setCycleRoutes] = useState([]);

  const fetchData = async () => {
    try {
       const response = await cycleService.getAllCycleRoutes()
       setCycleRoutes(response.data) 
    } catch (error) {
        console.error(error)
    }

};
const deleteHandler = async (_id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`);
    setCycleRoutes(cycleroutes.filter(b => b._id !== _id));
    console.log(`Cycle Route with ID ${_id} deleted`);
  } catch (error) {
    console.log('Error of deleting cycleroute:', error);
  }
};



const updateHandler = async (_id) => {
  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`);
    setCycleRoutes(cycleroutes.filter(b => b._id !== _id));
    console.log(`Cycle Route with ID ${_id} updated`);
  } catch (error) {
    console.log('Error of editing cycleroute:', error);
  }
}

useEffect(() => {
console.log('useEffect: Mounting')
fetchData();
},  []);

  return (
    <div>
      
      <h1>Cycle Routes</h1>
            <Link to= '/cycleroutes'>
            <button>Cycle Route</button>
            </Link>
            {cycleroutes.map(cycleroute => {
                return (
                    <div key={cycleroute._id}>
                        <Link to={`/cycleroutes/${cycleroute._id}`}>
                        <h2>{cycleroute.type}</h2>
                        </Link>
                        <p>{cycleroute.startLocation?.lat}</p>
                        <p>{cycleroute.startLocation?.lng}</p>
                        <p>{cycleroute.endLocation?.lat}</p>
                        <p>{cycleroute.endLocation?.lng}</p>
                        <button onClick={() => deleteHandler(cycleroute._id)}>Delete</button>
                        <button onClick={() => updateHandler(cycleroute._id)}>Edit</button>
                        </div>
                );
                
        
            })}
            
            
      
      
      </div>
  )
}

export default CycleRoutes