import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SocialFloat from './components/SocialFloat'
import AdminLayout from './components/admin/AdminLayout'

import Home       from './pages/Home'
import Catalogo   from './pages/Catalogo'
import Requisitos from './pages/Requisitos'
import Contacto   from './pages/Contacto'
import Reservar   from './pages/Reservar'
import Redes          from './pages/Redes'
import PagoServicios   from './pages/PagoServicios'
import ReservaExitosa  from './pages/ReservaExitosa'

import AdminLogin     from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminVehiculos from './pages/admin/Vehiculos'
import AdminReservas  from './pages/admin/Reservas'
import AdminAgenda    from './pages/admin/Agenda'
import AdminClientes  from './pages/admin/Clientes'
import AdminFinanzas  from './pages/admin/Finanzas'
import AdminRedes      from './pages/admin/Redes'
import AdminGarantias  from './pages/admin/Garantias'
import AdminUsuarios   from './pages/admin/Usuarios'
import AdminLogs       from './pages/admin/Logs'

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return null
  if (!admin)  return <Navigate to="/admin/login" replace />
  return <AdminLayout>{children}</AdminLayout>
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FFE600] flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <SocialFloat />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* público */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/catalogo"   element={<PublicLayout><Catalogo /></PublicLayout>} />
          <Route path="/requisitos" element={<PublicLayout><Requisitos /></PublicLayout>} />
          <Route path="/contacto"   element={<PublicLayout><Contacto /></PublicLayout>} />
          <Route path="/reservar"   element={<PublicLayout><Reservar /></PublicLayout>} />
          <Route path="/redes"           element={<PublicLayout><Redes          /></PublicLayout>} />
          <Route path="/pago-servicios"   element={<PublicLayout><PagoServicios   /></PublicLayout>} />
          <Route path="/reserva-exitosa"  element={<PublicLayout><ReservaExitosa  /></PublicLayout>} />

          {/* admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/vehiculos" element={<ProtectedRoute><AdminVehiculos /></ProtectedRoute>} />
          <Route path="/admin/reservas"  element={<ProtectedRoute><AdminReservas /></ProtectedRoute>} />
          <Route path="/admin/agenda"    element={<ProtectedRoute><AdminAgenda /></ProtectedRoute>} />
          <Route path="/admin/clientes"  element={<ProtectedRoute><AdminClientes /></ProtectedRoute>} />
          <Route path="/admin/finanzas"  element={<ProtectedRoute><AdminFinanzas /></ProtectedRoute>} />
          <Route path="/admin/redes"      element={<ProtectedRoute><AdminRedes      /></ProtectedRoute>} />
          <Route path="/admin/garantias"  element={<ProtectedRoute><AdminGarantias  /></ProtectedRoute>} />
          <Route path="/admin/usuarios"   element={<ProtectedRoute><AdminUsuarios   /></ProtectedRoute>} />
          <Route path="/admin/logs"       element={<ProtectedRoute><AdminLogs       /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
