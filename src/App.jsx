import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
// import Home from './AdminHome';
import AdminHome from './AdminHome';
import UserHome from './UserHome';
import Login from './Login';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import clientInvoiceView from "./clientInvoiceView"

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={ <AdminRoute> <AdminHome/> </AdminRoute>}/>
      <Route path='/user' element={ <PrivateRoute> <UserHome/> </PrivateRoute>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/pay/invoice/:invoiceId' element={<clientInvoiceView/>}/>
      </Routes> 
    </BrowserRouter>
  )
}

export default App
