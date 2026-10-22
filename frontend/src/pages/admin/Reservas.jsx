import { useEffect, useState, useRef } from 'react'
import { Trash2, CheckCircle, BadgeCheck, XCircle, AlertCircle, Power, MapPin, Download, RotateCcw, Trash, Eye, X } from 'lucide-react'
import { api } from '../../lib/api'

const TABS = [
  { key: 'pagadas',        label: 'Pagadas',         icon: CheckCircle, color: 'text-[#16a34a]' },
  { key: 'confirmadas',    label: 'Confirmadas',     icon: BadgeCheck,  color: 'text-[#0015FF]' },
  { key: 'anuladas',       label: 'Anuladas',         icon: XCircle,     color: 'text-[#FF0033]' },
  { key: 'no_completadas', label: 'No completadas',   icon: AlertCircle, color: 'text-[#F59E0B]' },
  { key: 'papelera',       label: 'Papelera',         icon: Trash,       color: 'text-[#6B6B6B]' },
]

const ORIGEN_LABEL = { reserva: 'Reserva', servicio: 'Servicio' }

function fmtFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-BO', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const DOC_LABEL = { ci: 'Cédula / Pasaporte', licencia: 'Licencia de conducir', factura: 'Factura de servicios', voucher: 'Reserva de hotel' }

const ESTADO_BADGE = {
  pagada:     { cls: 'bg-[#EDFAF3] border-[#86EFAC] text-[#16a34a]', dot: 'bg-[#16a34a]', label: 'Pagada' },
  confirmada: { cls: 'bg-[#EEF2FF] border-[#A5B4FC] text-[#0015FF]', dot: 'bg-[#0015FF]', label: 'Confirmada' },
  anulada:    { cls: 'bg-[#FFF0F2] border-[#FCA5A5] text-[#FF0033]', dot: 'bg-[#FF0033]', label: 'Anulada' },
  activa:     { cls: 'bg-[#EEF2FF] border-[#A5B4FC] text-[#0015FF]', dot: 'bg-[#0015FF]', label: 'Activa' },
}

function ModalDetalles({ r, onClose }) {
  const docs = (() => { try { return JSON.parse(r.documentos || '{}') } catch { return {} } })()
  const docEntries = Object.entries(docs).filter(([, url]) => !!url)
  const badge = ESTADO_BADGE[r.estado] || { cls: 'bg-[#F5F5F5] border-[#E0E0E0] text-[#6B6B6B]', dot: 'bg-[#AAAAAA]', label: r.estado }

  const lat = r.lat || r.ubicacion?.lat
  const lng = r.lng || r.ubicacion?.lng

  const clienteFields = [
    { label: 'CI / DNI',         val: r.ci },
    { label: 'Teléfono',         val: r.telefono },
    { label: 'Correo',           val: r.correo },
    { label: 'Fecha nacimiento', val: r.fecha_nacimiento },
    { label: 'Tipo de cliente',  val: r.tipo_cliente === 'extranjero' ? 'Extranjero' : 'Nacional' },
  ].filter(f => f.val)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E8E8E8] shrink-0">
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#AAAAAA]">Reserva #{r.id}</p>
            <h2 className="font-display text-[22px] font-black uppercase text-[#111] tracking-tight leading-none">{r.nombre}</h2>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] border px-3 py-1.5 ${badge.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badge.dot}`}></span>
              {badge.label}
            </span>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-[#E8E8E8] text-[#6B6B6B] hover:border-[#111] hover:text-[#111] transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── BODY (scrollable) ── */}
        <div className="overflow-y-auto flex-1">
          <div className="flex min-h-full">

            {/* ── SIDEBAR: datos del cliente ── */}
            <div className="w-52 shrink-0 bg-[#F4F5FF] border-r border-[#E0E2FF] p-5 flex flex-col gap-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#8890CC] mb-3">Cliente</p>
                <div className="flex flex-col gap-3.5">
                  {clienteFields.map(({ label, val }) => (
                    <div key={label}>
                      <p className="text-[8px] text-[#9AA0D0] uppercase tracking-[0.12em] mb-0.5">{label}</p>
                      <p className="text-[12px] text-[#111] font-semibold leading-snug break-all">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── MAIN: reserva + documentos ── */}
            <div className="flex-1 min-w-0 flex flex-col">

              {/* booking strip */}
              <div className="border-b border-[#E8E8E8] px-6 py-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#AAAAAA] mb-3">Detalles de la reserva</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { label: 'Vehículo',      val: [r.vehiculo, r.año].filter(Boolean).join(' ') || '—' },
                    { label: 'Anticipo',      val: r.monto ? `${Number(r.monto).toLocaleString('es-BO')} Bs` : '—' },
                    { label: 'Fecha ingreso', val: r.fecha_ingreso || r.fechaIngreso || '—' },
                    { label: 'Fecha entrega', val: r.fecha_entrega || r.fechaEntrega || '—' },
                    { label: 'Duración',      val: r.dias ? `${r.dias} días` : '—' },
                    { label: 'Ref. de pago',  val: r.ref_pago || '—' },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p className="text-[8px] text-[#AAAAAA] uppercase tracking-[0.12em] mb-0.5">{label}</p>
                      <p className="text-[13px] text-[#111] font-semibold">{val}</p>
                    </div>
                  ))}
                </div>

                {lat && (
                  <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0015FF] border border-[#0015FF]/25 px-3 py-1.5 hover:bg-[#EEF2FF] transition-colors">
                    <MapPin size={11} /> Ver ubicación en mapa
                  </a>
                )}
              </div>

              {/* documentos */}
              <div className="px-6 py-5 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#AAAAAA] mb-4">Documentos adjuntos</p>
                {docEntries.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {docEntries.map(([tipo, url]) => (
                      <a key={tipo} href={url} target="_blank" rel="noreferrer" className="group block">
                        <div className="border border-[#E8E8E8] group-hover:border-[#0015FF] transition-colors overflow-hidden bg-[#FAFAFA]">
                          <div className="relative" style={{ paddingBottom: '62%' }}>
                            <img src={url} alt={tipo}
                              className="absolute inset-0 w-full h-full object-cover"
                              onError={e => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextSibling.style.display = 'flex'
                              }}
                            />
                            <div className="hidden absolute inset-0 items-center justify-center bg-[#F5F5F5]">
                              <span className="text-[10px] text-[#0015FF] underline font-bold">Ver PDF</span>
                            </div>
                          </div>
                          <div className="px-2.5 py-1.5 border-t border-[#E8E8E8]">
                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6B6B6B]">{DOC_LABEL[tipo] || tipo}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-[#E0E0E0] py-10 text-center">
                    <p className="text-sm text-[#BBBBBB]">Sin documentos adjuntos</p>
                    <p className="text-[10px] text-[#CCCCCC] mt-1">La reserva fue creada antes de implementar esta función</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function ConfirmEliminar({ nombre, onConfirm, onCancel }) {
  const [texto, setTexto] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white border border-[#E8E8E8] w-full max-w-sm p-6">
        <h3 className="font-bold text-[#111] mb-1">¿Eliminar reserva?</h3>
        <p className="text-sm text-[#6B6B6B] mb-4">
          Esta acción moverá la reserva de <strong>{nombre}</strong> a la papelera. Escribe <strong>ELIMINAR</strong> para confirmar.
        </p>
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Escribe ELIMINAR"
          className="w-full border border-[#E8E8E8] px-3 py-2 text-sm focus:outline-none focus:border-[#FF0033] mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border border-[#E8E8E8] text-sm text-[#6B6B6B] hover:text-[#111]">Cancelar</button>
          <button
            onClick={onConfirm}
            disabled={texto !== 'ELIMINAR'}
            className="px-4 py-2 bg-[#FF0033] text-white text-sm font-bold disabled:opacity-40 hover:bg-[#CC0000]">
            Mover a papelera
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmForceDelete({ nombre, onConfirm, onCancel }) {
  const [texto, setTexto] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white border border-[#E8E8E8] w-full max-w-sm p-6">
        <h3 className="font-bold text-[#FF0033] mb-1">Eliminar permanentemente</h3>
        <p className="text-sm text-[#6B6B6B] mb-4">
          Se borrará <strong>{nombre}</strong> de forma irreversible. Escribe <strong>BORRAR</strong> para confirmar.
        </p>
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Escribe BORRAR"
          className="w-full border border-[#E8E8E8] px-3 py-2 text-sm focus:outline-none focus:border-[#FF0033] mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border border-[#E8E8E8] text-sm text-[#6B6B6B] hover:text-[#111]">Cancelar</button>
          <button
            onClick={onConfirm}
            disabled={texto !== 'BORRAR'}
            className="px-4 py-2 bg-[#FF0033] text-white text-sm font-bold disabled:opacity-40 hover:bg-[#CC0000]">
            Eliminar para siempre
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminReservas() {
  const [tab, setTab] = useState('pagadas')
  const [reservas,  setReservas]  = useState([])
  const [intentos,  setIntentos]  = useState([])
  const [papelera,  setPapelera]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [activas,   setActivas]   = useState(true)
  const [confirmEliminar,    setConfirmEliminar]    = useState(null)
  const [confirmForceDelete, setConfirmForceDelete] = useState(null)
  const [detalleReserva,     setDetalleReserva]     = useState(null)

  async function cargar() {
    setLoading(true)
    try {
      const [todas, ints] = await Promise.all([
        api.get('/admin/bigone/reservas?con_papelera=1'),
        api.get('/admin/bigone/intentos'),
      ])
      setReservas(todas.filter(r => !r.deleted_at))
      setPapelera(todas.filter(r => !!r.deleted_at))
      setIntentos(ints)
    } catch (e) {
      alert('No se pudo cargar reservas desde el servidor: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
    api.get('/settings').then(s => setActivas(s.reservas_activas)).catch(() => {})
  }, [])

  async function toggleReservas() {
    const nuevo = !activas
    setActivas(nuevo) // optimista
    try {
      await api.patch('/admin/settings', { reservas_activas: nuevo })
    } catch (e) {
      setActivas(!nuevo) // revertir si falla
      alert('No se pudo actualizar la configuración: ' + e.message)
    }
  }

  async function cambiarEstado(id, nuevoEstado) {
    await api.patch(`/admin/bigone/reservas/${id}`, { estado: nuevoEstado })
    cargar()
  }

  async function moverPapelera(id) {
    await api.delete(`/admin/bigone/reservas/${id}`)
    setConfirmEliminar(null)
    cargar()
  }

  async function restaurar(id) {
    await api.post(`/admin/bigone/reservas/${id}/restaurar`, {})
    cargar()
  }

  async function eliminarPermanente(id) {
    await api.delete(`/admin/bigone/reservas/${id}/forzar`)
    setConfirmForceDelete(null)
    cargar()
  }

  async function eliminarIntento(id) {
    await api.delete(`/admin/bigone/intentos/${id}`)
    cargar()
  }

  async function exportarCSV() {
    try {
      const token = localStorage.getItem('admin_token')
      const base  = import.meta.env.VITE_API_URL || '/api'
      const res   = await fetch(`${base}/admin/bigone/reservas/export`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Error al exportar')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = 'reservas_bigone.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('No se pudo exportar. Intenta de nuevo.')
    }
  }

  const pagadas     = reservas.filter(r => r.estado === 'pagada')
  const confirmadas = reservas.filter(r => r.estado === 'confirmada')
  const anuladas    = reservas.filter(r => r.estado === 'anulada')

  const counts = {
    pagadas:        pagadas.length,
    confirmadas:    confirmadas.length,
    anuladas:       anuladas.length,
    no_completadas: intentos.length,
    papelera:       papelera.length,
  }

  const lista = tab === 'pagadas'     ? pagadas
    : tab === 'confirmadas' ? confirmadas
    : tab === 'anuladas'    ? anuladas
    : tab === 'papelera'    ? papelera
    : intentos

  return (
    <div>
      {detalleReserva && <ModalDetalles r={detalleReserva} onClose={() => setDetalleReserva(null)} />}
      {confirmEliminar && (
        <ConfirmEliminar
          nombre={confirmEliminar.nombre}
          onConfirm={() => moverPapelera(confirmEliminar.id)}
          onCancel={() => setConfirmEliminar(null)}
        />
      )}
      {confirmForceDelete && (
        <ConfirmForceDelete
          nombre={confirmForceDelete.nombre}
          onConfirm={() => eliminarPermanente(confirmForceDelete.id)}
          onCancel={() => setConfirmForceDelete(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight">Reservas</h1>
        <div className="flex items-center gap-2">
          <button onClick={exportarCSV}
            className="flex items-center gap-2 border border-[#E8E8E8] text-[#6B6B6B] font-bold uppercase tracking-widest text-xs px-4 py-2.5 hover:text-[#111] hover:border-[#111] transition-all">
            <Download size={13} /> Exportar CSV
          </button>
          <button onClick={toggleReservas}
            className={`flex items-center gap-2 font-bold uppercase tracking-widest text-xs px-4 py-2.5 border transition-all
              ${activas
                ? 'bg-[#16a34a] border-[#16a34a] text-white hover:bg-[#15803d]'
                : 'bg-[#FF0033] border-[#FF0033] text-white hover:bg-[#CC0000]'}`}>
            <Power size={13} />
            {activas ? 'Reservas activas' : 'Reservas desactivadas'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-4 py-2 border transition-all
                ${active
                  ? 'bg-[#0015FF] border-[#0015FF] text-white'
                  : 'border-[#E8E8E8] text-[#6B6B6B] hover:border-[#0015FF]/30 hover:text-[#111]'}`}>
              <Icon size={12} />
              {t.label}
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-black
                ${active ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#6B6B6B]'}`}>
                {counts[t.key]}
              </span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="border border-[#E8E8E8] px-5 py-12 text-center text-[#6B6B6B] text-sm">Cargando...</div>
      ) : (
        <div className="border border-[#E8E8E8] overflow-x-auto">

          {/* PAGADAS / CONFIRMADAS / ANULADAS */}
          {(tab === 'pagadas' || tab === 'confirmadas' || tab === 'anuladas') && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
                  {['','Cliente','CI','Vehículo','Ingreso','Entrega','Días','Monto','Ubicación','Tipo','Fecha pago','Acción'].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lista.map(r => (
                  <tr key={r.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#F7F7F7] transition-colors">
                    <td className="px-2 py-3">
                      <button onClick={() => setDetalleReserva(r)}
                        className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#0015FF] border border-[#0015FF]/30 px-2 py-1 hover:bg-blue-50 transition-colors whitespace-nowrap">
                        <Eye size={10} /> Ver
                      </button>
                    </td>
                    <td className="px-3 py-3 font-semibold text-[#111] whitespace-nowrap">{r.nombre}</td>
                    <td className="px-3 py-3 text-[#6B6B6B]">{r.ci}</td>
                    <td className="px-3 py-3 text-[#6B6B6B] whitespace-nowrap">{[r.vehiculo, r.año].filter(Boolean).join(' ')}</td>
                    <td className="px-3 py-3 text-[#6B6B6B] whitespace-nowrap">{r.fecha_ingreso || r.fechaIngreso || '—'}</td>
                    <td className="px-3 py-3 text-[#6B6B6B] whitespace-nowrap">{r.fecha_entrega || r.fechaEntrega || '—'}</td>
                    <td className="px-3 py-3 text-[#6B6B6B]">{r.dias || '—'}</td>
                    <td className="px-3 py-3 font-bold text-[#0015FF] whitespace-nowrap">{Number(r.monto).toLocaleString('es-BO')} Bs</td>
                    <td className="px-3 py-3">
                      {r.lat ? (
                        <a href={`https://www.google.com/maps?q=${r.lat},${r.lng}`} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0015FF] hover:underline whitespace-nowrap">
                          <MapPin size={11} /> Ver mapa
                        </a>
                      ) : r.ubicacion?.lat ? (
                        <a href={`https://www.google.com/maps?q=${r.ubicacion.lat},${r.ubicacion.lng}`} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0015FF] hover:underline whitespace-nowrap">
                          <MapPin size={11} /> Ver mapa
                        </a>
                      ) : <span className="text-[#BBBBBB] text-[10px]">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest border border-[#0015FF]/20 text-[#0015FF] px-2 py-0.5 rounded-full">
                        {r.tipo_cliente === 'extranjero' ? 'Extranjero' : ORIGEN_LABEL[r.origen] || 'Reserva'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#6B6B6B] whitespace-nowrap text-xs">{fmtFecha(r.created_at || r.fecha)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {r.estado === 'pagada' && (
                          <>
                            <button onClick={() => cambiarEstado(r.id, 'confirmada')}
                              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#0015FF] border border-[#0015FF]/30 px-2 py-1 hover:bg-blue-50 transition-colors whitespace-nowrap">
                              <BadgeCheck size={11} /> Confirmar
                            </button>
                            <button onClick={() => cambiarEstado(r.id, 'anulada')}
                              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#FF0033] border border-[#FF0033]/30 px-2 py-1 hover:bg-red-50 transition-colors whitespace-nowrap">
                              <XCircle size={11} /> Anular
                            </button>
                          </>
                        )}
                        {r.estado === 'confirmada' && (
                          <button onClick={() => cambiarEstado(r.id, 'anulada')}
                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#FF0033] border border-[#FF0033]/30 px-2 py-1 hover:bg-red-50 transition-colors whitespace-nowrap">
                            <XCircle size={11} /> Anular
                          </button>
                        )}
                        {r.estado === 'anulada' && (
                          <button onClick={() => cambiarEstado(r.id, 'pagada')}
                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#16a34a] border border-green-200 px-2 py-1 hover:bg-green-50 transition-colors whitespace-nowrap">
                            <CheckCircle size={11} /> Restaurar
                          </button>
                        )}
                        <button onClick={() => setConfirmEliminar({ id: r.id, nombre: r.nombre })}
                          className="text-[#BBBBBB] hover:text-[#FF0033] transition-colors p-1">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* NO COMPLETADAS */}
          {tab === 'no_completadas' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
                  {['Cliente','CI','Vehículo','Etapa','Monto intentado','Ubicación','Tipo','Fecha intento','Acción'].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lista.map(i => (
                  <tr key={i.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#FFFBF0] transition-colors">
                    <td className="px-3 py-3 font-semibold text-[#111] whitespace-nowrap">{i.nombre}</td>
                    <td className="px-3 py-3 text-[#6B6B6B]">{i.ci}</td>
                    <td className="px-3 py-3 text-[#6B6B6B] whitespace-nowrap">{[i.vehiculo, i.año].filter(Boolean).join(' ')}</td>
                    <td className="px-3 py-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-[#FFF7E0] border border-[#F59E0B]/30 text-[#B45309] px-2 py-0.5 rounded-full">
                        {i.etapa || 'pago'}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-bold text-[#F59E0B] whitespace-nowrap">{Number(i.monto).toLocaleString('es-BO')} Bs</td>
                    <td className="px-3 py-3">
                      {i.lat ? (
                        <a href={`https://www.google.com/maps?q=${i.lat},${i.lng}`} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0015FF] hover:underline whitespace-nowrap">
                          <MapPin size={11} /> Ver mapa
                        </a>
                      ) : i.ubicacion?.lat ? (
                        <a href={`https://www.google.com/maps?q=${i.ubicacion.lat},${i.ubicacion.lng}`} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0015FF] hover:underline whitespace-nowrap">
                          <MapPin size={11} /> Ver mapa
                        </a>
                      ) : <span className="text-[#BBBBBB] text-[10px]">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest border border-[#F59E0B]/30 text-[#F59E0B] px-2 py-0.5 rounded-full">
                        {i.tipo_cliente === 'extranjero' ? 'Extranjero' : 'Nacional'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#6B6B6B] whitespace-nowrap text-xs">{fmtFecha(i.created_at || i.fecha)}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => eliminarIntento(i.id)}
                        className="text-[#BBBBBB] hover:text-[#FF0033] transition-colors p-1">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAPELERA */}
          {tab === 'papelera' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
                  {['Cliente','CI','Vehículo','Monto','Estado original','Eliminado','Acción'].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lista.map(r => (
                  <tr key={r.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#FFF5F5] transition-colors opacity-75">
                    <td className="px-3 py-3 font-semibold text-[#111] whitespace-nowrap">{r.nombre}</td>
                    <td className="px-3 py-3 text-[#6B6B6B]">{r.ci}</td>
                    <td className="px-3 py-3 text-[#6B6B6B] whitespace-nowrap">{[r.vehiculo, r.año].filter(Boolean).join(' ')}</td>
                    <td className="px-3 py-3 font-bold text-[#6B6B6B] whitespace-nowrap">{Number(r.monto).toLocaleString('es-BO')} Bs</td>
                    <td className="px-3 py-3">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border
                        ${r.estado === 'pagada' ? 'border-green-200 text-[#16a34a]' : 'border-red-200 text-[#FF0033]'}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#6B6B6B] text-xs whitespace-nowrap">{fmtFecha(r.deleted_at)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => restaurar(r.id)}
                          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#0015FF] border border-[#0015FF]/30 px-2 py-1 hover:bg-blue-50 transition-colors whitespace-nowrap">
                          <RotateCcw size={11} /> Restaurar
                        </button>
                        <button onClick={() => setConfirmForceDelete({ id: r.id, nombre: r.nombre })}
                          className="text-[#BBBBBB] hover:text-[#FF0033] transition-colors p-1">
                          <Trash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {lista.length === 0 && !loading && (
            <div className="px-5 py-12 text-center">
              <p className="text-[#6B6B6B] text-sm">
                {tab === 'pagadas'        && 'Sin reservas pagadas aún.'}
                {tab === 'confirmadas'    && 'Sin reservas confirmadas aún.'}
                {tab === 'anuladas'       && 'Sin reservas anuladas.'}
                {tab === 'no_completadas' && 'Sin intentos incompletos.'}
                {tab === 'papelera'       && 'La papelera está vacía.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
