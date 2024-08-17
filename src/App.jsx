import { useState } from 'react'
import Homepage from './pages/Homepage';
import Parkings from './pages/Parkings';
import CycleRoutes from './pages/CycleRoutes';
import AddCycleRoute from './pages/AddCycleRoute';
import EditCycleRoute from './pages/EditCycleRoutes';
import AddParking from './pages/AddParking';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import Anon from './components/Anon';
import Navbar from './components/Navbar';
import './App.css'
import { Routes, Route } from "react-router-dom"

function App() {

  return (
      <div className='App'>
        <Navbar />
        <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/cycleroutes' element={<CycleRoutes/>}/>
        <Route path='/cycleroutes/new' element={<AddCycleRoute/>}/>
        <Route path='/cycleroutes/edit/:cycleRoutetId' element={<EditCycleRoute/>}/>
        
        <Route path='/parking' element={<Parkings/>}/>
        <Route path='/parking/new' element={<AddParking/>}/>
        <Route path='/signup' element={
          <Anon>
          <SignUp/>
          </Anon>}/>
        <Route path='/login' element={
          <Anon>
          <Login/>
          </Anon>}/>

        </Routes>
       
    </div>
  )
}

export default App
