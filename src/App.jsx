import { useState } from 'react'
import Homepage from './pages/Homepage';
import Parkings from './pages/Parkings';
import CycleRoutes from './pages/CycleRoutes';
import AddCycleRoute from './pages/AddCycleRoute';
import EditCycleRoute from './pages/EditCycleRoutes';
import EditParking from './pages/EditParking';
import CycleRoutesDetail from './pages/CycleRoutesDetail';
import ParkingDetail from './pages/ParkingDetail'
import AddParking from './pages/AddParking';
import RepairStores from './pages/RepairStores'
import AddRepairStore from './pages/AddRepairStores'
import RepairStoreDetail from './pages/RepairStoresDetail'
import EditRepairStore from './pages/EditRepairStores';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import Anon from './components/Anon';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar'
import './App.css'
import { Routes, Route } from "react-router-dom"


function App() {

  return (
      <>
          {/* <Navbar />   */}
        <Sidebar />   
        <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/cycleroutes' element={<CycleRoutes/>}/>
        <Route path='/cycleroutes/new' element={<AddCycleRoute/>}/>
        <Route path='/cycleroutes/edit/:cycleRouteId' element={<EditCycleRoute/>}/>
        <Route path='/cycleroutes/:cycleRouteId' element={<CycleRoutesDetail/>}/>
        <Route path='/parking' element={<Parkings/>}/>
        <Route path='/parking/new' element={<AddParking/>}/>
        <Route path='/parking/:parkingId' element={<ParkingDetail/>}/>
        <Route path='/parking/edit/:parkingId' element={<EditParking/>}/>
        <Route path='/repairstore' element={<RepairStores/>}/>
        <Route path='/repairstore/new' element={<AddRepairStore/>}/>
        <Route path='/repairstore/:repairstoreId' element={<RepairStoreDetail/>}/>
        <Route path='/repairstore/edit/:repairStoreId' element={<EditRepairStore/>}/>
        <Route path='/signup' element={
          <Anon>
          <SignUp/>
          </Anon>}/>
        <Route path='/login' element={
          <Anon>
          <Login/>
          </Anon>}/>

        </Routes>
       
    </>
  )
}

export default App
