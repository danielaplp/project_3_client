import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

import CycleAPIService from "../services/cycle.api";

const cycleService = new CycleAPIService();

function EditCycleRoute() {
  const { cycleRoutetId } = useParams();
  console.log(cycleRoutetId);

  const [cycleroute, setCycleRoute] = useState(null);
  const [type, setType] = useState("");
  const [startLocationLat, setStartLocationLat] = useState(0);
  const [startLocationLng, setStartLocationLng] = useState(0);
  const [endLocationLat, setEndLocationLat] = useState(0);
  const [endLocationLng, setEndLocationLng] = useState(0);
  const navigate = useNavigate();

  //
  const getSingleCycleRoute = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`,
      );
      setCycleRoute(response.data);
      setType(response.data.type);
      setStartLocationLat(response.data.startLocation.lat);
      setStartLocationLng(response.data.startLocation.lng);
      setEndLocationLat(response.data.endLocation.lat);
      setEndLocationLng(response.data.endLocation.lng);
      console.log(response.data);
    } catch (error) {
      console.log("error fetching the cycleroute", error);
    }
  };
  useEffect(() => {
    getSingleCycleRoute(cycleRoutetId);
  }, [cycleRoutetId]);

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

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const cycleRoute = {
        type,
        startLocation: {
          lat: startLocationLat,
          lng: startLocationLng,
        },
        endLocation: {
          lat: endLocationLat,
          lng: endLocationLng,
        },
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${cycleRoutetId}`,
        cycleRoute,
      );

      navigate("/cycleroutes");
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost
    } catch (error) {
      console.log("error creating the cycle route", error);
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`,
      );
      set(cycleRoutes.filter(b => b._id !== _id));
      console.log(`Cycle Route com ID ${_id} excluída com sucesso`);
    } catch (error) {
      console.log("Erro ao excluir a cycleroute:", error);
    }
  };

  /* 
  return (
    <div>
      <h1>Cycle Routes</h1>
      <Link to="/cycleroutes">
        <button>Cycle Route</button>
      </Link>
      {cycleroute && (
        <div key={cycleroute._id}>
          <Link to={`/cycleroutes/${cycleroute._id}`}>
            <h2>{cycleroute.type}</h2>
          </Link>
          <p>{cycleroute.startLocation?.lat || "No Lat"}</p>
          <p>{cycleroute.startLocation?.lng || "No Lng"}</p>
          <p>{cycleroute.endLocation?.lat || "No Lat"}</p>
          <p>{cycleroute.endLocation?.lng || "No Lng"}</p>

          {/* <button onClick={() => updateHandler(cycleroute._id)}>Edit</button> }
          <button onClick={() => EditHandler(cycleroute._id)}>Edit</button>
        </div>
      )}
    </div>
  ); */

  return (
    <div>
      <h2>edit Cycle Route</h2>
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

        <button type="submit">Edit Cycle Route</button>
      </form>
    </div>
  );
}

export default EditCycleRoute;
