import React from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react";
import axios from 'axios'
import { AuthContext } from '../contexts/auth.context';
import {
  GoogleMap,
  useJsApiLoader,
  LoadScript,
  Marker,
  
} from "@react-google-maps/api";


import CycleAPIService from '../services/cycle.api';


const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "400px",
};

function Parkings() {
const [parkings, setParkings] = useState([]);
const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [location, setLocation] = useState(null)

const navigate = useNavigate();
const {user} = useContext(AuthContext);


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
  /* const bounds = new window.google.maps.LatLngBounds(center);
  map.fitBounds(bounds); */
  setMap(map);
}, []);

const fetchData = async () => {
  try {
      const response = await cycleService.getAllParkings();
      setParkings(response.data); 
      console.log(response.data);
  } catch (error) {
      console.error(error);
  }
};



useEffect(() => {
console.log('useEffect: Mounting')
fetchData();
setTimeout(()=> {
  setZoom(14);
}, 500)
},  []);

  return (
    <div>
      
      <h1>Parkings</h1>
           
            {parkings.map(parking => {
                return (
                    <div key={parking._id}>
                        <Link to={`/parking/${parking._id}`}>
                        <h2>Type: {parking.type}</h2>
                        </Link>
                        {/* <p>{parking.startLocation?.lat || 'No Lat'}</p>
                        <p>{parking.startLocation?.lng || 'No Lng'}</p>
                        <p>{parking.endLocation?.lat || 'No Lat'}</p>
                        <p>{parking.endLocation?.lng || 'No Lng'}</p> */}
                        <h3>Quantity: {parking.quantity || 'No quantity'}</h3>
                       <img src={parking.parkingPic} alt="" />
                        {
                          user._id === parking.creator && (<>
                        
                        </>)
            }

{isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={zoom}
                onLoad={onLoad}
                center={parking.location}>
                <Marker
                  position={parking.location}
                  label="P"
                />
              
                
              </GoogleMap>
            )}
                        </div>
                );
                
        
            })}
            
            
      
      
      </div>
  )
}

export default Parkings