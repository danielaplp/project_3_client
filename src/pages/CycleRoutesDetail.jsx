import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import CycleAPIService from "../services/cycle.api";
import { AuthContext } from "../contexts/auth.context";
import {
    GoogleMap,
    useJsApiLoader,
    LoadScript,
    Marker,
    Polyline,
  } from "@react-google-maps/api";


const cycleService = new CycleAPIService();

const containerStyle = {
    width: "100%",
    height: "400px",
  };

const CycleRoutesDetail = () => {
  const [cycleRoute, setCycleRoute] = useState(null); 
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const { cycleRouteId } = useParams();
  const {user} = useContext(AuthContext)
  const navigate = useNavigate();

  console.log(cycleRouteId);

  const getSingleCycleRoute = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`,
      );
      setCycleRoute(response.data);
    } catch (error) {
      console.log("error fetching the cycleRoute", error);
    }
  };
  const deleteHandler = async (_id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`);
      console.log(`Cycle Route with ID ${_id} deleted`);
    } catch (error) {
      console.log('Error of deleting cycleroute:', error);
    }
    navigate('/cycleroutes');
  };
  
  const EditHandler = async (_id) => {
    navigate(`/cycleroutes/edit/${_id}`);
  
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

  useEffect(() => {
    getSingleCycleRoute(cycleRouteId);
    setTimeout(()=> {
        setZoom(14);
      }, 500)
  }, [cycleRouteId]);

  

  return (
    <div>
      <h1>Cycle Routes Details</h1>
      {!cycleRoute && <h3>No cycle route found</h3>}
      {cycleRoute && (
        <div>
          <h2>{cycleRoute.type}</h2>
        </div>
      )}

      {cycleRoute && (
        <div key={cycleRoute._id}>
          <p>{cycleRoute.startLocation?.lat || "No Lat"}</p>
          <p>{cycleRoute.startLocation?.lng || "No Lng"}</p>
          <p>{cycleRoute.endLocation?.lat || "No Lat"}</p>
          <p>{cycleRoute.endLocation?.lng || "No Lng"}</p>
          {
                          user._id === cycleRoute.creator && (<>
                          <button onClick={() => deleteHandler(cycleRoute._id)}>Delete</button>
                  
                          <button onClick={() => EditHandler(cycleRoute._id)}>Edit</button>
                          </>)
                        }

{isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={zoom}
                onLoad={onLoad}>
                <Marker
                  position={null}
                  label="Início"
                />
                <Marker
                  position={null}
                  label="Fim"
                />
                <Polyline
                  options={{ strokeColor: "#FF0000", strokeWeight: 2 }}
                />
              </GoogleMap>
            )}
          
        </div>
      )}

      <Link to="/cycleroutes">Back to Cycle Routes</Link>
    </div>
  );
};

export default CycleRoutesDetail;
