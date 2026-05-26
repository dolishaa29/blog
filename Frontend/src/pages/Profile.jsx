import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const [formData, setFormData] = useState({
    name: '', email: '', contact: '', address: '', image: null
  })

  const token = Cookies.get('token')

  useEffect(() => {
    if (!token) { navigate('/'); return }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data.success) {
          const u = res.data.user
          setUser(u)
          setFormData({ name: u.name || '', email: u.email || '', contact: u.contact || '', address: u.address || '', image: null })
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('email', formData.email)
      data.append('contact', formData.contact)
      data.append('address', formData.address)
      if (formData.image) data.append('image', formData.image)

      const res = await axios.post(import.meta.env.VITE_API_URL + '/updateprofile', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      if (res.data.success) {
        setUser(res.data.user)
        setSuccess('Profile updated successfully!')
        setEditing(false)
        setImagePreview(null)
      }
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <p className="text-center mt-16 text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setSuccess('') }}
                className="text-sm text-indigo-600 font-semibold hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-2.5 rounded-xl mb-4 text-center">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full border-2 border-indigo-100 overflow-hidden bg-gray-50 flex items-center justify-center mb-2">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : user?.profile ? (
                <img src={user.profile} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-indigo-300">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            {editing && (
              <label className="text-xs text-indigo-600 font-semibold cursor-pointer hover:text-indigo-500 transition">
                Change Photo
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {!editing ? (
            <div className="space-y-1">
              {[['Name', user?.name], ['Email', user?.email], ['Contact', user?.contact], ['Address', user?.address]].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <span className="text-xs font-medium text-gray-500">{label}</span>
                  <span className="text-sm text-gray-700">{value || '—'}</span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              {[
                ['Name', 'name', 'text', 'Your name'],
                ['Email', 'email', 'email', 'yourmail@gmail.com'],
                ['Contact', 'contact', 'tel', '10-digit number'],
                ['Address', 'address', 'text', 'Your address']
              ].map(([label, field, type, placeholder]) => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[field]}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setEditing(false); setError(''); setImagePreview(null) }}
                  className="flex-1 py-2.5 rounded-xl text-gray-600 text-sm font-semibold border border-gray-300 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-70"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default Profile
