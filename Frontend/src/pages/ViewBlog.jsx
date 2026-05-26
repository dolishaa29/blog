import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ViewBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + `/exploreSingleBlog/${id}`)
        if (res.data.success) setBlog(res.data.blog)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <p className="text-center mt-16 text-gray-500">Loading...</p>
    </div>
  )

  if (!blog) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <p className="text-center mt-16 text-gray-500">Blog not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-600 font-medium mb-5 hover:underline flex items-center gap-1"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {blog.Image && (
            <img src={blog.Image} alt={blog.Title} className="w-full h-64 object-cover" />
          )}
          <div className="p-8">

            <div className="flex items-center gap-2 mb-3">
              {blog.Category && (
                <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-2.5 py-0.5 rounded-full">
                  {blog.Category}
                </span>
              )}
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                blog.Status === 'Published'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-yellow-50 text-yellow-600'
              }`}>
                {blog.Status}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">{blog.Title}</h1>
            <p className="text-xs text-gray-400 mb-6">
              {new Date(blog.Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{blog.Description}</p>

            {blog.Hashtags && (
              <p className="text-indigo-500 text-sm mt-6 font-medium">{blog.Hashtags}</p>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

export default ViewBlog
