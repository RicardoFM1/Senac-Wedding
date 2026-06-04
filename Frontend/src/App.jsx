import { useState } from 'react'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router"
import {ToastContainer} from "react-toastify"
import Login from './Pages/Login/login'
import Home from './Pages/Home/home'
function App() {
 

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000}/>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/' element={<Home />}/>

      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
