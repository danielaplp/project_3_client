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

function EditParking() {
  const { parkingId } = useParams();
  console.log(parkingId);

  const [parking, setParking] = useState(null);
  const [type, setType] = useState("");
  const [location, setLocation] = useState(null);

  const [quantity, setQuantity] = useState(0);
  const [parkingPic, setParkingPic] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  //
  const getSingleParking = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/parking/${_id}`,
      );
      setParking(response.data);
      setType(response.data.type);
      setLocation(response.data.location);
      setQuantity(response.data.quantity);
      setParkingPic(response.data.parkingPic);
      setCurrentImage(response.data.parkingPic);

      console.log(response.data);
    } catch (error) {
      console.log("error fetching the parking", error);
    }
  };
  useEffect(() => {
    getSingleParking(parkingId);
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, [parkingId]);

  const handleType = event => {
    setType(event.target.value);
  };

  const handleMapClick = event => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();

    console.log({ lat, lng });
    setLocation({ lat, lng });
  };

  const handleQuantity = event => {
    setQuantity(event.target.value);
  };
  const handleParkingPic = event => {
    setParkingPic(event.target.value);
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
      setCurrentImage(response.data.fileUrl);
      setLoading(false);
      console.log(response.data.fileUrl);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const parking = {
        type,
        location,
        quantity,
        parkingPic,
        userId: user._id,
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/parking/${parkingId}`,
        parking,
      );

      navigate("/parking");
      //`http://localhost:5005/api/cycleroutes/${_id}`
      //sem localhost
    } catch (error) {
      console.log("error creating the parking", error);
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/parking/${_id}`);
      set(parking.filter(b => b._id !== _id));
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
          Edit Parking
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
                <FormLabel>Type</FormLabel>
                <Input
                  type="text"
                  value={type}
                  onChange={e => setType(e.target.value)}
                />
              </FormControl>

              <FormControl
                id="quantity"
                isRequired>
                <FormLabel>Quantity</FormLabel>
                <Input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                />
              </FormControl>

              <FormControl id="parkingPic">
                <FormLabel>Picture</FormLabel>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                />
                {currentImage && (
                  <img
                    src={currentImage}
                    alt="Current parking pic"
                    style={{ maxWidth: "100%", marginTop: "8px" }}
                  />
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="red"
                mt={4}>
                Edit Parking
              </Button>
              <Button
                colorScheme="gray"
                onClick={() => navigate("/parking")}>
                Back to Parkings
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
          {location && (
            <Marker
              position={location}
              label="P"
            />
          )}
          {location && (
            <Polyline
              path={[location]}
              options={{ strokeColor: "#FF0000", strokeWeight: 2 }}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
}

export default EditParking;
