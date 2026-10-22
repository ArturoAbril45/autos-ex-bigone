import { useState, useRef } from 'react'
import { Search, Car, QrCode, Upload, X, Check } from 'lucide-react'
import { useVehiculos } from '../hooks/useVehiculos'

const inputCls = "w-full border border-[#E8E8E8] text-sm px-4 py-3 text-[#111] focus:outline-none focus:border-[#0015FF] transition-colors bg-white placeholder:text-[#BBBBBB]"
const LIBELULA_APPKEY = '26916565-3b0e-359c-cf11-cfc014a6d31e'
const API_URL = import.meta.env.VITE_API_URL || '/api'

/* ── QR info del modal de reserva (misma cuenta) ── */
function PagoQR({ cliente, onExito, onCancelar }) {
  const [archivo,  setArchivo]  = useState(null)
  const [preview,  setPreview]  = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error,    setError]    = useState('')
  const fileRef = useRef()

  function seleccionar(file) {
    if (!file) return
    setArchivo(file)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  async function confirmar() {
    setSubiendo(true)
    setError('')
    try {
      let comprobanteUrl = null
      if (archivo) {
        const fd = new FormData()
        fd.append('doc', archivo)
        const up = await fetch(`${API_URL}/bigone/upload-doc`, { method: 'POST', body: fd })
        const upData = await up.json()
        comprobanteUrl = upData.url || null
      }
      // Registrar el pago de saldo en bigone_garantias con monto del pendiente
      await fetch(`${API_URL}/bigone/garantias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ci:              cliente.ci,
          nombre:          cliente.nombre,
          vehiculo:        cliente.vehiculo,
          telefono:        cliente.telefono,
          monto:           cliente.monto_pendiente,
          comprobante_url: comprobanteUrl,
          tipo:            'saldo',
        }),
      })
      onExito()
    } catch {
      setError('Error al registrar. Intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <div className="shrink-0">
          <img src="/images/qr-garantia.png" alt="QR Pago"
            className="w-40 h-40 object-contain block rounded border border-[#E8E8E8]"
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }} />
          <div className="w-40 h-40 items-center justify-center flex-col gap-1 text-center hidden border border-dashed border-[#DDD] rounded">
            <QrCode size={28} className="text-[#CCCCCC]" />
            <span className="text-[9px] text-[#AAAAAA]">qr-garantia.png</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div>
            <p className="text-[9px] text-[#AAAAAA] uppercase tracking-wider">A nombre de</p>
            <p className="font-bold text-[#111] text-sm leading-tight">CHIOCI JAIME KIYUNA TRIGO</p>
            <p className="text-xs text-[#6B6B6B]">Cta. <span className="font-semibold text-[#111]">1000929278</span></p>
          </div>
          <div className="border-t border-[#E8E8E8] pt-2">
            <p className="text-[9px] text-[#AAAAAA] uppercase tracking-wider">Concepto</p>
            <p className="text-xs font-bold text-[#111]">SALDO ALQUILER BIG ONE</p>
          </div>
          <div className="border-t border-[#E8E8E8] pt-2">
            <p className="text-[9px] text-[#AAAAAA] uppercase tracking-wider">Monto a depositar</p>
            <p className="font-bold text-[#0015FF] text-2xl leading-none">{cliente.monto_pendiente} Bs</p>
          </div>
        </div>
      </div>

      {/* comprobante opcional */}
      <div>
        <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest mb-2">Subir comprobante (opcional)</p>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden"
          onChange={e => seleccionar(e.target.files[0])} />
        {preview ? (
          <div className="relative">
            <img src={preview} alt="comprobante" className="w-full max-h-36 object-contain border border-[#E8E8E8] rounded bg-[#FAFAFA]" />
            <button onClick={() => { setArchivo(null); setPreview(null) }}
              className="absolute top-1 right-1 w-5 h-5 bg-[#FF0033] text-white rounded-full flex items-center justify-center">
              <X size={9} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current.click()}
            className="w-full border border-dashed border-[#E0E0E0] hover:border-[#0015FF] rounded py-4 flex items-center justify-center gap-2 text-[#AAAAAA] hover:text-[#0015FF] transition-all text-[11px]">
            <Upload size={16} /> Seleccionar imagen o PDF
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-[#FF0033]">{error}</p>}

      <div className="flex gap-2">
        <button onClick={confirmar} disabled={subiendo}
          className="flex-1 bg-[#0015FF] hover:bg-[#0010CC] disabled:opacity-50 text-white font-bold uppercase tracking-[0.12em] text-[10px] py-2.5 rounded transition-all flex items-center justify-center gap-2">
          {subiendo
            ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Registrando…</>
            : <><Check size={12} /> Ya pagué · Confirmar</>}
        </button>
        <button onClick={onCancelar}
          className="flex-1 border border-[#E8E8E8] text-[#6B6B6B] hover:border-[#FF0033] hover:text-[#FF0033] font-bold uppercase tracking-[0.12em] text-[10px] py-2.5 rounded transition-all">
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function PagoServicios() {
  const vehiculos = useVehiculos()

  const [ci,       setCi]       = useState('')
  const [buscando, setBuscando] = useState(false)
  const [cliente,  setCliente]  = useState(null)
  const [error,    setError]    = useState('')
  const [pagando,  setPagando]  = useState(false)
  const [paso,     setPaso]     = useState('buscar') // 'buscar' | 'resultado' | 'qr' | 'exitoso'

  async function buscar() {
    if (!ci.trim()) return
    setBuscando(true)
    setError('')
    setCliente(null)
    setPaso('buscar')
    try {
      const res  = await fetch(`${API_URL}/bigone/cliente?ci=${encodeURIComponent(ci.trim())}`)
      const data = await res.json()
      if (!res.ok || data.error) {
        setError('No se encontró ninguna reserva con ese CI. Asegúrate de haber completado tu reserva primero.')
      } else {
        setCliente(data)
        setPaso('resultado')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setBuscando(false)
    }
  }

  async function pagarConLibelula() {
    if (!cliente?.monto_pendiente) return
    setPagando(true)
    setError('')
    const monto = Number(cliente.monto_pendiente)
    const identificador = String(Date.now())
    try {
      const res = await fetch('https://api.todotix.com/rest/deuda/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appkey: LIBELULA_APPKEY,
          email_cliente: 'reservas@bigonerentacar.com',
          identificador,
          callback_url: 'https://bigonerentacar.online/reserva-exitosa',
          url_retorno:  'https://bigonerentacar.online/reserva-exitosa',
          descripcion:   `Saldo alquiler ${cliente.vehiculo} - Big One Rent a Car`,
          nombre_cliente: cliente.nombre,
          emite_factura: 0,
          lineas_detalle_deuda: [{
            nro_linea: 1,
            concepto:  `Saldo alquiler ${cliente.vehiculo} - Big One Rent a Car`,
            cantidad: 1,
            costo_unitario: monto,
            descuento: 0,
          }],
        }),
      })
      const data = await res.json()
      if (data.url_pasarela_pagos) {
        window.location.href = data.url_pasarela_pagos
      } else {
        setError(data.mensaje || 'Error al procesar el pago. Intenta de nuevo.')
        setPagando(false)
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setPagando(false)
    }
  }

  function nueva() {
    setCi('')
    setCliente(null)
    setError('')
    setPagando(false)
    setPaso('buscar')
  }

  const esNacional = !cliente || cliente.tipo_cliente !== 'extranjero'

  const vehiculoInfo = cliente
    ? vehiculos.find(v => cliente.vehiculo && cliente.vehiculo.toLowerCase().includes(v.modelo.toLowerCase()))
    : null

  return (
    <main className=" min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-14 py-14">

        <p className="section-label mb-3 text-[#0015FF]">Portal de pagos</p>
        <h1 className="font-display text-6xl uppercase text-[#111] tracking-tight leading-none mb-3">
          Pago de servicios
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-10">
          Ingresa tu CI para consultar tu alquiler y realizar el pago del saldo restante.
        </p>

        {/* buscador */}
        <div className="flex gap-0 max-w-md mb-8">
          <input
            value={ci}
            onChange={e => { setCi(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && buscar()}
            placeholder="Ingresa tu CI"
            className={inputCls + ' rounded-none border-r-0'}
          />
          <button onClick={buscar} disabled={!ci.trim() || buscando}
            className="shrink-0 bg-[#0015FF] hover:bg-[#0010CC] disabled:opacity-50 text-white px-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all">
            {buscando
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Search size={15} />}
          </button>
        </div>

        {error && (
          <div className="max-w-md bg-red-50 border border-[#FF0033]/20 px-4 py-3 text-[12px] text-[#FF0033] mb-6">
            {error}
          </div>
        )}

        {/* ── EXITOSO ── */}
        {paso === 'exitoso' && (
          <div className="max-w-md">
            <div className="card p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-600" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl uppercase text-[#111] tracking-tight mb-1">¡Pago registrado!</h3>
              <p className="text-sm text-[#6B6B6B] mb-1">Tu comprobante fue enviado correctamente.</p>
              <p className="text-xs text-[#AAAAAA] mb-6">Un asesor verificará el pago y confirmará tu reserva.</p>
              <button onClick={nueva}
                className="w-full bg-[#0015FF] hover:bg-[#0010CC] text-white font-bold uppercase tracking-[0.15em] text-[11px] py-3 transition-all">
                Listo
              </button>
            </div>
          </div>
        )}

        {/* ── RESULTADO ── */}
        {paso === 'resultado' && cliente && (
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl items-start">

            {/* imagen del vehículo */}
            <div className="card overflow-hidden">
              <div className="h-52 bg-[#F7F9FF] flex items-center justify-center">
                {vehiculoInfo?.imagen
                  ? <img src={vehiculoInfo.imagen} alt={vehiculoInfo.modelo} className="w-full h-full object-cover" />
                  : <Car size={90} className="text-[#DBEAFE]" strokeWidth={0.8} />}
              </div>
              <div className="p-4">
                <p className="font-display text-2xl uppercase text-[#111] tracking-tight leading-none">
                  {vehiculoInfo?.modelo || cliente.vehiculo}
                </p>
                {vehiculoInfo && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[vehiculoInfo.año, vehiculoInfo.transmision, vehiculoInfo.marca].map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-[0.25em] border border-[#0015FF]/20 text-[#0015FF] px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* panel de pago */}
            <div className="flex flex-col gap-4">
              <div className="card p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E8E8E8]">
                  <div className="w-9 h-9 rounded-full bg-[#0015FF]/10 flex items-center justify-center shrink-0">
                    <Car size={16} className="text-[#0015FF]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">Alquiler encontrado</p>
                    <p className="font-bold text-[#111] text-sm">{cliente.nombre}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Row label="CI"        value={cliente.ci} />
                  <Row label="Vehículo"  value={cliente.vehiculo || '—'} />
                  <Row label="Teléfono"  value={cliente.telefono || '—'} />
                </div>

                {(cliente.monto_pagado || cliente.monto_pendiente) && (
                  <div className="bg-[#F7F7F7] px-4 py-3 flex flex-col gap-2">
                    {cliente.monto_pagado && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">Anticipo pagado</span>
                        <span className="font-bold text-[#16a34a]">{cliente.monto_pagado} Bs</span>
                      </div>
                    )}
                    {cliente.monto_pendiente && (
                      <div className="flex items-center justify-between text-sm border-t border-[#E8E8E8] pt-2">
                        <span className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">Saldo restante</span>
                        <span className="font-bold text-[#FF0033] text-base">{cliente.monto_pendiente} Bs</span>
                      </div>
                    )}
                  </div>
                )}

                {cliente.monto_pendiente && (
                  esNacional
                    ? (
                      <button onClick={() => setPaso('qr')}
                        className="w-full bg-[#0015FF] hover:bg-[#0010CC] text-white font-bold uppercase tracking-[0.15em] text-[11px] py-3 transition-all flex items-center justify-center gap-2">
                        <QrCode size={14} /> Pagar con QR · {cliente.monto_pendiente} Bs
                      </button>
                    ) : (
                      <button onClick={pagarConLibelula} disabled={pagando}
                        className="w-full bg-[#0015FF] hover:bg-[#0010CC] disabled:opacity-60 text-white font-bold uppercase tracking-[0.15em] text-[11px] py-3 transition-all flex items-center justify-center gap-2">
                        {pagando
                          ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Procesando…</>
                          : `Pagar con Libelula · ${cliente.monto_pendiente} Bs`}
                      </button>
                    )
                )}

                <button onClick={nueva}
                  className="text-[10px] text-[#AAAAAA] hover:text-[#FF0033] uppercase tracking-widest font-semibold transition-colors text-center">
                  Buscar otro CI
                </button>
              </div>

              {error && <p className="text-[11px] text-[#FF0033]">{error}</p>}
            </div>
          </div>
        )}

        {/* ── PANTALLA QR (nacional) ── */}
        {paso === 'qr' && cliente && (
          <div className="max-w-sm">
            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest mb-3">
              {cliente.nombre} · {cliente.vehiculo}
            </p>
            <PagoQR
              cliente={cliente}
              onExito={() => setPaso('exitoso')}
              onCancelar={() => setPaso('resultado')}
            />
          </div>
        )}

      </div>
    </main>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-[#F0F0F0] pb-2">
      <span className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">{label}</span>
      <span className="font-semibold text-[#111]">{value}</span>
    </div>
  )
}
