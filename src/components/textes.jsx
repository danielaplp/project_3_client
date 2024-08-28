import {useRef} from 'react'
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
  Link,
  VStack,
  Image
} from '@chakra-ui/react'
import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import logo from "../assets/Let’sbike, Lisbon com laranja e branco.svg"



function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const { user, loading, logout } = useContext(AuthContext);

  return (
    <nav>
      <Button ref={btnRef} colorScheme='red' onClick={onOpen}>
     Menu
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
          <p className="text-2xl font-bold mb-6 text-green-700" >
          {user ? `Hello, ${user.name}` : "Hello"}
        </p>
          </DrawerHeader>

          <DrawerBody>
          
          <VStack align="start" spacing={4}>
          return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`w-64 bg-green-600 text-white p-6 ${isOpen ? "block" : "hidden"} md:block`}>
        {/* Título ou Saudação */}
        

        {/* Lista de Links da Sidebar */}
        <ul className="space-y-4">
          <li>
            <Link to="/">
              <button className="w-full text-left hover:bg-green-500 p-2 rounded">
                Home
              </button>
            </Link>
          </li>

          {!loading && user && (
            <>
              <li>
                <Link to="/cycleroutes">
                  <button className="w-full text-left hover:bg-green-500 p-2 rounded">
                    Cycle Routes
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/cycleroutes/new">
                  <button className="w-full text-left hover:bg-green-500 p-2 rounded">
                    Add a Cycle Route
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/parking">
                  <button className="w-full text-left hover:bg-green-500 p-2 rounded">
                    Parkings
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/parking/new">
                  <button className="w-full text-left hover:bg-green-500 p-2 rounded">
                    Add a Parking
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/repairstore">
                  <button className="w-full text-left hover:bg-green-500 p-2 rounded">
                    Repair Stores
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/repairstore/new">
                  <button className="w-full text-left hover:bg-green-500 p-2 rounded">
                    Add a Repair Store
                  </button>
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="w-full text-left hover:bg-green-500 p-2 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {!loading && !user && (
            <>
              <li>
                <Link to="/signup">
                  <button className="w-full text-left hover:bg-green-600 p-2 rounded">
                    Signup
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <button className="w-full text-left hover:bg-green-600 p-2 rounded">
                    Login
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Conteúdo principal */}
     
    </div>
  );
                </VStack>
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </nav>
  )
}

export default Sidebar 
