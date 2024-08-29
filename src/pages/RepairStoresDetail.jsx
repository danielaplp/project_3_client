import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import CycleAPIService from "../services/cycle.api";
import { AuthContext } from "../contexts/auth.context";
import {
  GoogleMap,
  useJsApiLoader,
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
  Heading,
} from "@chakra-ui/react";

const cycleService = new CycleAPIService();
const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

const RepairStoreDetail = () => {
  const [repairStore, setRepairStore] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [loadedRepairStore, setLoadedRepairStore] = useState(false);

  const { repairstoreId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getSingleRepairStore = async _id => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/repairstore/${_id}`,
      );
      setRepairStore(response.data);
      setLoadedRepairStore(true);
    } catch (error) {
      setLoadedRepairStore(false);
      console.log("Error fetching the repair store", error);
    }
  };

  const deleteHandler = async _id => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/repairstore/${_id}`,
      );
      console.log(`Repair Store with ID ${_id} deleted`);
      navigate("/repairstore");
    } catch (error) {
      console.log("Error deleting repair store", error);
    }
  };

  const EditHandler = async _id => {
    navigate(`/repairstore/edit/${_id}`);
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${import.meta.env.VITE_GMAPS_API_KEY}`,
  });

  useEffect(() => {
    getSingleRepairStore(repairstoreId);
    setTimeout(() => {
      setZoom(14);
    }, 500);
  }, [repairstoreId]);

  return (
    <div>
      <Box>
        <Center bg="green.600" color="white" py={3} mb={2}>
          <Heading as="h1" size="xl">Repair Store Details</Heading>
        </Center>
        {!repairStore && <h3>No Repair Store found</h3>}

        {repairStore && (
          <Flex justify="flex-start" p={4}>
            <Box w={{ base: "100%", md: "70%", lg: "50%" }} p={4} borderWidth={2} borderRadius="md" boxShadow="md">
              <form>
                <Stack spacing={4}>
                  <FormControl id="type" isReadOnly>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" value={repairStore.name || "No Name"} />
                  </FormControl>
                  <FormControl id="location" isReadOnly>
                    <FormLabel>Location</FormLabel>
                    <Input
                      type="text"
                      value={`Lat: ${repairStore.location?.lat || "No Lat"}, Lng: ${repairStore.location?.lng || "No Lng"}`}
                    />
                  </FormControl>
                  {user._id === repairStore.creator && (
                    <Flex mt={4}>
                      <Button colorScheme="red" onClick={() => deleteHandler(repairStore._id)} mr={2}>
                        Delete
                      </Button>
                      <Button colorScheme="green" onClick={() => EditHandler(repairStore._id)} mr={2}>
                        Edit
                      </Button>
                      <Button colorScheme="gray" onClick={() => navigate("/repairstore")}>
                        Back to Repair Stores
                      </Button>
                    </Flex>
                  )}
                </Stack>
              </form>
            </Box>
          </Flex>
        )}
        {isLoaded && repairStore && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={zoom}
            center={repairStore.location}>
            <Marker
              position={repairStore.location}
              label="R"
            />
          </GoogleMap>
        )}
      </Box>
    </div>
  );
};

export default RepairStoreDetail;


