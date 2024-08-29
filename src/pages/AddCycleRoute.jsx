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
  const [street, setStreet] = useState("")
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
    console.log(event)

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
    }, 500);
  }, []);

  return (
    <div>
   <Box>
    
    <Center bg="green.600" color="white" py={3} mb={2}>
      <Heading as="h1" size="xl">Add New Cycle Route</Heading>
    </Center>
       <Flex justify="flex-start">
        <Box w={{ base: "60%", md: "50%", lg: "30%" }} p={4} borderWidth={2} borderRadius="md" boxShadow="md">
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="type" isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  type="text"
                  placeholder="Enter route type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Path"> Path</option>
          <option value="Lane"> Lane</option>
          <option value="Zone30"> Zone30</option>

                    </Select>
              
              </FormControl>

            

              <Button type="submit" colorScheme="red" mt={4}>Add Cycle Route</Button>
              <Button colorScheme="green" onClick={() => navigate("/cycleroutes")}>
          Back to Cycle Routes
        </Button>
            </Stack>
          </form>
        </Box>
      </Flex>
     {/*  <div className="bg-green-600 text-white py-4 px-6">
        <h1 className="text-3xl font-bold">Add Cycle Route</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Type</label>
        <select name="type" id="type" onChange={handleType} value={type}>
          <option value="Path"> Path</option>
          <option value="Lane"> Lane</option>
          <option value="Zone30"> Zone30</option>
        </select>
       
       
        <button type="submit">Add Cycle Route</button>
      </form> */}

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={zoom}
          onLoad={onLoad}
          onClick={handleMapClick}
          center={center}>
          {startLocation && (
            <Marker
              position={startLocation}
              label="S"
              draggable={true}
              onDragEnd={event => handleMarkerDragEnd(event, setStartLocation)}
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
      </Box>
    </div>
    
  );
}

export default AddCycleRoute;
 

 {/* import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/auth.context";
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

const AddCycleRoute = () => {
  const [type, setType] = useState("");
  const [startLocation, setStartLocation] = useState({ lat: "", lng: "" });
  const [endLocation, setEndLocation] = useState({ lat: "", lng: "" });
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCycleRoute = {
        type,
        startLocation,
        endLocation,
        creator: user._id,
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cycleroutes`, newCycleRoute);
      toast({
        title: "Cycle Route added.",
        description: "Your new cycle route has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/cycleroutes");
    } catch (error) {
      console.error("Error adding cycle route:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to add cycle route. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
    
      <Center bg="green.600" color="white" py={3} mb={2}>
        <Heading as="h1" size="xl">Add New Cycle Route</Heading>
      </Center>

    
      <Flex justify="flex-start">
        <Box w={{ base: "60%", md: "50%", lg: "30%" }} p={4} borderWidth={2} borderRadius="md" boxShadow="md">
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="type" isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  type="text"
                  placeholder="Enter route type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Path"> Path</option>
          <option value="Lane"> Lane</option>
          <option value="Zone30"> Zone30</option>

                    </Select>
              
              </FormControl>

            

              <Button type="submit" colorScheme="red" mt={4}>Add Cycle Route</Button>
            </Stack>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default AddCycleRoute;  */}

