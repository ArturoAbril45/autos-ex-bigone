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
    // Primero verificar usuarios creados desde el panel
    const locales = JSON.parse(localStorage.getItem('bigone_admin_usuarios') || '[]')
    const local = locales.find(u => u.email === email && u.password === password && u.activo !== false)
    if (local) {
      localStorage.setItem('admin_token', 'local-' + local.id)
      localStorage.setItem('admin_name',  local.nombre)
      localStorage.setItem('admin_rol',   local.rol || 'asesor')
      setAdmin({ name: local.nombre, rol: local.rol || 'asesor' })
      return
    }
    // Fallback al backend (siempre admin)
    const data = await api.post('/admin/login', { email, password })
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_name',  data.name)
    localStorage.setItem('admin_rol',   'admin')
    setAdmin({ name: data.name, rol: 'admin' })
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
