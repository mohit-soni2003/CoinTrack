import { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/auth.service'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getUser())
  const [token, setToken] = useState(authService.getToken())
  const nav = useNavigate()

  useEffect(() => {
    // keep state in sync with localStorage
    const handler = () => {
      setUser(authService.getUser())
      setToken(authService.getToken())
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user || data.member || null)
    setToken(data.token || null)
    return data
  }

  const register = async (payload) => {
    const data = await authService.registerMember(payload)
    setUser(data.member || null)
    setToken(data.token || null)
    return data
  }

  const registerAdmin = async (payload) => {
    const data = await authService.registerAdmin(payload)
    setUser(data.admin || null)
    setToken(data.token || null)
    return data
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
    nav('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, registerAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
