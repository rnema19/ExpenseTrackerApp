import React from 'react'
import { useState, useEffect } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { authenticatedFetch } from '@/lib/api'

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [searchTitle, setSearchTitle] = useState('')
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_EXPENSE_API_URL || "http://localhost:3000/expenses"

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      let response = await authenticatedFetch(`${API_URL}/view-expense`)
      if (response) {
        const data = await response.json()
        console.log("Data fetched:", data)
        setExpenses(data)
      }
    } catch (error) {
      console.log("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleAddExpense = () => {
    navigate('/expenses/add-expense')
  }

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0)

  // Calculate category-wise summary
  const getCategoryWiseSummary = () => {
    const summary = {}
    expenses.forEach(expense => {
      if (!summary[expense.category]) {
        summary[expense.category] = 0
      }
      summary[expense.category] += expense.amount
    })
    return summary
  }

  const categoryWiseSummary = getCategoryWiseSummary()

  // Filter expenses based on category, date, and search title
  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      const matchesCategory = !filterCategory || expense.category === filterCategory
      const matchesDate = !filterDate || new Date(expense.date).toLocaleDateString('en-IN') === filterDate
      const matchesTitle = !searchTitle || expense.title.toLowerCase().includes(searchTitle.toLowerCase())
      return matchesCategory && matchesDate && matchesTitle
    })
  }

  const filteredExpenses = getFilteredExpenses()

  // Get unique categories for filter dropdown
  const getUniqueCategories = () => {
    const categories = new Set(expenses.map(exp => exp.category))
    return Array.from(categories).sort()
  }

  const handleClearFilters = () => {
    setFilterCategory('')
    setFilterDate('')
    setSearchTitle('')
  }

  const handleEdit = (id) => {
    navigate(`/expenses/${id}/edit-expense`)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await authenticatedFetch(`${API_URL}/${id}/delete-expense`, {
          method: 'DELETE',
        })
        if (response && response.ok) {
          setExpenses(expenses.filter(exp => exp._id !== id))
        }
      } catch (error) {
        console.log("Error deleting expense:", error)
      }
    }
  }

  return (
    <div className='min-h-screen bg-linear-to-r from-emerald-500 to-lime-600 p-8'>
      <div className='max-w-6xl mx-auto'>
        {
          loading ? (
            <div className='flex justify-center items-center h-96'>
              <RotatingLines
                visible={true}
                height="96"
                width="96"
                color="white"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
              />
            </div>
          ) : expenses && expenses.length > 0 ? (
            <div>
              <h1 className='text-4xl font-bold text-white mb-8'>Your Expenses</h1>
              
              {/* Filter Section */}
              <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Filter & Search</h2>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                  {/* Search by Title */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Search Title</label>
                    <input
                      type='text'
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      placeholder='Search expense title...'
                      className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                    />
                  </div>

                  {/* Filter by Category */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                    >
                      <option value=''>All Categories</option>
                      {getUniqueCategories().map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filter by Date */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Date</label>
                    <input
                      type='date'
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                    />
                  </div>

                  {/* Clear Filters Button */}
                  <div className='flex items-end'>
                    <button
                      onClick={handleClearFilters}
                      className='w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 cursor-pointer'
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
                <p className='text-sm text-gray-600 mt-3'>
                  Showing {filteredExpenses.length} of {expenses.length} expenses
                </p>
              </div>
              
              {/* Summary Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                {/* Total Expenses Card */}
                <div className='bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-gray-600 text-sm font-medium mb-2'>Total Expenses</p>
                      <h2 className='text-4xl font-bold text-blue-600'>₹ {totalExpenses}</h2>
                    </div>
                  </div>
                  <p className='text-gray-500 text-xs mt-4'>Sum of all your expenses</p>
                </div>

                {/* Category-wise Summary Card */}
                <div className='bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform'>
                  <p className='text-gray-600 text-sm font-medium mb-4'>Category-wise Summary</p>
                  <div className='space-y-2 max-h-40 overflow-y-auto'>
                    {Object.entries(categoryWiseSummary).length > 0 ? (
                      Object.entries(categoryWiseSummary).map(([category, amount]) => (
                        <div key={category} className='flex justify-between items-center'>
                          <span className='text-gray-700 text-sm'>{category}</span>
                          <span className='font-semibold text-green-600'>₹ {amount}</span>
                        </div>
                      ))
                    ) : (
                      <p className='text-gray-500 text-sm'>No categories yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className='overflow-x-auto bg-white rounded-lg shadow-lg'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-linear-to-r from-blue-600 to-blue-800 text-white'>
                      <th className='px-6 py-4 text-left font-semibold'>ID</th>
                      <th className='px-6 py-4 text-left font-semibold'>Title</th>
                      <th className='px-6 py-4 text-left font-semibold'>Amount</th>
                      <th className='px-6 py-4 text-left font-semibold'>Category</th>
                      <th className='px-6 py-4 text-left font-semibold'>Date</th>
                      <th className='px-6 py-4 text-center font-semibold'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((expense, index) => (
                        <tr key={expense._id || index} className='border-b hover:bg-gray-100 transition-colors'>
                          <td className='px-6 py-4 text-gray-800 font-medium'>{index + 1}</td>
                          <td className='px-6 py-4 text-gray-800'>{expense.title}</td>
                          <td className='px-6 py-4 text-gray-800 font-semibold'>₹ {expense.amount}</td>
                          <td className='px-6 py-4'>
                            <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold'>
                              {expense.category}
                            </span>
                          </td>
                          <td className='px-6 py-4 text-gray-800'>
                            {new Date(expense.date).toLocaleDateString('en-IN')}
                          </td>
                          <td className='px-6 py-4'>
                            <div className='flex gap-2 justify-center'>
                              <button
                                onClick={() => handleEdit(expense._id)}
                                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer'
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(expense._id)}
                                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer'
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='6' className='px-6 py-8 text-center text-gray-500 text-lg'>
                          No expenses match your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-96'>
              <div className='bg-white rounded-lg shadow-lg p-12 text-center max-w-md'>
                <h2 className='text-3xl font-bold text-gray-800 mb-4'>No Expenses Yet</h2>
                <p className='text-gray-600 text-lg mb-6'>
                  You haven't added any expenses yet. Click the button below to start tracking your expenses!
                </p>
                <Button
                  onClick={handleAddExpense}
                  className='bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 cursor-pointer'
                  variant="default"
                >
                  Add Your First Expense
                </Button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Expenses