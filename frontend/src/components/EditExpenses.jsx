import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { authenticatedFetch } from '@/lib/api'

const EditExpenses = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  
  // Helper function to format date as yyyy-MM-dd for input
  const getFormattedDate = (dateInput) => {
    let date;
    if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    } else {
      date = dateInput
    }
    
    if (isNaN(date.getTime())) {
      // If date is invalid, return today's date
      date = new Date()
    }
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: getFormattedDate(new Date()),
  })
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const API_URL = import.meta.env.VITE_EXPENSE_API_URL || "http://localhost:3000/expenses"

  // Fetch expense data on component mount
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true)
        const response = await authenticatedFetch(`${API_URL}/${id}/edit-expense`)
        const data = await response.json()
        
        if (response.ok) {
          setFormData({
            title: data.expense.title,
            amount: data.expense.amount,
            category: data.expense.category,
            date: getFormattedDate(data.expense.date),
          })
        } else {
          setError(data.error || 'Failed to fetch expense')
        }
      } catch (error) {
        console.error('Error fetching expense:', error)
        setError('Error fetching expense. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchExpense()
    }
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (!formData.category) {
      setError('Please enter a category')
      return
    }
    if (!formData.date) {
      setError('Please select a date')
      return
    }

    setError('')
    setSubmitLoading(true)

    try {
      const response = await authenticatedFetch(`${API_URL}/${id}/edit-expense`, {
        method: 'PUT',
        body: JSON.stringify({
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Expense updated successfully!')
        setTimeout(() => {
          navigate('/expenses/view-expense')
        }, 1500)
      } else {
        setError(data.error || 'Failed to update expense')
      }
    } catch (error) {
      console.error('Error updating expense:', error)
      setError('Error updating expense. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/expenses/view-expense')
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-linear-to-r from-emerald-500 to-lime-600 p-8 flex justify-center items-center'>
        <div className='text-white text-2xl font-semibold'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-linear-to-r from-emerald-500 to-lime-600 p-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow-2xl p-8'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>Edit Expense</h1>
            <p className='text-gray-600'>Update the expense details below</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg'>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title Field */}
            <div>
              <label htmlFor='title' className='block text-sm font-semibold text-gray-700 mb-2'>
                Expense Title *
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                placeholder='e.g., Groceries, Gas, Movie tickets'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
                required
              />
            </div>

            {/* Amount Field */}
            <div>
              <label htmlFor='amount' className='block text-sm font-semibold text-gray-700 mb-2'>
                Amount (₹) *
              </label>
              <input
                type='number'
                id='amount'
                name='amount'
                value={formData.amount}
                onChange={handleInputChange}
                placeholder='0.00'
                step='0.01'
                min='0'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
                required
              />
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor='category' className='block text-sm font-semibold text-gray-700 mb-2'>
                Category *
              </label>
              <input
                type='text'
                id='category'
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                placeholder='e.g., Food, Transportation, Entertainment'
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors '
                required
              />
            </div>

            {/* Date Field */}
            <div>
              <label htmlFor='date' className='block text-sm font-semibold text-gray-700 mb-2'>
                Date *
              </label>
              <input
                type='date'
                id='date'
                name='date'
                value={formData.date}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
                required
              />
            </div>

            {/* Buttons */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='submit'
                disabled={submitLoading}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 cursor-pointer'
                variant="default"
              >
                {submitLoading ? 'Updating...' : 'Update Expense'}
              </Button>
              <Button
                type='button'
                onClick={handleCancel}
                className='flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer'
                variant="default"
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Form Info */}
          <div className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-gray-700'>
              <span className='font-semibold'>Note:</span> All fields marked with * are required. The amount should be a positive number.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditExpenses
