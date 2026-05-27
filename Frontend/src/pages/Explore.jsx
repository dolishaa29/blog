import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

// Categories filter ke liye - apne hisaab se change kar sakte ho
const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Education']

const Explore = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Check karo user logged in hai ya nahi
  const isLoggedIn = !!Cookies.get('token')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/exploreAllBlogs')
        if (res.data.success) setBlogs(res.data.blogs)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  // Add Blog click - agar login nahi toh login page pe bhejo
  const handleAddBlog = () => {
    if (isLoggedIn) {
      navigate('/addblog')
    } else {
      navigate('/login')
    }
  }

  // Search + category filter dono lagao
  const filtered = blogs.filter(blog => {
    const matchesSearch =
      blog.Title?.toLowerCase().includes(search.toLowerCase()) ||
      blog.Category?.toLowerCase().includes(search.toLowerCase()) ||
      blog.Hashtags?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' || blog.Category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Top row - Title + Add Blog button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Explore Blogs</h1>
          <button
            onClick={handleAddBlog}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            + Add Blog
          </button>
        </div>

        {/* Search box */}
        <input
          type="text"
          placeholder="Search by title, category or hashtag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm mb-4"
        />

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && <p className="text-center text-gray-500 py-10">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-10">Koi blog nahi mila.</p>
        )}

        {/* Blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(blog => (
            <div
              key={blog._id}
              onClick={() => navigate(`/viewblog/${blog._id}`)}
              className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
            >
              {blog.Image && (
                <img src={blog.Image} alt={blog.Title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                {blog.Category && (
                  <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full">
                    {blog.Category}
                  </span>
                )}
                <h2 className="text-sm font-semibold text-gray-800 mt-2 mb-1 line-clamp-2">{blog.Title}</h2>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{blog.Description}</p>
                <p className="text-xs text-gray-400">
                  {new Date(blog.Date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Explore
