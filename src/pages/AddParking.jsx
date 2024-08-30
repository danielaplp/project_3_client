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

function AddParking() {
  const [parkings, setParkings] = useState([]);
  const [type, setType] = useState("");
  const [location, setLocation] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [parkingPic, setParkingPic] = useState("");
  const [loading, setLoading] = useState(false);

  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleType = event => {
    setType(event.target.value);
  };

  const handleQuantity = event => {
    setQuantity(event.target.value);
  };

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    console.log({ lat, lng });
    setLocation({ lat, lng });
  };

  const handleFileUpload = async event => {
    //confoiguring how to send the file
    const uploadData = new FormData();

    uploadData.append("imgUrl", event.target.files[0]);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        uploadData,
      );
      setLoading(false);
      setParkingPic(response.data.fileUrl);
      console.log(response.data.fileUrl);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const handleMarkerDragEnd = (event, setLocation) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!location || !location.lat || !location.lng) {
      alert("Please select the location.");
      return;
    }
    try {
      const parking = {
        type,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        quantity,
        parkingPic,
        userId: user._id,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/parking`, parking);

      navigate("/parking");
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost
    } catch (error) {
      console.log("error creating the parking, error");
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/parking/${_id}`);
      set(parkings.filter(b => b._id !== _id));
      console.log(`Parking com ID ${_id} excluído com sucesso`);
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
        <Center
          bg="green.600"
          color="white"
          py={3}
          mb={2}>
          <Heading
            as="h1"
            size="xl">
            Add New Parking
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
              <Stack spacing={4}>
                <FormControl id="type">
                  <FormLabel>Type</FormLabel>
                  <Input
                    bg="white"
                    p={6}
                    borderRadius="2px"
                    type="text"
                    name="type"
                    value={type}
                    onChange={handleType}
                  />
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    bg="white"
                    p={6}
                    borderRadius="2px"
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={handleQuantity}></Input>

                  <FormLabel>Picture</FormLabel>
                  <Input
                    type="file"
                    name="imgUrl"
                    onChange={handleFileUpload}>
                    </Input>
                </FormControl>

                <Flex
                  mt={4}
                  justifyContent={"center"}>
                  <Button
                    colorScheme="green"
                    type="submit"
                    disabled={loading}
                    mt={2}
                    borderRadius="2px"
                    mr={4}>
                    Add
                  </Button>
                  <Button
                    colorScheme="gray"
                    onClick={() => navigate("/parking")}
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
            center={center}>

            {location && (
              <Marker
                position={location}
                label="P"
                draggable={true}
                onDragEnd={event => handleMarkerDragEnd(event, setLocation)}
              />
            )}
          </GoogleMap>
        )}
         </Flex>
      </Box>
    </div>
  );
}

export default AddParking;
