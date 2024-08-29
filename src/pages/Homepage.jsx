import React from "react";
import { Link } from "react-router-dom"; 
import logo4 from "../assets/Let’sbike, Lisbon com laranja e branco.svg";
import { Button, HStack, VStack } from "@chakra-ui/react"; 
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";

function Homepage() {
  const { user, loading } = useContext(AuthContext); 

  return (
    <div className="bg-[#25855A] w-full h-screen flex flex-col items-center justify-center">
     
      <VStack spacing={6} className="text-center"> 
   
        <div className="mb-2 mt-16"> 
          <p className="text-white text-3xl mb-2 justify-center">Welcome to</p> 
          <img src={logo4} alt="logo" className="mx-auto mb-4 w-100 h-auto"/> 
        </div>

      
        {!loading && !user && ( 
          <HStack spacing={6} mt={-28}> 
            <Link to="/signup">
              <Button bg="white" color="green.600" variant="solid">
                Signup
              </Button>
            </Link>
            <Link to="/login">
              <Button bg="white" color="green.600" variant="solid">
                Login
              </Button>
            </Link>
          </HStack>
        )}
      </VStack>
    </div>
  );
}

export default Homepage;