import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Navbar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    Cookies.remove('token')
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <Link to="/dashboard" className="text-xl font-bold text-indigo-600">BlogApp</Link>
      <div className="flex items-center gap-5">
        <Link to="/explore" className="text-sm text-gray-600 hover:text-indigo-600 transition">Explore</Link>
        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600 transition">Dashboard</Link>
        <Link to="/addblog" className="text-sm text-gray-600 hover:text-indigo-600 transition">Add Blog</Link>
        <Link to="/profile" className="text-sm text-gray-600 hover:text-indigo-600 transition">Profile</Link>
        <button
          onClick={handleLogout}
          className="text-sm text-white bg-red-500 hover:bg-red-400 px-3 py-1.5 rounded-lg transition font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
