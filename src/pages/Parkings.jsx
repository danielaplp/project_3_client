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

import DetailCardParkings from '../components/DetailCardParkings';


import CycleAPIService from '../services/cycle.api';


const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

function Parkings() {
const [parkings, setParkings] = useState([]);
const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [location, setLocation] = useState(null)
  const [selectedParking, setSelectedParking] = useState(null);

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

const handleParkingClick = (parkingId) => {
  navigate(`/parking/${parkingId}`);
};
const handleMarkerMouseOver = (parking) => {
  setSelectedParking(parking);
};

const handleMarkerMouseOut = () => {
  setSelectedParking(null);
};


return (
  <div>
    <div className="bg-green-600 text-white py-4 px-6">
        <h1 className="text-3xl font-bold">Parkings</h1>
      </div>

    {isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={zoom}
        onLoad={onLoad}
        center={center} 
      >
        {parkings.map((parking) => (
          <Marker
            key={parking._id}
            position={parking.location}
            label="P"
            onClick={() => handleParkingClick(parking._id)} // Navega ao clicar
              onMouseOver={() => handleMarkerMouseOver(parking)}
              onMouseOut={handleMarkerMouseOut}
          />
        ))}


{selectedParking && (
            <DetailCardParkings
              parking={selectedParking}
              onClose={() => setSelectedParking(null)}
            />
          )}

      </GoogleMap>
    )}

    {/* Lista de Links para cada estacionamento (opcional) */}
    <div>
      {parkings.map((parking) => (
        <div key={parking._id}>
          <Link to={`/parking/${parking._id}`}>
            {/* <h2>Type: {parking.type}</h2> */}
          </Link>
          {/* <h3>Quantity: {parking.quantity || 'No quantity'}</h3> */}
          {/* <img src={parking.parkingPic} alt="Parking" style={{ width: "100px", height: "auto" }} /> */}
          {user._id === parking.creator && (
            <>
              {/* Botões para editar ou excluir, se necessário */}
            </>
          )}
        </div>
      ))}
    </div>
  </div>
)
}

export default Parkings