import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
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

import CycleAPIService from "../services/cycle.api";

const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

function EditCycleRoute() {
  const { cycleRouteId } = useParams();
  console.log(cycleRouteId);

  const [cycleroute, setCycleRoute] = useState(null);
  const [type, setType] = useState("");
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [newStartLocation, setNewStartLocation] = useState(null);
  const [newEndLocation, setNewEndLocation] = useState(null);

  const [dragging, setDragging] = useState(null);

  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  //
  const getSingleCycleRoute = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`,
      );
      setCycleRoute(response.data);
      setType(response.data.type);
      setStartLocation(response.data.startLocation);

      setEndLocation(response.data.endLocation);

      console.log(response.data);
    } catch (error) {
      console.log("error fetching the cycleroute", error);
    }
  };

  useEffect(() => {
    getSingleCycleRoute(cycleRouteId);
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, [cycleRouteId]);

  const handleType = event => {
    setType(event.target.value);
  };

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    setStartLocation({ lat, lng });
    setEndLocation(null);
  };

  const handleMarkerDragStart = marker => {
    setDragging(marker);
  };
  const handleMarkerDragEnd = event => {
    const newLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };

    if (dragging === "start") {
      setStartLocation(newLocation);
      setNewStartLocation(newLocation);
    } else if (dragging === "end") {
      setEndLocation(newLocation);
      setNewEndLocation(newLocation);
    }

    setDragging(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (
      !startLocation ||
      !startLocation.lat ||
      !startLocation.lng ||
      !endLocation ||
      !endLocation.lat ||
      !endLocation.lng
    ) {
      //
      alert("Please select both start and end locations.");
      return;
    }

    try {
      const cycleRoute = {
        type,
        startLocation: {
          lat: startLocation.lat,
          lng: startLocation.lng,
        },
        endLocation: {
          lat: endLocation.lat,
          lng: endLocation.lng,
        },
        userId: user._id,
      };
      /* const cycleRoute = {
        type,
        startLocation: {
          lat: startLocationLat,
          lng: startLocationLng,
        },
        endLocation: {
          lat: endLocationLat,
          lng: endLocationLng,
        },
        userId: user._id,
      }; */

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${cycleRouteId}`,
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
      console.log(`Cycle Route com ID ${_id} excluída`);
    } catch (error) {
      console.log("Erro ao excluir a cycleroute:", error);
    }
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
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  return (
    <div>
      <Center
        bg="green.600"
        color="white"
        py={3}
        mb={2}>
        <Heading
          as="h1"
          size="xl">
          Edit Cycle Route
        </Heading>
      </Center>

      <Flex
        justify="flex-start"
        p={4}>
        <Box
          bg="green.100"
          w={{ base: "100%", md: "70%", lg: "50%" }}
          p={4}
          borderWidth={1}
          boxShadow="xl">
          <form onSubmit={handleSubmit}>
            <Stack spacing={4} >
              <FormControl
                id="type"
                isRequired
               >
                <FormLabel>Type</FormLabel>
                <Select
                 bg="white" 
                 p={8} 
                 borderRadius="2px"
                  type="text"
               
                  value={type}
                  onChange={e => setType(e.target.value)}
                  >
                  <option value="Path"> Path</option>
                  <option value="Lane"> Lane</option>
                  <option value="Zone30"> Zone30</option>
                </Select>
              </FormControl>
              <Flex
                mt={4}
                justifyContent={"center"}>
                <Button
                  type="submit"
                  colorScheme="green"
                  mt={2}
                  borderRadius="2px"
                  mr={4}>
                  Edit
                </Button>

                <Button
                  colorScheme="gray"
                  onClick={() => navigate("/cycleroutes")}
                  mt={2}
                  mr={4}
                  borderRadius="2px">
                  Back
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={zoom}
            onLoad={onLoad}
            onClick={handleMapClick}
            center={center}>
            {startLocation && (
              <Marker
                position={cycleroute.startLocation}
                label="S"
                draggable={true}
                onDragStart={() => handleMarkerDragStart("start")}
                onDragEnd={event =>
                  handleMarkerDragEnd(event, setStartLocation)
                }
              />
            )}
            {endLocation && (
              <Marker
                position={cycleroute.endLocation}
                label="E"
                draggable={true}
                onDragStart={() => handleMarkerDragStart("end")}
                onDragEnd={event => handleMarkerDragEnd(event, setEndLocation)}
              />
            )}
            {startLocation && endLocation && (
              <Polyline
                path={[startLocation, endLocation]}
                options={{ strokeColor: "#FF7F50", strokeWeight: 5 }}
              />
            )}
            {newStartLocation && newEndLocation && (
              <Polyline
                path={[newStartLocation, newEndLocation]}
                options={{ strokeColor: "#2ecc71", strokeWeight: 5 }}
              />
            )}
          </GoogleMap>
        )}
      </Flex>
    </div>
  );
}

export default EditCycleRoute;
