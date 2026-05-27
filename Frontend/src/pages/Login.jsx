import React, { useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { useNavigate, Link } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"

const Login = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      )

      if (response.status === 200 && response.data.token) {
        Cookies.set("token", response.data.token, { expires: 1 })
        navigate("/dashboard")
      } else {
        setError(response.data.message || "Invalid Credentials")
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login Failed! Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Google se login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/googleLogin",
        { credential: credentialResponse.credential }
      )

      if (res.data.success && res.data.token) {
        Cookies.set("token", res.data.token, { expires: 1 })
        navigate("/dashboard")
      }
    } catch (err) {
      setError("Google login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
          <p className="text-gray-500 mt-1 text-sm">Please login to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed.")}
            text="signin_with"
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="yourmail@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition duration-200 text-sm disabled:opacity-70 shadow-sm"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-5 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
