import React, { useRef } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  VStack,

} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import { HamburgerIcon } from "@chakra-ui/icons";
function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { user, loading, logout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-start">
      
      <Button
        ref={btnRef}
        colorScheme="green"
        onClick={onOpen}
         variant="ghost"
         className="mr-4"
         leftIcon={<HamburgerIcon boxSize={8} />
        
        }
        >
        
      </Button>
      
      <Drawer
        isOpen={isOpen}
        placement="left" // Coloque o Drawer à esquerda se preferir
        onClose={onClose}
        finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent
          bg="green.600"
          color="white">
          <DrawerCloseButton />
          <DrawerHeader>
            <p className="text-2xl font-bold mb-6">
              {user ? `Hello, ${user.name}` : "Hello"}
            </p>
          </DrawerHeader>

          <DrawerBody>
            <VStack
              align="start"
              spacing={4}>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    onClick={onClose}>
                    <Button
                      w="full"
                      textAlign="left"
                      bg="white"
                      color="green.600"
                      variant="solid">
                      Home
                    </Button>
                  </Link>
                </li>
                {!loading && user && (
                  <>
                    <li>
                      <Link
                        to="/cycleroutes"
                        onClick={onClose}>
                        <Button
                          w="full"
                          textAlign="left"
                          bg="white"
                          color="green.600"
                          variant="solid">
                          Cycle Routes
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/cycleroutes/new"
                        onClick={onClose}>
                        <Button
                          w="full"
                          textAlign="left"
                          bg="white"
                          color="green.600"
                          variant="solid">
                          Add a Cycle Route
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/parking"
                        onClick={onClose}>
                        <Button
                          w="full"
                          textAlign="left"
                          bg="white"
                          color="green.600"
                          variant="solid">
                          Parkings
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/parking/new"
                        onClick={onClose}>
                        <Button
                          w="full"
                          textAlign="left"
                          bg="white"
                          color="green.600"
                          variant="solid">
                          Add a Parking
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/repairstore"
                        onClick={onClose}>
                        <Button
                          w="full"
                          textAlign="left"
                          bg="white"
                          color="green.600"
                          variant="solid">
                          Repair Stores
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/repairstore/new"
                        onClick={onClose}>
                        <Button
                          w="full"
                          textAlign="left"
                          bg="white"
                          color="green.600"
                          variant="solid">
                          Add a Repair Store
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Button
                        onClick={() => {
                          logout();
                          onClose();
                        }}
                        w="full"
                        textAlign="left"
                        bg="white"
                        color="green.600"
                        variant="solid">
                        Logout
                      </Button>
                    </li>
                  </>
                )}
                {!loading && !user && (
                  <>
                    <li>
                      <Link
                        to="/signup"
                        onClick={onClose}>
                        <Button
                          w="full"
                          textAlign="left"
                          bg="white"
                          color="green.600"
                          variant="solid">
                          Signup
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        onClick={onClose}>
                        <Button
                          w="full"
                          textAlign="left"
                          bg="white"
                          color="green.600"
                          variant="solid">
                          Login
                        </Button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
       
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}

export default Sidebar;
