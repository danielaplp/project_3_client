/* import { useState, useContext } from "react";
import axios, { formToJSON } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth.context";

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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleEmail = event => setEmail(event.target.value);
  const handlePassword = event => setPassword(event.target.value);

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
      );

      storeToken(response.data.authToken);

      authenticateUser();

      navigate("/");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="LoginPage">
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

              <Button
                type="submit"
                colorScheme="red"
                mt={4}>
                Login
              </Button>

              <Button
                colorScheme="green"
                onClick={() => navigate("/signup")}>
                Don't have an account?
              </Button>
            </Stack>
          </form>
        </Box>
      </Flex>
      {/* <h2>Login</h2>
        <form onSubmit={handleSubmit}>

        <label htmlFor="email">Email</label>
            <input type="email" name='email' id='email' value={email} onChange={handleEmail}/>
            <label htmlFor="password">Password</label>
            <input type="password" name='password' id='password' value={password} onChange={handlePassword}/>
    
           <button type="submit">Login</button>

        </form> */

    /*   {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default Login;  */
import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth.context";

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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      );

      storeToken(response.data.authToken);

      authenticateUser();

      navigate("/");
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

            <Button type="submit" colorScheme="green" width="full" mt={4}>
              Login
            </Button>

            <Button
              variant="link"
              colorScheme="green"
              onClick={() => navigate("/signup")}
              width="full"
            >
              Don't have an account?
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

export default Login;
