import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/auth.context";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";

import CycleAPIService from "../services/cycle.api";

const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

function CycleRoutes() {
  const [cycleRoutes, setCycleRoutes] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const response = await cycleService.getAllCycleRoutes();
      setCycleRoutes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("useEffect: Mounting");
    fetchData();
  }, []);

  return (
    <div>
      <h1>Cycle Routes</h1>

      {cycleRoutes.map(cycleroute => {
        return (
          <div key={cycleroute._id}>
            <Link to={`/cycleroutes/${cycleroute._id}`}>
              <h2>{cycleroute.type}</h2>
            </Link>
            <p>{cycleroute.startLocation?.lat || "No Lat"}</p>
            <p>{cycleroute.startLocation?.lng || "No Lng"}</p>
            <p>{cycleroute.endLocation?.lat || "No Lat"}</p>
            <p>{cycleroute.endLocation?.lng || "No Lng"}</p>

            <LoadScript googleMapsApiKey>
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={12}>
                {/*  <Marker position={cycleroute.startLocation?.lat} label="Início" />
                <Marker position={cycleroute.endLocation?.lat && cycleroute.endLocation?.lng } label="Fim" />
                <Polyline  options={{ strokeColor: "#FF0000", strokeWeight: 2 }} /> */}

                <></>
              </GoogleMap>
            </LoadScript>
          </div>
        );
      })}
    </div>
  );
}

export default CycleRoutes;
