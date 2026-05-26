import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const categories = ['Technology', 'Health', 'Travel', 'Food', 'Lifestyle', 'Business', 'Education', 'Other']

const AddBlog = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Hashtags: '',
    Category: '',
    Status: 'Draft',
    image: null
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = Cookies.get('token')
      const data = new FormData()
      data.append('Title', formData.Title)
      data.append('Description', formData.Description)
      data.append('Hashtags', formData.Hashtags)
      data.append('Category', formData.Category)
      data.append('Status', formData.Status)
      if (formData.image) data.append('image', formData.image)

      const res = await axios.post(import.meta.env.VITE_API_URL + '/addBlog', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.data.success) {
        navigate('/dashboard')
      } else {
        setError(res.data.message || 'Failed to add blog')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Add New Blog</h2>
          <p className="text-gray-500 text-sm mb-6">Fill in the details to publish your blog</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Title</label>
              <input
                type="text"
                placeholder="Blog title"
                value={formData.Title}
                onChange={e => setFormData({ ...formData, Title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
              <textarea
                placeholder="Write your blog content here..."
                value={formData.Description}
                onChange={e => setFormData({ ...formData, Description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm resize-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600 block mb-1">Category</label>
                <select
                  value={formData.Category}
                  onChange={e => setFormData({ ...formData, Category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
                <select
                  value={formData.Status}
                  onChange={e => setFormData({ ...formData, Status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Hashtags</label>
              <input
                type="text"
                placeholder="#react #tech #blog"
                value={formData.Hashtags}
                onChange={e => setFormData({ ...formData, Hashtags: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Cover Image</label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover rounded-xl mb-2" />
              )}
              <label className="block w-full py-2.5 text-center text-sm text-indigo-600 font-semibold border border-dashed border-indigo-300 rounded-xl cursor-pointer hover:bg-indigo-50 transition">
                {imagePreview ? 'Change Image' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition text-sm disabled:opacity-70 shadow-sm"
            >
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBlog
