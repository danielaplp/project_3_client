import React from "react";
import { Box, Text, Heading, Stack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const DetailCardRoutes = ({ route, onClose }) => {
  return (
    <Box
      position="absolute"
      bg="white"
      border="1px"
      borderColor="gray.500"
      borderRadius="md"
      boxShadow="md"
      p={4}
      zIndex="1"
      left="10px" // Ajuste a posição conforme necessário
      top="10px"  // Ajuste a posição conforme necessário
      w="250px"
    >
     {/*  <Heading size="md" mb={2}color={"red.400"}>{route.type}</Heading>
      <Text mb={2} color={"green.600"}>
        Start: {route.startLocation.lat}, {route.startLocation.lng}
      </Text>
      <Text mb={2}color={"green.600"}>
        End: {route.endLocation.lat}, {route.endLocation.lng}
      </Text>
      <Stack spacing={3} direction="row">
       
      </Stack> */}
        <Stack mt='6' spacing='3'>
    <Heading size="md" mb={2} color={"red.400"}>{route.type}</Heading>
    <Text mb={2}color={"green.600"}>
    Start: {route.startLocation.lat}, {route.startLocation.lng}
      </Text>
    <Text mb={2}color={"green.600"}>
    End: {route.endLocation.lat}, {route.endLocation.lng}
      </Text>
    
      
    </Stack>
    </Box>
  );
};

export default DetailCardRoutes;