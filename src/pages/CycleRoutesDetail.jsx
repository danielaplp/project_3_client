

import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CycleAPIService from "../services/cycle.api";
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
  Textarea,
  Heading,
  useToast,
  Select,
  Image,
} from "@chakra-ui/react";

const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",

};

const CycleRoutesDetail = () => {
  const [cycleRoute, setCycleRoute] = useState(null);
  const [loadedRoute, setLoadedRoute] = useState(false);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);

  const { cycleRouteId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(cycleRouteId);

  const getSingleCycleRoute = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`,
      );
      setCycleRoute(response.data);
      setLoadedRoute(true);
    } catch (error) {
      setLoadedRoute(false);
      console.log("error fetching the cycleRoute", error);
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cycleroutes/${_id}`,
      );
      console.log(`Cycle Route with ID ${_id} deleted`);
    } catch (error) {
      console.log("Error of deleting cycleroute:", error);
    }
    navigate("/cycleroutes");
  };

  const EditHandler = async _id => {
    navigate(`/cycleroutes/edit/${_id}`);
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${import.meta.env.VITE_GMAPS_API_KEY}`,
  });

  const center = {
    lat: 38.722357386512876,
    lng: -9.146005938990468,
  };

  const onLoad = React.useCallback(
    function callback(map) {
      if (!cycleRoute) return;
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
    },
    [cycleRoute],
  );

  useEffect(() => {
    getSingleCycleRoute(cycleRouteId);
    setTimeout(() => {
      setZoom(14);
    }, 1500);

    return () => {
      setCycleRoute(null);
      setLoadedRoute(false);
    };
  }, [cycleRouteId]);

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
            Cycle Route Details
          </Heading>
        </Center>

        {!cycleRoute && <h3>No cycle route found</h3>}

        {cycleRoute && (
          <Flex
            justify="flex-start"
            p={4}>
            <Box
              w={{ base: "100%", md: "70%", lg: "50%" }}
              p={4}
              borderWidth={2}
              borderRadius="md"
              boxShadow="md">
              <form>
                <Stack spacing={4}>
                  <FormControl
                    id="type"
                    isReadOnly>
                    <FormLabel>Type</FormLabel>
                    <Input
                      type="text"
                      value={
                        cycleRoute.type}
                    />
                  </FormControl>
                  <FormControl
                    id="startLocation"
                    isReadOnly>
                    <FormLabel>Start Location</FormLabel>
                    <Input
                      type="text"
                      value={`Lat: ${
                        cycleRoute.startLocation?.lat || "No Lat"
                      }, Lng: ${cycleRoute.startLocation?.lng || "No Lng"}`}
                    />
                  </FormControl>

                  <FormControl
                    id="endLocation"
                    isReadOnly>
                    <FormLabel>End Location</FormLabel>
                    <Input
                      type="text"
                      value={`Lat: ${
                        cycleRoute.endLocation?.lat || "No Lat"
                      }, Lng: ${cycleRoute.endLocation?.lng || "No Lng"}`}
                    />
                  </FormControl>

                  {user._id === cycleRoute.creator && (
                    <Flex mt={4}>
                      <Button
                        colorScheme="red"
                        onClick={() => deleteHandler(cycleRoute._id)}
                        mr={2}>
                        Delete
                      </Button>
                      <Button
                        colorScheme="green"
                        onClick={() => EditHandler(cycleRoute._id)}
                        mr={2}>
                        Edit
                      </Button>
                      <Button
                        colorScheme="gray"
                        onClick={() => navigate("/cycleroutes")}>
                        Back 
                      </Button>
                    </Flex>
                  )}
                </Stack>
              </form>
            </Box>
            
            {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={zoom}
            center={center}
            onLoad={onLoad}>

            {cycleRoute.startLocation && (
              <>
                <Marker
                  position={cycleRoute.startLocation}
                  label="S"
                />
                <Marker
                  position={cycleRoute.endLocation}
                  label="E"
                />
                <Polyline
                  path={[cycleRoute.startLocation, cycleRoute.endLocation]}
                  options={{ strokeColor: "#FF0000", strokeWeight: 2 }}
                />
              </>
            )}
          </GoogleMap>
        )}
          </Flex>
        )}
      </Box>
    </div>
  );
};

export default CycleRoutesDetail;
