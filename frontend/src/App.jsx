import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Expenses from './components/Expenses.jsx'
import Footer from './components/Footer.jsx'
import AddExpenses from './components/AddExpenses.jsx'
import EditExpenses from './components/EditExpenses.jsx'
import Chart from './components/Chart.jsx'
import Login from './components/Login.jsx'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)

    // Listen for storage changes (login/logout events)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        {/* Protected Routes */}
        <Route 
          path="/expenses/view-expense" 
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expenses/add-expense" 
          element={
            <ProtectedRoute>
              <AddExpenses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expenses/:id/edit-expense" 
          element={
            <ProtectedRoute>
              <EditExpenses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/expenses/view-graph' 
          element={
            <ProtectedRoute>
              <Chart />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/expenses/view-expense" : "/login"} replace />} />
      </Routes>
      {isAuthenticated && <Footer />}
    </Router>
  )
}

export default App