import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const token = Cookies.get('token')

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/viewUserBlogs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.success) setBlogs(res.data.blogs)
    } catch (err) {
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog?')) return
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/deleteBlog/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBlogs(blogs.filter(b => b._id !== id))
    } catch (err) {
      alert('Failed to delete blog')
    }
  }

  useEffect(() => {
    if (!token) { navigate('/'); return }
    fetchBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Blogs</h1>
          <Link
            to="/addblog"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            + Add Blog
          </Link>
        </div>

        {loading && <p className="text-center text-gray-500 py-10">Loading...</p>}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {!loading && blogs.length === 0 && (
          <div className="text-center bg-white rounded-2xl shadow-lg p-12">
            <p className="text-gray-500 mb-4">No blogs yet. Create your first one!</p>
            <Link
              to="/addblog"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
            >
              + Add Blog
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {blogs.map(blog => (
            <div key={blog._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              {blog.Image && (
                <img src={blog.Image} alt={blog.Title} className="w-full h-44 object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {blog.Category && (
                    <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full">
                      {blog.Category}
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    blog.Status === 'Published'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {blog.Status}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">{blog.Title}</h2>
                <p className="text-xs text-gray-400 mb-4">
                  {new Date(blog.Date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/updateblog/${blog._id}`)}
                    className="flex-1 py-2 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/viewblog/${blog._id}`)}
                    className="flex-1 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex-1 py-2 text-xs font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
