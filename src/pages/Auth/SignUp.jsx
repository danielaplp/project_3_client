import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      height="100vh"
      bg="green.600">
      <Box
        w={{ base: "90%", md: "50%", lg: "30%" }}
        p={8}
        borderWidth={1}
        boxShadow="xl"
        bg="white">
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl
              id="name"
              isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </FormControl>

            <FormControl
              id="email"
              isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl
              id="password"
              isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </FormControl>

            <Button
              borderRadius="2px"
              type="submit"
              colorScheme="green"
              width="full">
              Sign up
            </Button>
            <Button
              variant="link"
              colorScheme="green"
              color="red.400"
              onClick={() => navigate("/login")}>
              Already have an account?
            </Button>
          </Stack>
        </form>

        {errorMessage && (
          <Alert
            status="error"
            mt={4}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Flex>
  );
}

export default SignUp;
