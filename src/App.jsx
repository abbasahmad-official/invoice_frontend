import React,{ useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
// import Home from './AdminHome';
import AdminHome from './AdminHome';
import UserHome from './UserHome';
import Login from './Login';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import ClientInvoiceView from './clientInvoiceView';
import InvoiceView from './ui/InvoiceView';
import SuperAdminHome from './SuperAdminHome';
import SuperAdminRoute from './auth/SuperAdminRoute'
import Suspended from './Suspended';


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={ <AdminRoute> <AdminHome/> </AdminRoute>}/>
      <Route path='/user' element={ <PrivateRoute> <UserHome/> </PrivateRoute>}/>
      <Route path='/admin' element={ <SuperAdminRoute> <SuperAdminHome/>  </SuperAdminRoute>}/>
      <Route path='/pay/invoice/:invoiceId' element={<ClientInvoiceView/>} />
      <Route path='/suspended' element={<Suspended/>} />
      <Route path='/login' element={<Login/>}/>
     
       <Route path="*" element={<Navigate to="/" replace />} />
      </Routes> 
    </BrowserRouter>
  )
}

export default App
