import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/auth.context";
import {
  GoogleMap,
  useJsApiLoader,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";

import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Heading,
  useToast,
  Select,
} from "@chakra-ui/react";

import DetailCardRoutes from "../components/DetailCardRoutes";

import CycleAPIService from "../services/cycle.api";

const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",

};

function CycleRoutes() {
  const [cycleRoutes, setCycleRoutes] = useState([]);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [polyline, setPolyline] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

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
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, []);

  const handleRouteClick = routeId => {
    navigate(`/cycleroutes/${routeId}`);
  };
  const handlePolylineMouseOver = cycleroute => {
    setSelectedRoute(cycleroute);
  };

  const handlePolylineMouseOut = () => {
    setSelectedRoute(null);
  };

  const handlePolylineLoad = polyline => {
    setPolyline(polyline);
  };

  return (
    <div>
      <Box>
        <Stack
          direction={["column", "row"]}
          bg="green.600"
          color="white"
          p={3}
          mb={2}
          justifyContent={"space-between"}>
          <Heading
            as="h1"
            size="xl"
            py={2}
            px={6}>
            Cycle Routes
          </Heading>

          <Link to={"/cycleroutes/new"}>
            <Button py={5}>Add New</Button>
          </Link>
        </Stack>

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={zoom}
            onLoad={onLoad}
            center={center}>
            {cycleRoutes.map(cycleroute => (
              <React.Fragment key={cycleroute._id}>
                <Marker
                  position={cycleroute.startLocation}
                  label="S"
                  onClick={() => handleRouteClick(cycleroute._id)}
                />

                <Marker
                  position={cycleroute.endLocation}
                  label="E"
                  onClick={() => handleRouteClick(cycleroute._id)}
                />

                <Polyline
                  path={[cycleroute.startLocation, cycleroute.endLocation]}
                  options={{ strokeColor: "#2ecc71", strokeWeight: 5 }}
                  onMouseOver={() => handlePolylineMouseOver(cycleroute)}
                  onMouseOut={handlePolylineMouseOut}
                  onClick={() => handleRouteClick(cycleroute._id)}
                />
              </React.Fragment>
            ))}

            {selectedRoute && (
              <DetailCardRoutes
                route={selectedRoute}
                onClose={() => setSelectedRoute(null)}
              />
            )}
          </GoogleMap>
        )}
      </Box>

      <div>
        {cycleRoutes.map(cycleroute => (
          <div key={cycleroute._id}>
            <Link to={`/cycleroutes/${cycleroute._id}`}></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CycleRoutes;
