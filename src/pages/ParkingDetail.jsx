import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/auth.context";
import {
  GoogleMap,
  useJsApiLoader,
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
  Heading,
} from "@chakra-ui/react";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

const ParkingDetail = () => {
  const [parking, setParking] = useState(null);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [loadedParking, setLoadedParking] = useState(false);

  const { parkingId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getSingleParking = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/parking/${_id}`,
      );
      setParking(response.data);
      setLoadedParking(true);
    } catch (error) {
      setLoadedParking(false);
      console.log("error fetching the parking", error);
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/parking/${_id}`);
      console.log(`Parking with ID ${_id} deleted`);
      navigate("/parking");
    } catch (error) {
      console.log("Error deleting parking:", error);
    }
  };

  const EditHandler = async _id => {
    navigate(`/parking/edit/${_id}`);
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
    if (!parking) return;
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, [parking]);

  useEffect(() => {
    getSingleParking(parkingId);
    setTimeout(() => {
      setZoom(14);
    }, 1000);

    return () => {
      setParking(null);
      setLoadedParking(false);
    };
  }, [parkingId]);

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
            Parking Details
          </Heading>
        </Center>

        {!parking && <h3>No parking found</h3>}

        {parking && (
          <Flex
            justify="flex-start"
            p={4}
            direction={{ base: "column", md: "row" }}
            align="flex-start"
            gap={6}
          >
            {/* Formulário */}
            <Box
              w={{ base: "100%", md: "50%" }}
              p={4}
              borderWidth={2}
              borderRadius="md"
              boxShadow="md"
            >
              <form>
                <Stack spacing={4}>
                  <FormControl
                    id="type"
                    isReadOnly>
                    <FormLabel>Type</FormLabel>
                    <Input
                      type="text"
                      value={parking.type || "No Type"}
                    />
                  </FormControl>

                  <FormControl
                    id="location"
                    isReadOnly>
                    <FormLabel>Location</FormLabel>
                    <Input
                      type="text"
                      value={`Lat: ${parking.location?.lat || "No Lat"}, Lng: ${
                        parking.location?.lng || "No Lng"
                      }`}
                    />
                  </FormControl>

                  <FormControl
                    id="quantity"
                    isReadOnly>
                    <FormLabel>Quantity</FormLabel>
                    <Input
                      type="text"
                      value={parking.quantity || "No Quantity"}
                    />
                  </FormControl>

                  <FormControl
                    id="parkingPic"
                    isReadOnly>
                    <FormLabel>Parking Picture</FormLabel>
                    <Input
                      type="text"
                      value={parking.parkingPic || "No Picture"}
                    />
                  </FormControl>

                  {user._id === parking.creator && (
                    <Flex mt={4}>
                      <Button
                        colorScheme="red"
                        onClick={() => deleteHandler(parking._id)}
                        mr={2}>
                        Delete
                      </Button>
                      <Button
                        colorScheme="green"
                        onClick={() => EditHandler(parking._id)}
                        mr={2}>
                        Edit
                      </Button>
                      <Button
                        colorScheme="gray"
                        onClick={() => navigate("/parking")}>
                        Back
                      </Button>
                    </Flex>
                  )}
                </Stack>
              </form>
            </Box>

            {/* Mapa */}
            {isLoaded && parking && (
              <Box
                w={{ base: "100%", md: "50%" }}
                h="calc(100vh - 80px)"
                borderWidth={2}
                borderRadius="md"
                boxShadow="md"
              >
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  zoom={zoom}
                  center={parking.location}
                  onLoad={onLoad}
                >
                  <Marker
                    position={parking.location}
                    label="P"
                  />
                  <Polyline
                    path={[parking.location]}
                    options={{ strokeColor: "#FF0000", strokeWeight: 2 }}
                  />
                </GoogleMap>
              </Box>
            )}
          </Flex>
        )}
      </Box>
    </div>
  );
};

export default ParkingDetail;