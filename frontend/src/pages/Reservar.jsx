import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { Check, Car, ArrowRight, MessageCircle } from 'lucide-react'

const PASOS = ['Vehículo', 'Fechas', 'Tus datos', 'Confirmación']

function Paso({ n, label, actual }) {
  const done = actual > n
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors
        ${actual === n ? 'bg-[#0015FF] border-[#0015FF] text-white'
        : done          ? 'bg-[#0015FF]/10 border-[#0015FF]/30 text-[#0015FF]'
        :                 'border-[#E8E8E8] text-[#6B6B6B]'}`}>
        {done ? <Check size={12} /> : n}
      </div>
      <span className={`text-[10px] uppercase tracking-[0.22em] font-bold hidden sm:block
        ${actual === n ? 'text-[#111]' : done ? 'text-[#0015FF]' : 'text-[#6B6B6B]'}`}>
        {label}
      </span>
    </div>
  )
}

function InputField({ label, children }) {
  return (
    <div>
      <label className="section-label block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full border border-[#E8E8E8] rounded-md text-sm px-3.5 py-2.5 text-[#111] focus:outline-none focus:border-[#0015FF] transition-colors bg-white"

export default function Reservar() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const [paso, setPaso]     = useState(1)
  const [vehiculos, setVehiculos] = useState([])
  const [sel, setSel]       = useState(null)
  const [fechas, setFechas] = useState({ inicio: '', fin: '', tipo: 'urbano' })
  const [cliente, setCliente] = useState({ nombre:'', apellido:'', ci:'', telefono:'', email:'', direccion:'' })
  const [enviando, setEnviando] = useState(false)
  const [reservaId, setReservaId] = useState(null)
  const [error, setError]   = useState('')

  useEffect(() => {
    api.get('/vehiculos').then(d => {
      const lista = d.data || d
      setVehiculos(lista)
      const vid = params.get('vehiculo')
      if (vid) {
        const v = lista.find(x => String(x.id) === String(vid))
        if (v) { setSel(v); setPaso(2) }
      }
    }).catch(() => {
      setError('No se pudo cargar el catálogo de vehículos. Verifica tu conexión o contáctanos por WhatsApp.')
    })
  }, [])

  function calcDias() {
    if (!fechas.inicio || !fechas.fin) return 0
    return Math.max(0, Math.round((new Date(fechas.fin) - new Date(fechas.inicio)) / 86400000))
  }

  const dias  = calcDias()
  const total = sel ? dias * sel.precio_diario : 0

  async function confirmar() {
    setEnviando(true); setError('')
    try {
      const d = await api.post('/reservas', {
        vehiculo_id: sel.id,
        fecha_inicio: fechas.inicio,
        fecha_fin: fechas.fin,
        tipo_uso: fechas.tipo,
        cliente,
      })
      setReservaId(d.id || d.reserva?.id)
      setPaso(4)
    } catch(e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className=" bg-[#FFE600] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">

        <p className="section-label mb-3">Big One Rent a Car</p>
        <h1 className="font-display text-5xl uppercase text-[#111] tracking-tight mb-10">
          Reservar vehículo
        </h1>

        {/* stepper */}
        <div className="flex items-center gap-2 mb-10 flex-wrap">
          {PASOS.map((l, i) => (
            <div key={l} className="flex items-center gap-2">
              <Paso n={i+1} label={l} actual={paso} />
              {i < PASOS.length - 1 && <div className="w-5 h-px bg-[#E8E8E8]" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-[#E8E8E8] p-6 shadow-card">

          {/* PASO 1 */}
          {paso === 1 && (
            <div>
              <p className="text-sm text-[#6B6B6B] mb-5">Elige el vehículo que deseas alquilar.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {vehiculos.filter(v => v.disponible).map(v => (
                  <button key={v.id} onClick={() => { setSel(v); setPaso(2) }}
                    className="text-left border border-[#E8E8E8] rounded-md p-4 hover:border-[#0015FF] transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-md bg-[#0015FF]/10 flex items-center justify-center">
                        <Car size={16} className="text-[#0015FF]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#111]">{v.modelo}</div>
                        <div className="text-[11px] text-[#6B6B6B]">{v.año} · {v.transmision}</div>
                      </div>
                    </div>
                    <div className="font-display text-2xl text-[#0015FF]">
                      {v.precio_diario} Bs
                      <span className="text-[11px] text-[#6B6B6B] font-sans font-normal ml-1">/día</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {paso === 2 && sel && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 bg-[#0015FF]/10 rounded-md p-4">
                <Car size={18} className="text-[#0015FF]" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#111]">{sel.modelo} {sel.año && `(${sel.año})`}</div>
                  <div className="text-[11px] text-[#0015FF] font-bold">{sel.precio_diario} Bs/día</div>
                </div>
                <button onClick={() => { setSel(null); setPaso(1) }}
                  className="text-[11px] text-[#6B6B6B] hover:text-[#111] underline">cambiar</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Fecha de inicio">
                  <input type="date" value={fechas.inicio}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setFechas(f => ({ ...f, inicio: e.target.value }))}
                    className={inputCls} />
                </InputField>
                <InputField label="Fecha de devolución">
                  <input type="date" value={fechas.fin}
                    min={fechas.inicio || new Date().toISOString().split('T')[0]}
                    onChange={e => setFechas(f => ({ ...f, fin: e.target.value }))}
                    className={inputCls} />
                </InputField>
              </div>
              <InputField label="Tipo de uso">
                <div className="flex gap-2">
                  {['urbano','viaje'].map(t => (
                    <button key={t} onClick={() => setFechas(f => ({ ...f, tipo: t }))}
                      className={`flex-1 py-2.5 rounded-md border text-sm font-medium capitalize transition-colors
                        ${fechas.tipo === t ? 'bg-[#0015FF] border-[#0015FF] text-white' : 'border-[#E8E8E8] text-[#6B6B6B] hover:border-[#0015FF]'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </InputField>
              {dias > 0 && (
                <div className="flex items-center justify-between bg-[#FFE600] rounded-md px-4 py-3">
                  <span className="text-sm text-[#6B6B6B]">{dias} día{dias > 1 ? 's' : ''}</span>
                  <span className="font-display text-2xl text-[#111]">{total.toLocaleString('es-BO')} Bs</span>
                </div>
              )}
              <button onClick={() => setPaso(3)} disabled={dias < 3}
                className="btn-blue w-full justify-center !py-3 disabled:opacity-40">
                {dias > 0 && dias < 3 ? 'Mínimo 3 días' : 'Continuar'} <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* PASO 3 */}
          {paso === 3 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#6B6B6B] mb-1">Completa tus datos para confirmar.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Nombre"><input value={cliente.nombre} onChange={e => setCliente(c => ({...c, nombre: e.target.value}))} className={inputCls} /></InputField>
                <InputField label="Apellido"><input value={cliente.apellido} onChange={e => setCliente(c => ({...c, apellido: e.target.value}))} className={inputCls} /></InputField>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Cédula de identidad"><input value={cliente.ci} onChange={e => setCliente(c => ({...c, ci: e.target.value}))} className={inputCls} /></InputField>
                <InputField label="Teléfono / WhatsApp"><input value={cliente.telefono} onChange={e => setCliente(c => ({...c, telefono: e.target.value}))} className={inputCls} /></InputField>
              </div>
              <InputField label="Email (opcional)"><input type="email" value={cliente.email} onChange={e => setCliente(c => ({...c, email: e.target.value}))} className={inputCls} /></InputField>
              <InputField label="Dirección"><input value={cliente.direccion} onChange={e => setCliente(c => ({...c, direccion: e.target.value}))} className={inputCls} /></InputField>

              {/* resumen */}
              <div className="bg-[#FFE600] rounded-md p-4 text-sm flex flex-col gap-2 mt-1">
                <div className="flex justify-between text-[#6B6B6B]"><span>Vehículo</span><span className="text-[#111] font-medium">{sel?.modelo}</span></div>
                <div className="flex justify-between text-[#6B6B6B]"><span>Fechas</span><span className="text-[#111]">{fechas.inicio} → {fechas.fin}</span></div>
                <div className="flex justify-between font-bold border-t border-[#E8E8E8] pt-2 mt-1">
                  <span className="text-[#6B6B6B]">Total estimado</span>
                  <span className="font-display text-2xl text-[#0015FF]">{total.toLocaleString('es-BO')} Bs</span>
                </div>
              </div>

              {error && <p className="text-[#0015FF] text-xs">{error}</p>}
              <button onClick={confirmar} disabled={enviando || !cliente.nombre || !cliente.ci || !cliente.telefono}
                className="btn-primary w-full justify-center !py-3 disabled:opacity-40">
                {enviando ? 'Enviando...' : 'Confirmar reserva'} <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* PASO 4 */}
          {paso === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#0015FF]/10 flex items-center justify-center mx-auto mb-6">
                <Check size={28} className="text-[#0015FF]" />
              </div>
              <h2 className="font-display text-4xl uppercase text-[#111] mb-3">¡Reserva recibida!</h2>
              <p className="text-sm text-[#6B6B6B] mb-2">Reserva #{reservaId} enviada. Un asesor te contactará para confirmarla.</p>
              <p className="text-sm text-[#6B6B6B] mb-8">Puedes escribirnos por WhatsApp para acelerar el proceso.</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <a href="https://wa.me/59167666665" target="_blank" rel="noreferrer" className="btn-primary">
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <button onClick={() => navigate('/catalogo')} className="btn-ghost">Ver más vehículos</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
