import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { TrendingUp, ShieldCheck, ArrowDownLeft, ArrowUpRight, Plus, X, Check, ChevronDown } from 'lucide-react'

const ESTADO_GARANTIA = {
  retenida: { label: 'Retenida',  cls: 'bg-yellow-400/15 text-yellow-600' },
  devuelta: { label: 'Devuelta',  cls: 'bg-green-400/15 text-green-600'   },
  parcial:  { label: 'Parcial',   cls: 'bg-blue-400/15 text-[#0015FF]'         },
}

const inputCls = "w-full border border-[#E8E8E8] rounded-lg text-sm px-3 py-2 focus:outline-none focus:border-[#FF0033] bg-white"

function KPI({ icon: Icon, label, value, sub, color = 'text-[#FF0033]' }) {
  return (
    <div className="bg-white border border-[#E8E8E8] p-5">
      <Icon size={18} className={`${color} mb-3`} strokeWidth={1.5} />
      <div className={`font-display text-2xl font-black ${color}`}>{value}</div>
      <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mt-1">{label}</div>
      {sub && <div className="text-[10px] text-[#6B6B6B] mt-0.5">{sub}</div>}
    </div>
  )
}

function fmt(n) { return Number(n || 0).toLocaleString('es-BO') + ' Bs' }

export default function Finanzas() {
  const [tab, setTab]           = useState('ingresos')
  const [resumen, setResumen]   = useState(null)
  const [ingresos, setIngresos] = useState([])
  const [garantias, setGarantias] = useState([])
  const [loading, setLoading]   = useState(true)

  // modal nueva garantía
  const [modalG, setModalG]     = useState(false)
  const [formG, setFormG]       = useState({ cliente_nombre:'', vehiculo:'', monto:'', fecha_recibido:'', notas:'' })
  const [savingG, setSavingG]   = useState(false)

  // modal devolver
  const [modalDev, setModalDev] = useState(null)
  const [formDev, setFormDev]   = useState({ monto_devuelto:'', fecha_devuelto:'', notas:'' })

  async function load() {
    setLoading(true)
    const [r, ing, gar] = await Promise.all([
      api.get('/admin/finanzas/resumen').catch(() => ({})),
      api.get('/admin/finanzas/ingresos').catch(() => []),
      api.get('/admin/finanzas/garantias').catch(() => []),
    ])
    setResumen(r)
    setIngresos(Array.isArray(ing) ? ing : [])
    setGarantias(Array.isArray(gar) ? gar : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function guardarGarantia() {
    setSavingG(true)
    await api.post('/admin/finanzas/garantias', formG).catch(console.error)
    setModalG(false)
    setFormG({ cliente_nombre:'', vehiculo:'', monto:'', fecha_recibido:'', notas:'' })
    setSavingG(false)
    load()
  }

  async function devolver() {
    await api.patch(`/admin/finanzas/garantias/${modalDev.id}`, formDev).catch(console.error)
    setModalDev(null)
    setFormDev({ monto_devuelto:'', fecha_devuelto:'', notas:'' })
    load()
  }

  async function eliminarGarantia(id) {
    if (!confirm('¿Eliminar este registro?')) return
    await api.delete(`/admin/finanzas/garantias/${id}`).catch(console.error)
    load()
  }

  const tabs = [
    { id: 'ingresos',  label: 'Ingresos del servicio' },
    { id: 'garantias', label: 'Control de garantías'  },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight">Finanzas</h1>

      {/* KPIs */}
      {resumen && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI icon={TrendingUp}    label="Ingresos totales"   value={fmt(resumen.ingresos_total)}      sub="reservas activas + completadas" />
          <KPI icon={TrendingUp}    label="Ingresos este mes"  value={fmt(resumen.ingresos_mes)}        sub={new Date().toLocaleString('es-BO',{month:'long'})} color="text-[#0015FF]" />
          <KPI icon={ArrowDownLeft} label="Garantías retenidas" value={fmt(resumen.garantias_saldo)}   sub="saldo actual en caja"           color="text-yellow-600" />
          <KPI icon={ShieldCheck}   label="Garantías devueltas" value={fmt(resumen.garantias_devueltas)} sub="total retornado a clientes"   color="text-green-600" />
        </div>
      )}

      {/* tabs */}
      <div className="flex gap-1 border-b border-[#E8E8E8]">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors border-b-2 -mb-px
              ${tab === t.id ? 'border-[#FF0033] text-[#FF0033]' : 'border-transparent text-[#6B6B6B] hover:text-[#111]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm">Cargando...</div>
      ) : tab === 'ingresos' ? (

        /* ── INGRESOS ── */
        <div className="border border-[#E8E8E8] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E8E8]">
                {['#','Cliente','Vehículo','Desde','Hasta','Días','Tipo','Total','Estado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ingresos.map(r => (
                <tr key={r.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#F7F7F7]">
                  <td className="px-4 py-3 text-[#6B6B6B]">{r.id}</td>
                  <td className="px-4 py-3 text-[#111] font-medium whitespace-nowrap">{r.cliente}</td>
                  <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">{r.vehiculo}</td>
                  <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">{r.fecha_inicio}</td>
                  <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">{r.fecha_fin}</td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{r.dias}</td>
                  <td className="px-4 py-3 text-[#6B6B6B] capitalize">{r.tipo}</td>
                  <td className="px-4 py-3 text-[#FF0033] font-bold whitespace-nowrap">{fmt(r.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                      ${r.estado === 'completada' ? 'bg-green-100 text-green-700' : 'bg-[#0015FF]/20 text-[#0015FF]'}`}>
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ingresos.length === 0 && (
            <div className="px-5 py-8 text-[#6B6B6B] text-sm">Sin ingresos registrados aún.</div>
          )}
        </div>

      ) : (

        /* ── GARANTÍAS ── */
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button onClick={() => setModalG(true)}
              className="flex items-center gap-2 bg-[#FF0033] text-white font-bold uppercase tracking-widest text-xs px-4 py-2.5 rounded-lg hover:bg-[#CC0000]">
              <Plus size={14} /> Nueva garantía
            </button>
          </div>

          <div className="border border-[#E8E8E8] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E8E8]">
                  {['Cliente','Vehículo','Monto recibido','Fecha entrada','Monto devuelto','Fecha salida','Estado',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {garantias.map(g => (
                  <tr key={g.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#F7F7F7]">
                    <td className="px-4 py-3 text-[#111] font-medium whitespace-nowrap">{g.cliente_nombre}</td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{g.vehiculo}</td>
                    <td className="px-4 py-3 text-[#FF0033] font-bold whitespace-nowrap">{fmt(g.monto)}</td>
                    <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">{g.fecha_recibido}</td>
                    <td className="px-4 py-3 text-green-600 font-bold whitespace-nowrap">
                      {g.monto_devuelto > 0 ? fmt(g.monto_devuelto) : '—'}
                    </td>
                    <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">{g.fecha_devuelto || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${ESTADO_GARANTIA[g.estado]?.cls}`}>
                        {ESTADO_GARANTIA[g.estado]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {g.estado !== 'devuelta' && (
                          <button onClick={() => { setModalDev(g); setFormDev({ monto_devuelto: g.monto, fecha_devuelto: new Date().toISOString().split('T')[0], notas:'' }) }}
                            className="text-[10px] text-[#0015FF] hover:underline font-bold whitespace-nowrap">
                            Devolver
                          </button>
                        )}
                        <button onClick={() => eliminarGarantia(g.id)} className="text-[#6B6B6B] hover:text-[#FF0033]">
                          <X size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {garantias.length === 0 && (
              <div className="px-5 py-8 text-[#6B6B6B] text-sm">Sin garantías registradas. Agrega la primera.</div>
            )}
          </div>
        </div>
      )}

      {/* Modal nueva garantía */}
      {modalG && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white border border-[#E8E8E8] rounded-md w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
              <h2 className="font-display uppercase text-[#111] tracking-wide">Registrar garantía</h2>
              <button onClick={() => setModalG(false)} className="text-[#6B6B6B] hover:text-[#111]"><X size={18}/></button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {[
                { key:'cliente_nombre', label:'Cliente', placeholder:'Nombre completo' },
                { key:'vehiculo',       label:'Vehículo', placeholder:'Toyota RAV4' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-1">{f.label}</label>
                  <input value={formG[f.key]} onChange={e => setFormG(p => ({...p, [f.key]: e.target.value}))}
                    placeholder={f.placeholder} className={inputCls} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-1">Monto (Bs)</label>
                  <input type="number" value={formG.monto} onChange={e => setFormG(p => ({...p, monto: e.target.value}))} className={inputCls} />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-1">Fecha recibido</label>
                  <input type="date" value={formG.fecha_recibido} onChange={e => setFormG(p => ({...p, fecha_recibido: e.target.value}))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-1">Notas</label>
                <textarea value={formG.notas} onChange={e => setFormG(p => ({...p, notas: e.target.value}))}
                  rows={2} className={inputCls + ' resize-none'} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-[#E8E8E8]">
              <button onClick={() => setModalG(false)} className="px-4 py-2 border border-[#E8E8E8] text-[#6B6B6B] text-sm rounded-lg hover:text-[#111]">Cancelar</button>
              <button onClick={guardarGarantia} disabled={savingG}
                className="px-4 py-2 bg-[#FF0033] text-white font-bold text-sm rounded-lg hover:bg-[#CC0000] disabled:opacity-50">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal devolver garantía */}
      {modalDev && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white border border-[#E8E8E8] rounded-md w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
              <h2 className="font-display uppercase text-[#111] tracking-wide">Devolver garantía</h2>
              <button onClick={() => setModalDev(null)} className="text-[#6B6B6B] hover:text-[#111]"><X size={18}/></button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <p className="text-sm text-[#6B6B6B]">
                Cliente: <strong className="text-[#111]">{modalDev.cliente_nombre}</strong> · Recibido: <strong className="text-[#FF0033]">{fmt(modalDev.monto)}</strong>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-1">Monto devuelto (Bs)</label>
                  <input type="number" value={formDev.monto_devuelto} onChange={e => setFormDev(p => ({...p, monto_devuelto: e.target.value}))} className={inputCls} />
                </div>
                <div>
                  <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-1">Fecha devolución</label>
                  <input type="date" value={formDev.fecha_devuelto} onChange={e => setFormDev(p => ({...p, fecha_devuelto: e.target.value}))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-1">Notas</label>
                <textarea value={formDev.notas} onChange={e => setFormDev(p => ({...p, notas: e.target.value}))}
                  rows={2} className={inputCls + ' resize-none'} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-[#E8E8E8]">
              <button onClick={() => setModalDev(null)} className="px-4 py-2 border border-[#E8E8E8] text-[#6B6B6B] text-sm rounded-lg hover:text-[#111]">Cancelar</button>
              <button onClick={devolver}
                className="px-4 py-2 bg-[#0015FF] text-white font-bold text-sm rounded-lg hover:bg-[#1618AA]">
                Confirmar devolución
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
