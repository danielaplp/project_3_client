import React from "react";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CycleAPIService from "../services/cycle.api";
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

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

function AddCycleRoute() {
  const [cycleRoutes, setCycleRoutes] = useState([]);
  const [type, setType] = useState("");
  const [startLocationLat, setStartLocationLat] = useState(0);
  const [startLocationLng, setStartLocationLng] = useState(0);
  const [endLocationLat, setEndLocationLat] = useState(0);
  const [endLocationLng, setEndLocationLng] = useState(0);
  const [map, setMap] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [street, setStreet] = useState("");
  const [zoom, setZoom] = useState(10);
  const [polylineCreated, setPolylineCreated] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleType = event => {
    setType(event.target.value);
  };
  const handleStreet = event => {
    setStreet(event.target.value);
  };

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    console.log(event);

    if (!startLocation) {
      setStartLocation({ lat, lng });
    } else if (!endLocation) {
      setEndLocation({ lat, lng });
    } else {
      setStartLocation({ lat, lng });
      setEndLocation(null);
    }
  };

  const handleMarkerDragEnd = (event, setLocation) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
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
        street,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes`,
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
    console.log("useEffect: Mounting");
    setTimeout(() => {
      setZoom(14);
    }, 1500);
  }, []);

  return (
    <div>
      <Box>
        <Center
          bg="green.600"
          color="white"
          py={3}
          mb={2}>
          <Heading
            as="h1"
            size="xl">
            Add New Cycle Route
          </Heading>
        </Center>
  
        <Flex justify="flex-start" p={4}>
          <Box
            bg="green.100"
            w={{ base: "100%", md: "70%", lg: "50%" }}
            p={4}
            borderWidth={1}
            boxShadow="xl">
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="type" isRequired>
                  <FormLabel>Type</FormLabel>
                  <Select
                    bg="white"
                    p={8}
                    borderRadius="2px"
                    placeholder="Enter route type"
                    value={type}
                    onChange={e => setType(e.target.value)}>
                    <option value="Path">Path</option>
                    <option value="Lane">Lane</option>
                    <option value="Zone30">Zone30</option>
                  </Select>
                </FormControl>
                
                <Flex mt={4}
                justifyContent={"center"}>
                  <Button
                    type="submit"
                    colorScheme="green"
                    mt={2}
                    borderRadius="2px"
                    mr={4}>
                    Add
                  </Button>
                  <Button
                    colorScheme="gray"
                    onClick={() => navigate("/cycleroutes")}
                    mt={2}
                    borderRadius="2px"
                    mr={4}>
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
              >
                {startLocation && (
                  <Marker
                    position={startLocation}
                    label="S"
                    draggable={true}
                    onDragEnd={event =>
                      handleMarkerDragEnd(event, setStartLocation)
                    }
                  />
                )}
                {endLocation && (
                  <Marker
                    position={endLocation}
                    label="E"
                    draggable={true}
                    onDragEnd={event => handleMarkerDragEnd(event, setEndLocation)}
                  />
                )}
                {startLocation && endLocation && (
                  <Polyline
                    path={[startLocation, endLocation]}
                    options={{ strokeColor: "#2ecc71", strokeWeight: 4 }}
                  />
                )}
              </GoogleMap>
        
          )}
        </Flex>
      </Box>
    </div>
  );
}

export default AddCycleRoute;


