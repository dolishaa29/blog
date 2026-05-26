import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ViewBlog from './pages/ViewBlog'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddBlog from './pages/AddBlog'
import Register from './pages/Register'

function App() {
 return (
  <BrowserRouter>
    <Routes>
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<Login />} />
      <Route path='/explore' element={<Explore />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/addblog' element={<AddBlog />} />
      <Route path='/viewblog/:id' element={<ViewBlog />} />
      <Route path='/profile' element={<Profile />} />
    </Routes>
  </BrowserRouter>
 )
}

export default App
