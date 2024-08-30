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

import DetailCardParkings from "../components/DetailCardParkings";

import CycleAPIService from "../services/cycle.api";

const cycleService = new CycleAPIService();

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

function Parkings() {
  const [parkings, setParkings] = useState([]);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [location, setLocation] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);

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
    /* const bounds = new window.google.maps.LatLngBounds(center);
  map.fitBounds(bounds); */
    setMap(map);
  }, []);

  const fetchData = async () => {
    try {
      const response = await cycleService.getAllParkings();
      setParkings(response.data);
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

  const handleParkingClick = parkingId => {
    navigate(`/parking/${parkingId}`);
  };
  const handleMarkerMouseOver = parking => {
    setSelectedParking(parking);
  };

  const handleMarkerMouseOut = () => {
    setSelectedParking(null);
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
            Parkings
          </Heading>
          <Link to={"/parking/new"}>
            <Button py={5}
            bg="green.100"
            mt={2}
            borderRadius="2px"
            mr={4}
            fontSize="20px">+</Button>
          </Link>
        </Stack>
        <Flex
            justify="flex-start"
            p={4}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={zoom}
            onLoad={onLoad}
            center={center}>
            {parkings.map(parking => (
              <Marker
                key={parking._id}
                position={parking.location}
                label="P"
                onClick={() => handleParkingClick(parking._id)} // Navega ao clicar
                onMouseOver={() => handleMarkerMouseOver(parking)}
                onMouseOut={handleMarkerMouseOut}
              />
            ))}

            {selectedParking && (
              <DetailCardParkings
                parking={selectedParking}
                onClose={() => setSelectedParking(null)}
              />
            )}
          </GoogleMap>
        )}
        </Flex>
      </Box>
      {/* Lista de Links para cada estacionamento (opcional) */}
      <div>
        {parkings.map(parking => (
          <div key={parking._id}>
            <Link to={`/parking/${parking._id}`}>
              {/* <h2>Type: {parking.type}</h2> */}
            </Link>
            {/* <h3>Quantity: {parking.quantity || 'No quantity'}</h3> */}
            {/* <img src={parking.parkingPic} alt="Parking" style={{ width: "100px", height: "auto" }} /> */}
            {user._id === parking.creator && (
              <>{/* Botões para editar ou excluir, se necessário */}</>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Parkings;
