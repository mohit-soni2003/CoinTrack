import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { FiLogOut, FiUser } from 'react-icons/fi'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import MobileNav from './components/MobileNav'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminSignup from './pages/AdminSignup'
import Dashboard from './pages/Dashboard'
import ExpenseList from './pages/ExpenseList'
import AddExpense from './pages/AddExpenses'
import Family from './pages/Family'
import { useAuth } from './contexts/AuthContext'

function AppHeader() {
  const nav = useNavigate()
  const auth = useAuth()

  return (
    <header className="app-header">
      <div className="title">CoinTrack</div>
      <div className="header-actions">
        {auth && auth.user ? (
          <>
            <button

              aria-label="Open profile"
              title={auth.user.name || 'Profile'}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                marginRight: 8,
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              {auth.user && auth.user.profilePhoto ? (
                <img
                  src={auth.user.profilePhoto}
                  alt={auth.user.name || 'Profile'}
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <FiUser size={22} />
              )}
            </button>
            <button
              onClick={() => auth.logout()}
              aria-label="Logout"
              title="Logout"
              style={{
                background: 'transparent',
                border: 'none',
                padding: 4,
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <FiLogOut size={18} />
            </button>
          </>
        ) : (
          <Button variant="outline-primary" size="sm" onClick={() => nav('/login')}>Login</Button>
        )}
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <Container fluid className="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/add" element={<AddExpense />} />
          <Route path="/family" element={<Family />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
        </Routes>
      </Container>

      <MobileNav />
    </div>
  )
}