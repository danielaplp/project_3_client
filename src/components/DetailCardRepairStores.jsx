import React from "react";
import { Box, Text, Heading, Stack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
   
   Image,
  
  } from "@chakra-ui/react";

const DetailCardRepairStores = ({ repairstore, onClose }) => {
  return (
    <Box
      position="absolute"
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="md"
      p={4}
      zIndex="1"
      left="10px" // Ajuste conforme necessário
      top="10px"  // Ajuste conforme necessário
      w="250px"
    >
        <Stack mt='6' spacing='3'>
    <Heading size="md" mb={2} color={"red.400"}>{repairstore.name}</Heading>
    <Text mb={2}color={"green.600"}>
        Location: {repairstore.location.lat}, {repairstore.location.lng}
      </Text>
      
      
    </Stack>
      {/* <Heading size="md" mb={2}>{parking.type}</Heading>
      <Text mb={2}>
        Location: {parking.location.lat}, {parking.location.lng}
      </Text>
      <Text mb={2}>Quantity: {parking.quantity}</Text>
      <Text mb={2}>Picture:</Text>
      <img src={parking.parkingPic} alt="Parking" style={{ width: "100px", height: "auto" }} />
      <Stack spacing={3} direction="row" mt={2}>
        
      </Stack> */}
    </Box>
  );
};

export default DetailCardRepairStores; 