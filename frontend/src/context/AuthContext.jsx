import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const name  = localStorage.getItem('admin_name')
    const rol   = localStorage.getItem('admin_rol') || 'admin'
    if (token && name) setAdmin({ name, rol })
    setLoading(false)
  }, [])

  async function login(email, password) {
    const data = await api.post('/admin/login', { email, password })
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_name',  data.name)
    localStorage.setItem('admin_rol',   data.rol || 'admin')
    setAdmin({ name: data.name, rol: data.rol || 'admin' })
  }

  function logout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_name')
    localStorage.removeItem('admin_rol')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
