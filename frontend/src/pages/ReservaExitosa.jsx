import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://bigonerentacar.online/api'

export default function ReservaExitosa() {
  const location = useLocation()
  const [reserva, setReserva] = useState(null)

  useEffect(() => {
    // Caso 1 — flujo nacional (QR): la reserva ya quedó creada en el backend
    // antes de navegar aquí; solo llega para mostrarla, sin volver a guardar nada.
    const deRouterState = location.state?.reserva
    if (deRouterState) {
      setReserva({
        vehiculo:      deRouterState.vehiculo,
        año:           deRouterState.año,
        nombre:        deRouterState.nombre,
        ci:            deRouterState.ci,
        fechaIngreso:  deRouterState.fecha_ingreso,
        fechaEntrega:  deRouterState.fecha_entrega,
        monto:         deRouterState.monto,
      })
      return
    }

    // Caso 2 — flujo extranjero (Libelula): el pago ocurrió en un dominio
    // externo, así que la única forma de recuperar los datos al volver es
    // esta referencia dejada antes de la redirección. Se guarda en el
    // backend aquí mismo, una sola vez, y se limpia enseguida.
    const pendiente = JSON.parse(localStorage.getItem('bigone_reserva_pendiente') || 'null')
    if (!pendiente) return

    localStorage.removeItem('bigone_reserva_pendiente')
    setReserva({ ...pendiente, monto: pendiente.monto })

    fetch(`${API_URL}/bigone/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre:        pendiente.nombre,
        ci:            pendiente.ci,
        telefono:      pendiente.telefono,
        correo:        pendiente.correo || null,
        vehiculo:      pendiente.vehiculo,
        marca:         pendiente.marca || null,
        año:           pendiente.año,
        monto:         pendiente.monto,
        precio_total:  pendiente.precio_total || null,
        dias:          pendiente.dias,
        fecha_ingreso: pendiente.fechaIngreso,
        fecha_entrega: pendiente.fechaEntrega,
        tipo_cliente:  pendiente.tipo_cliente || 'extranjero',
        estado:        'pagada',
        origen:        pendiente.origen || 'reserva',
        lat:           pendiente.ubicacion?.lat || null,
        lng:           pendiente.ubicacion?.lng || null,
        ref_pago:      pendiente.identificador || null,
      }),
    }).catch(() => {})

    if (pendiente.identificador) {
      fetch(`${API_URL}/bigone/intentos/${pendiente.identificador}/completar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {})
    }

    fetch(`${API_URL}/log-cliente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre:        pendiente.nombre,
        ci:            pendiente.ci,
        celular:       pendiente.telefono,
        correo:        pendiente.correo || null,
        vehiculo:      pendiente.vehiculo,
        año:           pendiente.año,
        monto:         pendiente.monto,
        dias:          pendiente.dias,
        fecha_ingreso: pendiente.fechaIngreso,
        fecha_entrega: pendiente.fechaEntrega,
        tipo_cliente:  pendiente.tipo_cliente || 'extranjero',
        estado:        'pagada',
        origen:        pendiente.origen || 'reserva',
        lat:           pendiente.ubicacion?.lat || null,
        lng:           pendiente.ubicacion?.lng || null,
      }),
    }).catch(() => {})
  }, [location.state])

  return (
    <main className=" min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">

        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
          style={{ animation: 'scaleIn .4s ease' }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="21" stroke="#16a34a" strokeWidth="2" />
            <path d="M12 22l7 7 13-14" stroke="#16a34a" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="section-label text-[#16a34a] mb-1">Pago completado</p>
        <h1 className="font-display text-4xl uppercase text-[#111] tracking-tight mb-3">
          ¡Reserva exitosa!
        </h1>

        {reserva && (
          <div className="bg-[#F7F9FF] border border-[#0015FF]/10 rounded-xl px-5 py-4 text-left mb-6">
            <div className="flex flex-col gap-2">
              <Row label="Vehículo"     value={[reserva.vehiculo, reserva.año].filter(Boolean).join(' ')} />
              <Row label="Cliente"      value={reserva.nombre} />
              <Row label="CI"           value={reserva.ci} />
              {reserva.fechaIngreso && <Row label="Ingreso"  value={reserva.fechaIngreso} />}
              {reserva.fechaEntrega && <Row label="Entrega"  value={reserva.fechaEntrega} />}
              <Row label="Total pagado" value={`${Number(reserva.monto || 0).toLocaleString('es-BO')} Bs`} highlight />
            </div>
          </div>
        )}

        <p className="text-sm text-[#6B6B6B] leading-relaxed mb-8">
          Un asesor se pondrá en contacto contigo para confirmar los detalles de tu reserva.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/catalogo" className="w-full btn-blue justify-center !py-3">
            Ver más vehículos
          </Link>
          <Link to="/"
            className="flex items-center justify-center gap-2 text-[11px] text-[#6B6B6B] hover:text-[#111] uppercase tracking-widest font-semibold transition-colors">
            <Home size={12} /> Inicio
          </Link>
        </div>
      </div>

      <style>{`@keyframes scaleIn { from { transform: scale(0.5); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
    </main>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-[#F0F0F0] pb-1.5">
      <span className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-[#0015FF]' : 'text-[#111]'}`}>{value}</span>
    </div>
  )
}
