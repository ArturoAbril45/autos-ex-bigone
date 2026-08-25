import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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
      <a href="https://wa.me/59167666665" target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        style={{ background: '#25D366' }}
        aria-label="WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>
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
