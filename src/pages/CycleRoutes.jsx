import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react";
import axios from 'axios'
import { AuthContext } from '../contexts/auth.context';

import CycleAPIService from '../services/cycle.api';


const cycleService = new CycleAPIService();

function CycleRoutes() {
const [cycleRoutes, setCycleRoutes] = useState([]);
const navigate = useNavigate();
const {user} = useContext(AuthContext)

  const fetchData = async () => {
    try {
       const response = await cycleService.getAllCycleRoutes()
       setCycleRoutes(response.data) 
       console.log(response.data)
    } catch (error) {
        console.error(error)
    }

};
const deleteHandler = async (_id) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`);
    setCycleRoutes(cycleRoutes.filter(b => b._id !== _id));
    console.log(`Cycle Route with ID ${_id} deleted`);
  } catch (error) {
    console.log('Error of deleting cycleroute:', error);
  }
};

const EditHandler = async (_id) => {
  navigate(`/cycleroutes/edit/${_id}`);
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
      
      <h1>Cycle Routes</h1>
           
            {cycleRoutes.map(cycleroute => {
                return (
                    <div key={cycleroute._id}>
                        <Link to={`/cycleroutes/${cycleroute._id}`}>
                        <h2>{cycleroute.type}</h2>
                        </Link>
                        <p>{cycleroute.startLocation?.lat || 'No Lat'}</p>
                        <p>{cycleroute.startLocation?.lng || 'No Lng'}</p>
                        <p>{cycleroute.endLocation?.lat || 'No Lat'}</p>
                        <p>{cycleroute.endLocation?.lng || 'No Lng'}</p>
                        {
                          user._id === cycleroute.creator && (<>
                          <button onClick={() => deleteHandler(cycleroute._id)}>Delete</button>
                  
                          <button onClick={() => EditHandler(cycleroute._id)}>Edit</button>
                          </>)
                        }
                        
                        </div>
                );
                
        
            })}
            
            
      
      
      </div>
  )
}

export default CycleRoutes