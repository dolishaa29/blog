import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ViewBlog from './pages/ViewBlog'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddBlog from './pages/AddBlog'
import Register from './pages/Register'
import UpdateBlog from './pages/UpdateBlog'

function App() {
 return (
  <BrowserRouter>
    <Routes>
      {/* Home aur Explore dono same page */}
      <Route path='/' element={<Explore />} />
      <Route path='/explore' element={<Explore />} />
      {/* Login / Register */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      {/* Protected pages */}
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/addblog' element={<AddBlog />} />
      <Route path='/viewblog/:id' element={<ViewBlog />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/updateblog/:id' element={<UpdateBlog />} />
    </Routes>
  </BrowserRouter>
 )
}

export default App
