import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleAddExpense = () => {
    navigate('/expenses/add-expense');
  };

  const handleViewExpenses = () => {
    navigate('/expenses/view-expense');
  };

  const handleCharts = () => {
    navigate('/expenses/view-graph');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 
            onClick={handleViewExpenses}
            className="text-2xl sm:text-3xl font-bold text-white hover:text-yellow-400 transition-colors duration-300 cursor-pointer"
          >
            Expense Tracker
          </h1>
          {user.fullName && (
            <span className="text-sm text-gray-300 hidden sm:block">
              Welcome, {user.fullName}!
            </span>
          )}
        </div>
        
        <div className="flex gap-3 sm:gap-4 items-center flex-wrap justify-end right-0">
          <Button 
            onClick={handleAddExpense}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            variant="default"
          >
            Add Expense
          </Button>

          <Button 
            onClick={handleCharts}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            variant="default"
          >
            Charts
          </Button>

          <Button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            variant="default"
          >
            Logout
          </Button>
          
        </div>
      </div>
    </nav>
  )
}

export default Header