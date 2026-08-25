import { useState, useEffect, useRef } from 'react'
import { ShieldCheck, Trash2, Check, Clock, RotateCcw, Image } from 'lucide-react'
import { api } from '../../lib/api'

const ESTADO_CFG = {
  pendiente:  { label: 'Pendiente',  cls: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
  verificada: { label: 'Verificada', cls: 'bg-green-50 border-green-300 text-[#16a34a]' },
  devuelta:   { label: 'Devuelta',   cls: 'bg-[#F0F0F0] border-[#E0E0E0] text-[#6B6B6B]' },
}

function fmtFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-BO', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function ModalComprobante({ url, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div className="relative max-w-xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-8 right-0 text-white/80 hover:text-white text-sm font-bold uppercase tracking-widest">
          Cerrar ✕
        </button>
        <img src={url} alt="Comprobante" className="w-full rounded-lg shadow-2xl max-h-[80vh] object-contain bg-white"
          onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='block' }} />
        <div className="hidden text-center text-white py-8">
          <a href={url} target="_blank" rel="noreferrer" className="underline text-sm">Abrir archivo (PDF)</a>
        </div>
      </div>
    </div>
  )
}

export default function AdminGarantias() {
  const [garantias,   setGarantias]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [busqueda,    setBusqueda]    = useState('')
  const [verImg,      setVerImg]      = useState(null)

  async function cargar() {
    setLoading(true)
    try {
      const data = await api.get('/admin/bigone/garantias')
      setGarantias(data.data || data)
    } catch {
      setGarantias([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  async function cambiarEstado(id, estado) {
    try {
      await api.patch(`/admin/bigone/garantias/${id}`, { estado })
      cargar()
    } catch {}
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar este registro de garantía?')) return
    try {
      await api.delete(`/admin/bigone/garantias/${id}`)
      cargar()
    } catch {}
  }

  const lista = garantias.filter(g =>
    !busqueda ||
    `${g.nombre} ${g.ci} ${g.vehiculo} ${g.telefono}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const counts = {
    pendiente:  garantias.filter(g => g.estado === 'pendiente').length,
    verificada: garantias.filter(g => g.estado === 'verificada').length,
    devuelta:   garantias.filter(g => g.estado === 'devuelta').length,
  }

  return (
    <div>
      {verImg && <ModalComprobante url={verImg} onClose={() => setVerImg(null)} />}

      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck size={22} className="text-[#0015FF]" strokeWidth={1.5} />
        <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight">Garantías</h1>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pendientes',  count: counts.pendiente,  color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Verificadas', count: counts.verificada, color: 'text-[#16a34a]',  bg: 'bg-green-50'  },
          { label: 'Devueltas',   count: counts.devuelta,   color: 'text-[#6B6B6B]',  bg: 'bg-[#F7F7F7]' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-[#E8E8E8] rounded-lg px-4 py-3`}>
            <p className={`font-display text-3xl leading-none ${s.color}`}>{s.count}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6B6B] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* busqueda */}
      <div className="relative max-w-sm mb-5">
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, CI, vehículo..."
          className="w-full border border-[#E8E8E8] text-sm px-3 py-2.5 text-[#111] focus:outline-none focus:border-[#0015FF]" />
      </div>

      {loading ? (
        <div className="text-sm text-[#6B6B6B] py-8">Cargando...</div>
      ) : (
        <div className="border border-[#E8E8E8] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
                {['CI','Nombre','Vehículo','Teléfono','Monto','Comprobante','Estado','Fecha','Acción'].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lista.map(g => {
                const est = ESTADO_CFG[g.estado] || ESTADO_CFG.pendiente
                return (
                  <tr key={g.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#F7F7F7] transition-colors">
                    <td className="px-3 py-3 font-mono font-bold text-[#0015FF]">{g.ci}</td>
                    <td className="px-3 py-3 text-[#111] font-medium whitespace-nowrap">{g.nombre}</td>
                    <td className="px-3 py-3 text-[#6B6B6B] whitespace-nowrap">{g.vehiculo || '—'}</td>
                    <td className="px-3 py-3 text-[#6B6B6B]">{g.telefono || '—'}</td>
                    <td className="px-3 py-3 font-bold text-[#0015FF] whitespace-nowrap">
                      {g.monto ? `${Number(g.monto).toLocaleString('es-BO')} Bs` : '—'}
                    </td>
                    <td className="px-3 py-3">
                      {g.comprobante_url ? (
                        <button onClick={() => setVerImg(g.comprobante_url)}
                          className="flex items-center gap-1 text-[10px] font-bold text-[#0015FF] border border-[#0015FF]/30 px-2 py-1 hover:bg-blue-50 transition-colors whitespace-nowrap">
                          <Image size={11} /> Ver foto
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#BBBBBB]">Sin comprobante</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[9px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded-full ${est.cls}`}>
                        {est.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#6B6B6B] text-xs whitespace-nowrap">{fmtFecha(g.created_at)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        {g.estado === 'pendiente' && (
                          <button onClick={() => cambiarEstado(g.id, 'verificada')}
                            className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#16a34a] border border-green-200 px-2 py-1 hover:bg-green-50 transition-colors whitespace-nowrap">
                            <Check size={10} /> Verificar
                          </button>
                        )}
                        {g.estado === 'verificada' && (
                          <button onClick={() => cambiarEstado(g.id, 'devuelta')}
                            className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#6B6B6B] border border-[#E8E8E8] px-2 py-1 hover:bg-[#F7F7F7] transition-colors whitespace-nowrap">
                            <RotateCcw size={10} /> Devuelta
                          </button>
                        )}
                        {g.estado === 'devuelta' && (
                          <button onClick={() => cambiarEstado(g.id, 'pendiente')}
                            className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-yellow-600 border border-yellow-200 px-2 py-1 hover:bg-yellow-50 transition-colors whitespace-nowrap">
                            <Clock size={10} /> Reactivar
                          </button>
                        )}
                        <button onClick={() => eliminar(g.id)}
                          className="text-[#CCCCCC] hover:text-[#FF0033] transition-colors p-1">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {lista.length === 0 && !loading && (
            <div className="px-5 py-10 text-center text-[#6B6B6B] text-sm">
              {busqueda ? 'Sin resultados.' : 'Sin garantías recibidas aún.'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
