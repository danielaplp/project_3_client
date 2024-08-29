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
  width: "112%",
  height: "100vh",
};

function EditRepairStore() {
  const { repairStoreId } = useParams();
  console.log(repairStoreId);

  const [repairStore, setRepairStore] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState(null);


  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  //
  const getSingleRepairStore = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/repairstore/${_id}`,
      );
      setRepairStore(response.data);
      setName(response.data.name);
      setLocation(response.data.location);
      

      console.log(response.data);
    } catch (error) {
      console.log("error fetching the repair store", error);
    }
  };
  
  useEffect(() => {
    getSingleRepairStore(repairStoreId);
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, [repairStoreId]);

  const handleName = event => {
    setName(event.target.value);
  };

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    console.log({ lat, lng });
    setLocation({ lat, lng });
  };

 
  

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const repairStore = {
        name,
        location,
        
        userId: user._id,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/repairstore/${repairStoreId}`,
        repairStore,
      );

      navigate("/repairstore");
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost
    } catch (error) {
      console.log("error creating the repair store", error);
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/repairstore/${_id}`);
      set(repairStore.filter(b => b._id !== _id));
      console.log(`Parking com ID ${_id} excluída `);
    } catch (error) {
      console.log("Erro ao excluir a parking:", error);
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
          Edit Repair Store
        </Heading>
      </Center>

      <Flex justify="flex-start">
        <Box
          w={{ base: "60%", md: "50%", lg: "30%" }}
          p={4}
          borderWidth={2}
          borderRadius="md"
          boxShadow="md">

      <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
              <FormControl
                id="type"
                isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="red"
                mt={4}>
                Edit Repair Store
              </Button>
              <Button
                colorScheme="gray"
                onClick={() => navigate("/repairstore")}>
                Back to Repair Stores
              </Button>
              </Stack>
     
      </form>
      </Box>
      </Flex>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={zoom}
          onLoad={onLoad}
          onClick={handleMapClick}>
          <Marker
            position={location}
            label="P"
          />

          <Polyline options={{ strokeColor: "#FF0000", strokeWeight: 2 }} />
        </GoogleMap>
      )}
    </div>
  );
}

export default EditRepairStore;
