import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Navbar = () => {
  const navigate = useNavigate()

  // Check karo user logged in hai ya nahi
  const token = Cookies.get('token')
  const isLoggedIn = !!token

  const handleLogout = () => {
    Cookies.remove('token')
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-indigo-600">BlogApp</Link>

      {/* Links */}
      <div className="flex items-center gap-4">

        {/* Explore sabke liye */}
        <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600 transition">
          Explore
        </Link>

        {/* Agar logged in hai toh ye links dikhenge */}
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600 transition">
              Dashboard
            </Link>
            <Link to="/addblog" className="text-sm text-gray-600 hover:text-indigo-600 transition">
              Add Blog
            </Link>
            <Link to="/profile" className="text-sm text-gray-600 hover:text-indigo-600 transition">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-white bg-red-500 hover:bg-red-400 px-3 py-1.5 rounded-lg transition font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          /* Agar logged out hai toh Login/Signup dikhega */
          <>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-indigo-600 transition font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition font-medium"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
