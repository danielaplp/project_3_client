/* import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleName = event => setName(event.target.value);
  const handleEmail = event => setEmail(event.target.value);
  const handlePassword = event => setPassword(event.target.value);

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
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="SignupPage">

<Flex justify="center">
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
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={e => setName(e.target.value)}>
                  {" "}
                </Input>
                <FormLabel>Email</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}>
                  {" "}
                </Input>

                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}>
                  {" "}
                </Input>
              </FormControl>
       {/*  <label htmlFor="username">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={handleName}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleEmail}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handlePassword}
        /> */
 /* <Button
                type="submit"
                colorScheme="green"
                mt={4}>
                Sign up
              </Button>
              <Button
                colorScheme="green"
                onClick={() => navigate("/login")}>
                Already have an account?
              </Button>
              </Stack>
      </form>
      </Box>
      </Flex>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

     
    </div>
  );
}

export default SignUp;
 */

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

  const handleSubmit = async (event) => {
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
    <Flex justify="center" align="center" height="100vh" bg="gray.50">
      <Box
        w={{ base: "90%", md: "50%", lg: "30%" }}
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button type="submit" colorScheme="green" width="full">
              Sign up
            </Button>
            <Button
              variant="link"
              colorScheme="green"
              onClick={() => navigate("/login")}
            >
              Already have an account?
            </Button>
          </Stack>
        </form>

        {errorMessage && (
          <Alert status="error" mt={4}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
      </Box>
    </Flex>
  );
}

export default SignUp;