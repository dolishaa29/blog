import React, { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    address: "",
    profile: null
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, profile: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const sendData = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    const contactRegex = /^[6-9]\d{9}$/
    if (!contactRegex.test(formData.contact)) {
      setError("Please enter a valid 10-digit mobile number")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("email", formData.email)
      data.append("password", formData.password)
      data.append("contact", Number(formData.contact))
      data.append("address", formData.address)
      
      if (formData.profile) {
        data.append("profile", formData.profile)
      }

      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (res.data.status) {
        navigate("/")
      } else {
        setError(res.data.msg || "Registration failed")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
          <p className="text-gray-500 mt-1 text-sm">Create your account to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={sendData} className="space-y-4">
          
          <div className="flex flex-col items-center mb-2">
            <div className="w-20 h-20 rounded-full border border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center mb-2">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">No Image</span>
              )}
            </div>
            <label className="text-xs text-indigo-600 font-semibold cursor-pointer hover:text-indigo-500 transition">
              <span>Choose Profile Picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder="Contact (10-digit)"
              value={formData.contact}
              maxLength={10} 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, contact: value });
              }}
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition duration-200 text-sm disabled:opacity-70 shadow-sm"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-5 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register