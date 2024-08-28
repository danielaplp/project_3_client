import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProviderWrapper } from './contexts/auth.context.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
    <ChakraProvider>
    <AuthProviderWrapper>
    <App />
    </AuthProviderWrapper>
    </ChakraProvider>
    </Router>
  </React.StrictMode>
);
