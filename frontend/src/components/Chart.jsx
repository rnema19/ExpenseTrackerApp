import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { RotatingLines } from 'react-loader-spinner'
import Chart from 'chart.js/auto'
import { authenticatedFetch } from '@/lib/api'

const ChartPage = () => {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  
  const pieChartRef = useRef(null)
  const barChartRef = useRef(null)
  const pieChartInstance = useRef(null)
  const barChartInstance = useRef(null)
  
  const API_URL = import.meta.env.VITE_EXPENSE_API_URL || "http://localhost:3000/expenses"

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true)
        const response = await authenticatedFetch(`${API_URL}/view-expense`)
        if (response) {
          const data = await response.json()
          console.log("Expenses fetched for charts:", data)
          setExpenses(data)
        }
      } catch (error) {
        console.error('Error fetching expenses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  // Generate pie chart data (category-wise distribution)
  useEffect(() => {
    if (expenses.length === 0 || !pieChartRef.current) return

    // Calculate category-wise summary
    const categoryData = {}
    expenses.forEach(expense => {
      if (!categoryData[expense.category]) {
        categoryData[expense.category] = 0
      }
      categoryData[expense.category] += expense.amount
    })

    const categories = Object.keys(categoryData)
    const amounts = Object.values(categoryData)

    // Generate random colors for each category
    const colors = categories.map(() => {
      const r = Math.floor(Math.random() * 255)
      const g = Math.floor(Math.random() * 255)
      const b = Math.floor(Math.random() * 255)
      return `rgba(${r}, ${g}, ${b}, 0.6)`
    })

    const borderColors = categories.map(() => {
      const r = Math.floor(Math.random() * 255)
      const g = Math.floor(Math.random() * 255)
      const b = Math.floor(Math.random() * 255)
      return `rgba(${r}, ${g}, ${b}, 1)`
    })

    // Destroy previous chart instance if it exists
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy()
    }

    // Create pie chart
    const ctx = pieChartRef.current.getContext('2d')
    pieChartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [
          {
            data: amounts,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14,
                weight: 'bold',
              },
              padding: 15,
            },
          },
          title: {
            display: true,
            text: 'Category-wise Expense Distribution',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ₹${context.parsed.y || context.parsed}`
              },
            },
          },
        },
      },
    })
  }, [expenses])

  // Generate bar chart data (title-wise expenses)
  useEffect(() => {
    if (expenses.length === 0 || !barChartRef.current) return

    const titles = expenses.map(exp => exp.title)
    const amounts = expenses.map(exp => exp.amount)

    // Destroy previous chart instance if it exists
    if (barChartInstance.current) {
      barChartInstance.current.destroy()
    }

    // Create bar chart
    const ctx = barChartRef.current.getContext('2d')
    barChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: titles,
        datasets: [
          {
            label: 'Expense Amount (₹)',
            data: amounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'x',
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 12,
                weight: 'bold',
              },
              padding: 15,
            },
          },
          title: {
            display: true,
            text: 'Expense Amount by Title',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Amount: ₹${context.parsed.y}`
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return '₹' + value
              },
            },
            title: {
              display: true,
              text: 'Amount (₹)',
            },
          },
          x: {
            ticks: {
              font: {
                size: 10,
              },
            },
          },
        },
      },
    })
  }, [expenses])

  const handleGoBack = () => {
    navigate('/expenses/view-expense')
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-linear-to-r from-emerald-500 to-lime-600 p-8 flex justify-center items-center'>
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
    )
  }

  if (expenses.length === 0) {
    return (
      <div className='min-h-screen bg-linear-to-r from-emerald-500 to-lime-600 p-8 flex justify-center items-center'>
        <div className='bg-white rounded-lg shadow-lg p-12 text-center max-w-md'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>No Data Available</h2>
          <p className='text-gray-600 text-lg mb-6'>
            Add some expenses first to view charts and analytics.
          </p>
          <button
            onClick={handleGoBack}
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-linear-to-r from-emerald-500 to-lime-600 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>Expense Analytics</h1>
          <p className='text-white text-lg'>Visualize your spending patterns</p>
        </div>

        {/* Charts Container */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          {/* Pie Chart - Category Distribution */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <canvas ref={pieChartRef}></canvas>
          </div>

          {/* Bar Chart - Title-wise Expenses */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>

        {/* Summary Stats */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>Summary Statistics</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Total Expenses */}
            <div className='bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600'>
              <p className='text-gray-600 text-sm font-medium mb-2'>Total Expenses</p>
              <h3 className='text-3xl font-bold text-blue-600'>
                ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0)}
              </h3>
              <p className='text-gray-500 text-xs mt-2'>All expenses combined</p>
            </div>

            {/* Average Expense */}
            <div className='bg-linear-to-br from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-600'>
              <p className='text-gray-600 text-sm font-medium mb-2'>Average Expense</p>
              <h3 className='text-3xl font-bold text-green-600'>
                ₹{(expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length).toFixed(2)}
              </h3>
              <p className='text-gray-500 text-xs mt-2'>Per expense</p>
            </div>

            {/* Total Transactions */}
            <div className='bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-600'>
              <p className='text-gray-600 text-sm font-medium mb-2'>Total Transactions</p>
              <h3 className='text-3xl font-bold text-purple-600'>{expenses.length}</h3>
              <p className='text-gray-500 text-xs mt-2'>Number of expenses</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className='flex justify-center'>
          <button
            onClick={handleGoBack}
            className='bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg cursor-pointer'
          >
            Back to Expenses
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChartPage
