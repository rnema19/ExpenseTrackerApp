import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    emailId: '',
    password: '',
    fullName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000/auth"

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/login' : '/register'
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Update authentication state in parent
        if (onLogin) onLogin()
        
        // Redirect to expenses page
        navigate('/expenses/view-expense')
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({
      username: '',
      emailId: '',
      password: '',
      fullName: ''
    })
  }

  return (
    <div className='min-h-screen bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center p-8'>
      <div className='bg-white rounded-lg shadow-2xl p-8 w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className='text-gray-600'>
            {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Username */}
          <div>
            <label htmlFor='username' className='block text-sm font-semibold text-gray-700 mb-2'>
              Username *
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleInputChange}
              placeholder='Enter your username'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
              required
            />
          </div>

          {/* Email (Register only) */}
          {!isLogin && (
            <div>
              <label htmlFor='emailId' className='block text-sm font-semibold text-gray-700 mb-2'>
                Email *
              </label>
              <input
                type='email'
                id='emailId'
                name='emailId'
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder='Enter your email'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
                required={!isLogin}
              />
            </div>
          )}

          {/* Full Name (Register only) */}
          {!isLogin && (
            <div>
              <label htmlFor='fullName' className='block text-sm font-semibold text-gray-700 mb-2'>
                Full Name
              </label>
              <input
                type='text'
                id='fullName'
                name='fullName'
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder='Enter your full name'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
              Password *
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Enter your password'
              className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
              required
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50'
            variant="default"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type='button'
              onClick={toggleMode}
              className='ml-2 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer'
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Info */}
        {!isLogin && (
          <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-gray-700'>
              <span className='font-semibold'>Note:</span> Password must be at least 6 characters long.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login