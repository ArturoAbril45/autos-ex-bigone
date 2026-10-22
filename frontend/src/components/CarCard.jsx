import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Gauge, Wifi, Camera, MapPin, ArrowRight, X, Globe, Flag,
         Upload, Check, ChevronLeft, CreditCard, QrCode, AlertTriangle } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'

/* ─── helpers ─────────────────────────────────────────────── */
const featureIcon = (f) => {
  if (f.includes('GPS'))    return <MapPin size={10} />
  if (f.includes('Cámara')) return <Camera size={10} />
  if (f.includes('táctil')) return <Wifi size={10} />
  if (f.includes('km'))     return <Gauge size={10} />
  return null
}

const catLabel = {
  econ: 'Económico', sedan: 'Sedán', suv: 'SUV',
  premium: 'Premium', '4x4': '4×4', lujo: 'Lujo',
}

/* ─── upload zone ──────────────────────────────────────────── */
function UploadZone({ label, sublabel, required, file, onChange }) {
  const ref = useRef()
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-[#111] uppercase tracking-[0.15em]">{label}</span>
        {required
          ? <span className="text-[9px] font-bold text-[#FF0033]">*</span>
          : <span className="text-[9px] text-[#BBBBBB] uppercase tracking-wider">Opcional</span>
        }
      </div>
      {sublabel && <p className="text-[10px] text-[#6B6B6B] mb-1.5">{sublabel}</p>}
      <input ref={ref} type="file" accept="image/*,application/pdf" className="hidden"
        onChange={e => onChange(e.target.files[0] || null)} />
      <button type="button" onClick={() => ref.current.click()}
        className={`w-full border-2 border-dashed rounded-md py-2.5 px-3 flex items-center gap-2.5 transition-all
          ${file ? 'border-[#16a34a] bg-green-50' : 'border-[#E0E0E0] hover:border-[#0015FF] bg-white hover:bg-[#0015FF]/10'}`}>
        {file ? (
          <>
            <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center shrink-0">
              <Check size={10} className="text-white" />
            </div>
            <span className="text-[11px] font-semibold text-[#16a34a] truncate">{file.name}</span>
          </>
        ) : (
          <>
            <Upload size={13} className="text-[#AAAAAA] shrink-0" />
            <span className="text-[11px] text-[#AAAAAA]">Subir foto o PDF</span>
          </>
        )}
      </button>
    </div>
  )
}

/* ─── ubicación GPS zone ───────────────────────────────────── */
function UbicacionZone({ required, value, onChange }) {
  const [estado,   setEstado]   = useState('idle') // idle | cargando | ok | error
  const [errorMsg, setErrorMsg] = useState('')

  function capturar() {
    if (!navigator.geolocation) {
      setEstado('error'); setErrorMsg('Tu navegador no soporta geolocalización.'); return
    }
    setEstado('cargando')
    setErrorMsg('')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude.toFixed(6)
        const lng = pos.coords.longitude.toFixed(6)
        setEstado('ok')
        onChange({ lat, lng, tipo: 'gps' })
      },
      err => {
        setEstado('error')
        setErrorMsg(
          err.code === 1 ? 'Permiso denegado — permite la ubicación en el navegador.'
          : err.code === 2 ? 'Ubicación no disponible en este momento.'
          : 'Tiempo agotado. Intenta de nuevo.'
        )
      },
      { enableHighAccuracy: true, timeout: 12000 }
    )
  }

  function limpiar() { setEstado('idle'); setErrorMsg(''); onChange(null) }

  if (value?.tipo === 'gps') return (
    <div className="bg-green-50 rounded-md py-2.5 px-3 flex items-center gap-2.5">
      <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center shrink-0">
        <Check size={10} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[#16a34a]">Ubicación capturada</p>
        <a href={`https://www.google.com/maps?q=${value.lat},${value.lng}`}
          target="_blank" rel="noreferrer"
          className="text-[10px] text-[#0015FF] underline truncate block">
          {value.lat}, {value.lng}
        </a>
      </div>
      <button type="button" onClick={limpiar} className="text-[#AAAAAA] hover:text-[#FF0033] transition-colors shrink-0">
        <X size={13} />
      </button>
    </div>
  )

  return (
    <div>
      <button type="button" onClick={capturar} disabled={estado === 'cargando'}
        className={`w-full rounded-md py-2.5 px-3 flex items-center justify-center gap-2 transition-all font-semibold text-[11px]
          ${estado === 'cargando'
            ? 'bg-[#F7F7F7] text-[#AAAAAA] cursor-not-allowed border border-[#E8E8E8]'
            : 'bg-[#0015FF] hover:bg-[#0010CC] text-white active:scale-[0.98]'}`}>
        {estado === 'cargando'
          ? <><span className="w-3.5 h-3.5 border-2 border-[#AAAAAA] border-t-transparent rounded-full animate-spin" /> Obteniendo ubicación…</>
          : <><MapPin size={13} /> Capturar mi ubicación {required && <span className="text-[#FF0033] ml-0.5">*</span>}</>}
      </button>
      {estado === 'error' && <p className="text-[10px] text-[#FF0033] mt-1.5">{errorMsg}</p>}
    </div>
  )
}

/* ─── document field lists ─────────────────────────────────── */
const CAMPOS_NACIONAL = [
  { key: 'ci',        label: 'Foto de cédula de identidad (vigente)',   sublabel: 'Clara y legible',             required: true },
  { key: 'licencia',  label: 'Foto de licencia de conducir (vigente)',  sublabel: 'Brevet',                      required: true },
  { key: 'factura',   label: 'Foto de factura de luz o agua (vigente)', sublabel: 'Nombre y domicilio visibles', required: true },
  { key: 'ubicacion', label: '',                                         sublabel: '',                            required: true },
]

const CAMPOS_EXTRANJERO = [
  { key: 'ci',       label: 'Foto de cédula de identidad (vigente)',    sublabel: 'Página con foto y datos',            required: true },
  { key: 'licencia', label: 'Foto de licencia de conducir (vigente)',   sublabel: 'Del país de origen',                 required: true },
  { key: 'voucher',  label: 'Voucher o reserva de hotel',               sublabel: 'Comprobante de alojamiento',         required: true },
]

const inputCls = "w-full border border-[#E8E8E8] rounded-md text-sm px-3.5 py-2.5 text-[#111] focus:outline-none focus:border-[#0015FF] transition-colors bg-white placeholder:text-[#BBBBBB]"

/* ─── decorative QR svg ────────────────────────────────────── */
function QRSvg() {
  const M = 10
  // 21×21 QR-like pattern (3 finder patterns + timing + data modules)
  const rows = [
    [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,1,0,1],
    [0,1,1,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0],
    [1,0,0,1,0,1,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1],
    [0,1,0,0,1,1,0,1,0,0,1,0,0,1,0,1,1,0,1,0,0],
    [1,0,1,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,0,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,0,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0,1,0],
  ]
  return (
    <svg width={21*M} height={21*M} viewBox={`0 0 ${21*M} ${21*M}`} style={{ display:'block' }}>
      <rect width={21*M} height={21*M} fill="white" />
      {rows.map((row, r) => row.map((cell, c) => cell
        ? <rect key={`${r}-${c}`} x={c*M} y={r*M} width={M} height={M} fill="#111" />
        : null
      ))}
    </svg>
  )
}

/* ─── modal: aviso beneficiario ────────────────────────────── */
function ModalAviso({ onAceptar, onBack, onClose }) {
  return (
    <div className="bg-white rounded-md w-full shadow-2xl relative"
      style={{ maxWidth: 340 }} onClick={e => e.stopPropagation()}>

      <div className="p-5 flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-lg bg-red-50 border border-[#FF0033]/20 flex items-center justify-center mb-3">
          <AlertTriangle size={18} className="text-[#FF0033]" strokeWidth={1.8} />
        </div>

        <p className="section-label text-[#FF0033] mb-1">Aviso importante</p>
        <h2 className="font-display text-2xl uppercase text-[#111] tracking-tight mb-3 leading-tight">
          Titular de la cuenta
        </h2>

        <div className="bg-[#FFF5F5] border border-[#FF0033]/20 rounded-lg p-3 mb-4 text-left">
          <p className="text-xs text-[#333] leading-relaxed">
            El <strong className="text-[#111]">nombre del titular de la cuenta bancaria</strong> debe coincidir con el nombre del conductor.
            <strong className="text-[#FF0033]"> Si no coincide, el dinero quedará retenido</strong> hasta verificar la identidad del pagador.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <button onClick={onAceptar}
            className="inline-flex items-center justify-center gap-2 bg-[#FF0033] text-white font-bold uppercase tracking-[0.22em] text-[10px] px-4 py-2 rounded-lg transition-all hover:bg-[#CC0000] active:scale-95">
            Entendido, continuar <ArrowRight size={12} />
          </button>
          <button onClick={onBack}
            className="text-[11px] text-[#6B6B6B] hover:text-[#111] transition-colors py-1 uppercase tracking-widest font-semibold">
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}

const ANTICIPO = 500
const LIBELULA_APPKEY = '26916565-3b0e-359c-cf11-cfc014a6d31e'

/* ─── modal: pago ──────────────────────────────────────────── */
const API_URL = import.meta.env.VITE_API_URL || 'https://bigonerentacar.online/api'

function logCliente(payload) {
  fetch(`${API_URL}/log-cliente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}

function ModalPago({ modelo, v, datos, tipo, onBack, onClose }) {
  const navigate = useNavigate()
  const [enviando, setEnviando] = useState(false)
  const [error,    setError]    = useState('')
  const [segundos, setSegundos] = useState(15 * 60)

  useEffect(() => {
    const t = setInterval(() => setSegundos(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const timerMins = String(Math.floor(segundos / 60)).padStart(2, '0')
  const timerSecs = String(segundos % 60).padStart(2, '0')
  const timerUrgente = segundos < 120

  const dias = datos?.fechaIngreso && datos?.fechaEntrega
    ? Math.max(1, Math.ceil((new Date(datos.fechaEntrega) - new Date(datos.fechaIngreso)) / 86400000))
    : 0
  const total     = dias * (v?.preciodiario || 0)
  const pendiente = Math.max(0, total - ANTICIPO)

  // Solo necesario para el flujo Libelula (extranjeros): el pago ocurre en un
  // dominio externo, así que esto es lo único que sobrevive la redirección de
  // ida y vuelta. El flujo nacional (QR) no sale del sitio y no lo necesita.
  function guardarPendienteParaLibelula(identificador, montoPagado = ANTICIPO) {
    localStorage.setItem('bigone_reserva_pendiente', JSON.stringify({
      identificador,
      vehiculo: modelo,
      marca: v?.marca,
      año: v?.año,
      nombre: datos?.nombres,
      ci: datos?.dni,
      telefono: datos?.celular,
      correo: datos?.correo || null,
      fechaIngreso: datos?.fechaIngreso,
      fechaEntrega: datos?.fechaEntrega,
      dias,
      monto: montoPagado,
      precio_total: total,
      fecha: new Date().toISOString(),
      origen: 'reserva',
      tipo_cliente: tipo || 'nacional',
      ubicacion: datos?.ubicacion || null,
    }))
  }

  // ── subir documentos al servidor ────────────────────────────
  async function subirDocs(docsObj) {
    const resultado = {}
    const tipos = ['ci', 'licencia', 'factura', 'voucher']
    for (const tipo of tipos) {
      const archivo = docsObj?.[tipo]
      if (archivo instanceof File) {
        try {
          const fd = new FormData()
          fd.append('doc', archivo)
          const res  = await fetch(`${API_URL}/bigone/upload-doc`, { method: 'POST', body: fd })
          const data = await res.json()
          if (data.url) resultado[tipo] = data.url
        } catch {}
      }
    }
    return resultado
  }

  // ── NACIONALES: pago por QR ──────────────────────────────────
  async function pagarQR() {
    setEnviando(true)
    setError('')
    const identificador = String(Date.now())
    try {
      const docUrls = await subirDocs(datos?._docs)

      logCliente({
        nombre:        datos?.nombres,
        ci:            datos?.dni,
        celular:       datos?.celular,
        correo:        datos?.correo || null,
        vehiculo:      modelo,
        año:           v?.año,
        monto:         ANTICIPO,
        dias,
        fecha_ingreso: datos?.fechaIngreso,
        fecha_entrega: datos?.fechaEntrega,
        tipo_cliente:  'nacional',
        estado:        'pagada',
        origen:        'reserva',
        lat:           datos?.ubicacion?.lat || null,
        lng:           datos?.ubicacion?.lng || null,
      })

      // Registrar el intento en el backend
      await fetch(`${API_URL}/bigone/intentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref_id:       identificador,
          nombre:       datos?.nombres,
          ci:           datos?.dni,
          telefono:     datos?.celular,
          vehiculo:     modelo,
          año:          v?.año,
          monto:        ANTICIPO,
          dias,
          fecha_ingreso: datos?.fechaIngreso,
          fecha_entrega: datos?.fechaEntrega,
          tipo_cliente: 'nacional',
          origen:       'reserva',
          lat:          datos?.ubicacion?.lat || null,
          lng:          datos?.ubicacion?.lng || null,
        }),
      }).catch(() => {})

      // Marcar intento como completado (pago QR confirmado)
      await fetch(`${API_URL}/bigone/intentos/${identificador}/completar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {})

      // Única escritura autoritativa de la reserva — esperamos la respuesta
      // real del backend para no mostrar "éxito" si falló el guardado.
      const res = await fetch(`${API_URL}/bigone/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehiculo_id:      v?.id || null,
          nombre:           datos?.nombres,
          ci:               datos?.dni,
          telefono:         datos?.celular,
          correo:           datos?.correo || null,
          fecha_nacimiento: datos?.fechaNacimiento || null,
          vehiculo:         modelo,
          marca:            v?.marca || null,
          año:              v?.año,
          monto:            ANTICIPO,
          precio_total:     total,
          dias,
          fecha_ingreso:    datos?.fechaIngreso,
          fecha_entrega:    datos?.fechaEntrega,
          tipo_cliente:     'nacional',
          estado:           'pagada',
          origen:           'reserva',
          lat:              datos?.ubicacion?.lat || null,
          lng:              datos?.ubicacion?.lng || null,
          ref_pago:         identificador,
          documentos:       docUrls,
        }),
      })
      const reservaCreada = await res.json()
      if (!res.ok) throw new Error(reservaCreada.message || 'El servidor rechazó la reserva.')

      navigate('/reserva-exitosa', { state: { reserva: reservaCreada } })
    } catch (e) {
      setError(e.message || 'Error al registrar la reserva.')
      setEnviando(false)
    }
  }

  // ── EXTRANJEROS: pasarela Libelula ───────────────────────────
  // tipoPago: 'anticipo' (solo 500 Bs) | 'completo' (todo el servicio)
  async function pagarLibelula(tipoPago = 'anticipo') {
    setEnviando(true)
    setError('')
    const identificador = String(Date.now())
    const esCompleto = tipoPago === 'completo'
    const monto = esCompleto ? total : ANTICIPO
    const concepto = esCompleto
      ? `Pago completo reserva ${modelo} - Big One Rent a Car`
      : `Anticipo reserva ${modelo} - Big One Rent a Car`
    try {
      guardarPendienteParaLibelula(identificador, monto)

      const docUrls = await subirDocs(datos?._docs)

      logCliente({
        nombre:        datos?.nombres,
        ci:            datos?.dni,
        celular:       datos?.celular,
        correo:        datos?.correo || null,
        vehiculo:      modelo,
        año:           v?.año,
        monto,
        dias,
        fecha_ingreso: datos?.fechaIngreso,
        fecha_entrega: datos?.fechaEntrega,
        tipo_cliente:  'extranjero',
        tipo_pago:     tipoPago,
        estado:        'intento',
        origen:        'reserva',
        lat:           datos?.ubicacion?.lat || null,
        lng:           datos?.ubicacion?.lng || null,
      })

      await fetch(`${API_URL}/bigone/intentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref_id: identificador, nombre: datos?.nombres, ci: datos?.dni,
          telefono: datos?.celular, vehiculo: modelo, año: v?.año,
          monto, dias, fecha_ingreso: datos?.fechaIngreso,
          fecha_entrega: datos?.fechaEntrega, tipo_cliente: 'extranjero',
          tipo_pago: tipoPago,
          origen: 'reserva', lat: datos?.ubicacion?.lat || null, lng: datos?.ubicacion?.lng || null,
        }),
      }).catch(() => {})

      const emailEnviar = (datos?.correo && datos.correo.trim().length > 0)
        ? datos.correo.trim() : 'reservas@bigonerentacar.com'
      const payload = {
        appkey: LIBELULA_APPKEY,
        email_cliente: emailEnviar,
        identificador,
        callback_url: 'https://bigonerentacar.online/reserva-exitosa',
        url_retorno:  'https://bigonerentacar.online/reserva-exitosa',
        descripcion:  concepto,
        nombre_cliente: datos?.nombres?.trim() || 'Cliente',
        emite_factura: 0,
        lineas_detalle_deuda: [{
          nro_linea: 1,
          concepto,
          cantidad: 1, costo_unitario: monto, descuento: 0,
        }],
      }
      const res  = await fetch('https://api.todotix.com/rest/deuda/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { throw new Error('Respuesta inválida: ' + text.slice(0, 300)) }
      const url = data.url_pasarela_pagos || data.url || data.url_pago || data.redirect_url || data.link
      if (url) {
        window.location.href = url
      } else {
        throw new Error('API respondió: ' + JSON.stringify(data).slice(0, 300))
      }
    } catch (e) {
      setError(e.message || 'Error al conectar con el sistema de pago.')
      setEnviando(false)
    }
  }

  const esNacional = tipo === 'nacional'

  return (
    <div className="bg-white rounded-lg w-full shadow-2xl relative overflow-hidden"
      style={{ maxWidth: esNacional ? 460 : 400 }} onClick={e => e.stopPropagation()}>

      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1 text-[#6B6B6B] hover:text-[#111] text-[10px] font-semibold uppercase tracking-wider transition-colors">
            <ChevronLeft size={12} /> Volver
          </button>
          <span className="text-[#E0E0E0]">|</span>
          <span className="section-label">Pago · {modelo}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-black tabular-nums px-1 ${
            timerUrgente ? 'text-[#FF0033] animate-pulse' : 'text-[#6B6B6B]'
          }`}>⏱ {timerMins}:{timerSecs}</span>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F7F7F7] text-[#6B6B6B] hover:bg-[#E8E8E8] transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {/* Resumen de la reserva */}
        {dias > 0 && (
          <div className="bg-[#0015FF]/5 border border-[#0015FF]/20 rounded-lg px-4 py-3">
            <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest mb-2">
              {dias} día{dias > 1 ? 's' : ''} · {v?.preciodiario} Bs/día · Total {total.toLocaleString('es-BO')} Bs
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">Anticipo a pagar ahora</p>
                <p className="font-display text-2xl text-[#0015FF] leading-none mt-0.5">
                  {ANTICIPO.toLocaleString('es-BO')} Bs
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">Saldo pendiente</p>
                <p className="font-display text-xl text-[#FF0033] leading-none mt-0.5">
                  {pendiente.toLocaleString('es-BO')} Bs
                </p>
              </div>
            </div>
          </div>
        )}

        {esNacional ? (
          /* ── QR para nacionales ── */
          <>
            <div className="flex gap-3 items-center">
              <div className="shrink-0">
                <img src="/images/qr-garantia.png" alt="QR Pago"
                  className="w-40 h-40 object-contain block rounded-md border border-[#E8E8E8]"
                  onError={e => { e.currentTarget.style.display='none' }} />
              </div>
              <div className="flex-1 flex flex-col gap-2 text-sm">
                <div>
                  <p className="text-[9px] text-[#AAAAAA] uppercase tracking-wider">A nombre de</p>
                  <p className="font-bold text-[#111] leading-tight">CHIOCI JAIME KIYUNA TRIGO</p>
                  <p className="text-xs text-[#6B6B6B]">Cta. <span className="font-semibold text-[#111]">1000929278</span></p>
                </div>
                <div className="border-t border-[#E8E8E8] pt-2">
                  <p className="text-[9px] text-[#AAAAAA] uppercase tracking-wider">Concepto</p>
                  <p className="text-xs font-bold text-[#111]">ANTICIPO RESERVA BIG ONE</p>
                </div>
                <div className="border-t border-[#E8E8E8] pt-2">
                  <p className="text-[9px] text-[#AAAAAA] uppercase tracking-wider">Monto a depositar</p>
                  <p className="font-bold text-[#0015FF] text-2xl leading-none">{ANTICIPO.toLocaleString('es-BO')} Bs</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-[#6B6B6B] leading-relaxed">
              Escanea el QR o transfiere al número de cuenta. Una vez realizado el depósito, presiona <strong className="text-[#111]">Confirmar pago</strong>.
            </p>
            {error && <p className="text-[11px] text-[#FF0033]">{error}</p>}
            <button onClick={pagarQR} disabled={enviando}
              className="btn-blue w-full justify-center !py-3 disabled:opacity-40 disabled:cursor-not-allowed">
              {enviando
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />Registrando…</>
                : <><Check size={14} /> Confirmar pago</>}
            </button>
          </>
        ) : (
          /* ── Pasarela Libelula para extranjeros ── */
          <>
            <p className="text-[10px] text-[#6B6B6B] leading-relaxed">
              Elige si quieres reservar con el anticipo o pagar todo el servicio ahora. El saldo pendiente, si queda, podrás pagarlo luego desde <strong className="text-[#111]">Pago de servicios</strong> con tu CI o pasaporte.
            </p>
            {error && <p className="text-[11px] text-[#FF0033]">{error}</p>}
            <button onClick={() => pagarLibelula('anticipo')} disabled={enviando}
              className="btn-blue !rounded-none w-full justify-center !py-3 disabled:opacity-40 disabled:cursor-not-allowed">
              {enviando
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />Redirigiendo…</>
                : <>Reservar · Anticipo {ANTICIPO.toLocaleString('es-BO')} Bs <ArrowRight size={14} /></>}
            </button>
            <button onClick={() => pagarLibelula('completo')} disabled={enviando}
              className="btn-primary !rounded-none w-full justify-center !py-3 disabled:opacity-40 disabled:cursor-not-allowed">
              {enviando
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />Redirigiendo…</>
                : <>Pagar todo el servicio · {total.toLocaleString('es-BO')} Bs <ArrowRight size={14} /></>}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ─── modal: éxito ─────────────────────────────────────────── */
function ModalExitoso({ onClose }) {
  return (
    <div className="bg-white rounded-lg w-full shadow-2xl overflow-hidden"
      style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>

      <div className="p-8 flex flex-col items-center text-center">
        {/* checkmark animado */}
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6"
          style={{ animation: 'scaleIn .35s ease' }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="17" stroke="#16a34a" strokeWidth="2" />
            <path d="M10 18l6 6 10-12" stroke="#16a34a" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 28, strokeDashoffset: 0 }} />
          </svg>
        </div>

        <p className="section-label text-[#16a34a] mb-1">Completado</p>
        <h2 className="font-display text-4xl uppercase text-[#111] tracking-tight mb-3">
          Pago exitoso
        </h2>
        <p className="text-sm text-[#6B6B6B] leading-relaxed mb-8">
          Tu reserva ha sido registrada.<br />
          <strong className="text-[#111]">Un agente se pondrá en contacto contigo</strong> para confirmar los detalles.
        </p>

        <button onClick={onClose}
          className="btn-primary w-full justify-center !py-3">
          Entendido <Check size={14} />
        </button>
      </div>
    </div>
  )
}

/* ─── validaciones ─────────────────────────────────────────── */
const validar = {
  nombres: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{5,}$/.test(v.trim()) && v.trim().split(/\s+/).length >= 2
    ? '' : 'Ingresa tu nombre y apellido completos (solo letras)',
  dni: v => /^\d{5,15}$/.test(v.trim())
    ? '' : 'El CI/DNI debe tener entre 5 y 15 dígitos numéricos',
  celular: v => /^[+\d][\d\s\-]{6,19}$/.test(v.trim())
    ? '' : 'Número inválido (ej. +591 70000000)',
  correo: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    ? '' : 'Correo electrónico inválido',
  fechaNacimiento: v => {
    if (!v) return 'Fecha de nacimiento requerida'
    const edad = Math.floor((new Date() - new Date(v)) / (365.25 * 24 * 60 * 60 * 1000))
    return edad >= 23 ? '' : 'Debes tener al menos 23 años para reservar un vehículo'
  },
}

/* ─── modal: documentos ────────────────────────────────────── */
function ModalDocumentos({ tipo, vehiculo, vehiculoId, onBack, onContinuar, onClose }) {
  const [docs,          setDocs]          = useState({})
  const [datos,         setDatos]         = useState({ nombres: '', dni: '', celular: '', correo: '', fechaNacimiento: '', fechaIngreso: '', fechaEntrega: '' })
  const [touched,       setTouched]       = useState({})
  const [disponible,    setDisponible]    = useState(true)
  const [checkeando,    setCheckeando]    = useState(false)
  const campos = tipo === 'nacional' ? CAMPOS_NACIONAL : CAMPOS_EXTRANJERO

  const docsCumplidos = campos.filter(c => c.required).every(c => docs[c.key])
  const dias = datos.fechaIngreso && datos.fechaEntrega
    ? Math.ceil((new Date(datos.fechaEntrega) - new Date(datos.fechaIngreso)) / 86400000)
    : 0

  const errores = {
    nombres:         validar.nombres(datos.nombres),
    dni:             validar.dni(datos.dni),
    celular:         validar.celular(datos.celular),
    correo:          validar.correo(datos.correo),
    fechaNacimiento: validar.fechaNacimiento(datos.fechaNacimiento),
  }
  const camposValidos = !errores.nombres && !errores.dni && !errores.celular && !errores.correo && !errores.fechaNacimiento
  const datosCumplidos = camposValidos && datos.fechaIngreso && datos.fechaEntrega && dias >= 3
  const cumplido = docsCumplidos && datosCumplidos && disponible

  async function verificarDisponibilidad(fechaIngreso, fechaEntrega) {
    if (!fechaIngreso || !fechaEntrega || !vehiculoId) return
    setCheckeando(true)
    try {
      const nombreParam = vehiculo ? `&vehiculo=${encodeURIComponent(vehiculo)}` : ''
      const res = await fetch(`${API_URL}/vehiculos/${vehiculoId}/disponibilidad?fecha_inicio=${fechaIngreso}&fecha_fin=${fechaEntrega}${nombreParam}`)
      const data = await res.json()
      setDisponible(data.disponible !== false)
    } catch {
      setDisponible(true)
    } finally {
      setCheckeando(false)
    }
  }

  const hoy = new Date().toISOString().split('T')[0]

  function minEntrega() {
    if (!datos.fechaIngreso) return hoy
    const d = new Date(datos.fechaIngreso)
    d.setDate(d.getDate() + 3)
    return d.toISOString().split('T')[0]
  }

  function set(k, val) { setDatos(d => ({ ...d, [k]: val })) }
  function touch(k)    { setTouched(t => ({ ...t, [k]: true })) }

  const fieldCls = (k) => `${inputCls} ${
    touched[k] && errores[k]
      ? 'border-[#FF0033] focus:border-[#FF0033]'
      : touched[k] && !errores[k] && datos[k]
        ? 'border-[#16a34a] focus:border-[#16a34a]'
        : ''
  }`

  return (
    <div className="bg-white rounded-lg w-full shadow-2xl relative overflow-hidden"
      style={{ maxWidth: 760 }} onClick={e => e.stopPropagation()}>

      {/* header */}
      <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1 text-[#6B6B6B] hover:text-[#111] transition-colors text-[10px] font-semibold uppercase tracking-wider">
            <ChevronLeft size={12} /> Volver
          </button>
          <span className="text-[#E0E0E0]">|</span>
          <span className="font-display text-lg uppercase text-[#111] tracking-tight">
            {tipo === 'nacional' ? 'Bolivia / Nacional' : 'Extranjero'}
          </span>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F7F7F7] text-[#6B6B6B] hover:bg-[#E8E8E8] transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* body: 2 columns */}
      <div className="grid grid-cols-2 divide-x divide-[#F0F0F0]">

        {/* izquierda: datos personales */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <p className="section-label mb-0.5">Paso 1</p>
            <h3 className="font-display text-xl uppercase text-[#111] tracking-tight">Datos personales</h3>
          </div>
          <div>
            <label className="section-label block mb-1.5">Nombres completos <span className="text-[#FF0033]">*</span></label>
            <input value={datos.nombres}
              onChange={e => set('nombres', e.target.value)}
              onBlur={() => touch('nombres')}
              placeholder="Ej. Juan Carlos Pérez"
              className={fieldCls('nombres')} />
            {touched.nombres && errores.nombres &&
              <p className="text-[10px] text-[#FF0033] mt-1">{errores.nombres}</p>}
          </div>
          <div>
            <label className="section-label block mb-1.5">
              {tipo === 'nacional' ? 'CI' : 'CI / Pasaporte'} <span className="text-[#FF0033]">*</span>
            </label>
            <input value={datos.dni}
              onChange={e => set('dni', e.target.value.replace(/\D/g, ''))}
              onBlur={() => touch('dni')}
              placeholder="Número de documento"
              inputMode="numeric"
              className={fieldCls('dni')} />
            {touched.dni && errores.dni &&
              <p className="text-[10px] text-[#FF0033] mt-1">{errores.dni}</p>}
          </div>
          <div>
            <label className="section-label block mb-1.5">Celular / WhatsApp <span className="text-[#FF0033]">*</span></label>
            <input value={datos.celular}
              onChange={e => set('celular', e.target.value)}
              onBlur={() => touch('celular')}
              placeholder="+591 7XXXXXXX"
              inputMode="tel"
              className={fieldCls('celular')} />
            {touched.celular && errores.celular &&
              <p className="text-[10px] text-[#FF0033] mt-1">{errores.celular}</p>}
          </div>
          <div>
            <label className="section-label block mb-1.5">Correo electrónico</label>
            <input type="email" value={datos.correo}
              onChange={e => set('correo', e.target.value)}
              onBlur={() => touch('correo')}
              placeholder="correo@ejemplo.com"
              className={fieldCls('correo')} />
            {touched.correo && errores.correo &&
              <p className="text-[10px] text-[#FF0033] mt-1">{errores.correo}</p>}
          </div>
          <div>
            <label className="section-label block mb-1.5">Fecha de nacimiento <span className="text-[#FF0033]">*</span></label>
            <input type="date" value={datos.fechaNacimiento}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 23)).toISOString().split('T')[0]}
              onChange={e => set('fechaNacimiento', e.target.value)}
              onBlur={() => touch('fechaNacimiento')}
              className={fieldCls('fechaNacimiento')} />
            {touched.fechaNacimiento && errores.fechaNacimiento &&
              <p className="text-[10px] text-[#FF0033] mt-1">{errores.fechaNacimiento}</p>}
            {!touched.fechaNacimiento &&
              <p className="text-[9px] text-[#AAAAAA] mt-0.5">Edad mínima: 23 años</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="section-label block mb-1.5">Fecha de ingreso <span className="text-[#FF0033]">*</span></label>
              <input type="date" value={datos.fechaIngreso} min={hoy}
                onChange={e => {
                  const nuevoIngreso = e.target.value
                  let nuevaEntrega = datos.fechaEntrega
                  if (datos.fechaEntrega) {
                    const d = new Date(nuevoIngreso); d.setDate(d.getDate() + 3)
                    if (new Date(datos.fechaEntrega) < d) nuevaEntrega = ''
                  }
                  setDatos(d => ({ ...d, fechaIngreso: nuevoIngreso, fechaEntrega: nuevaEntrega }))
                  setDisponible(true)
                  if (nuevoIngreso && nuevaEntrega) verificarDisponibilidad(nuevoIngreso, nuevaEntrega)
                }}
                className={inputCls} />
            </div>
            <div>
              <label className="section-label block mb-1.5">Fecha de entrega <span className="text-[#FF0033]">*</span></label>
              <input type="date" value={datos.fechaEntrega} min={minEntrega()}
                onChange={e => {
                  const nuevaEntrega = e.target.value
                  set('fechaEntrega', nuevaEntrega)
                  setDisponible(true)
                  if (datos.fechaIngreso && nuevaEntrega) verificarDisponibilidad(datos.fechaIngreso, nuevaEntrega)
                }}
                className={inputCls} />
            </div>
          </div>
          {datos.fechaIngreso && datos.fechaEntrega && dias > 0 && (
            dias < 3
              ? <div className="bg-red-50 border border-[#FF0033]/30 rounded-md px-4 py-2.5 text-[11px] text-[#FF0033] font-semibold">
                  Mínimo 3 días de alquiler
                </div>
              : checkeando
                ? <div className="bg-[#F7F7F7] border border-[#E8E8E8] rounded-md px-4 py-2.5 text-[11px] text-[#555] flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-[#AAAAAA] border-t-transparent rounded-full animate-spin" /> Verificando disponibilidad…
                  </div>
                : !disponible
                  ? <div className="bg-red-50 border border-[#FF0033]/30 rounded-md px-4 py-2.5 text-[11px] text-[#FF0033] font-semibold">
                      Este vehículo ya está reservado para esas fechas
                    </div>
                  : <div className="bg-[#F7F7F7] border border-[#E8E8E8] rounded-md px-4 py-2.5 text-[11px] text-[#555]">
                      Duración: <strong className="text-[#111]">{dias} día{dias > 1 ? 's' : ''}</strong>
                    </div>
          )}
        </div>

        {/* derecha: documentos */}
        <div className="p-6 bg-[#FAFAFA] flex flex-col gap-3.5">
          <div>
            <p className="section-label mb-0.5">Paso 2</p>
            <h3 className="font-display text-xl uppercase text-[#111] tracking-tight">Documentos</h3>
            <p className="text-[10px] text-[#6B6B6B] mt-1">JPG, PNG o PDF. Fotos claras y legibles.</p>
          </div>
          {campos.map(c =>
            c.key === 'ubicacion' ? (
              <UbicacionZone key={c.key} required={c.required}
                value={docs.ubicacion || null}
                onChange={v => setDocs(d => ({ ...d, ubicacion: v }))} />
            ) : (
              <UploadZone key={c.key} {...c}
                file={docs[c.key] || null}
                onChange={f => setDocs(d => ({ ...d, [c.key]: f }))} />
            )
          )}
        </div>
      </div>

      {/* footer */}
      <div className="px-6 py-4 border-t border-[#F0F0F0] flex items-center gap-4">
        <button onClick={() => onContinuar({ ...datos, ubicacion: docs.ubicacion || null, _docs: docs })} disabled={!cumplido}
          className="btn-blue !py-2.5 !px-6 disabled:opacity-40 disabled:cursor-not-allowed">
          Continuar al pago <ArrowRight size={14} />
        </button>
        {!cumplido && (
          <p className="text-[10px] text-[#AAAAAA]">
            Completa los campos <span className="text-[#FF0033] font-bold">*</span> y sube los documentos requeridos
          </p>
        )}
      </div>
    </div>
  )
}

/* ─── modal: nacionalidad ──────────────────────────────────── */
function ModalNacionalidad({ onSelect, onClose }) {
  return (
    <div className="bg-white rounded-lg w-full max-w-sm p-7 shadow-2xl relative"
      onClick={e => e.stopPropagation()}>

      <button onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F7F7F7] text-[#6B6B6B] hover:bg-[#E8E8E8] transition-colors">
        <X size={14} />
      </button>

      <p className="section-label mb-1">Antes de continuar</p>
      <h2 className="font-display text-3xl uppercase text-[#111] tracking-tight mb-2">
        ¿De dónde eres?
      </h2>
      <p className="text-sm text-[#6B6B6B] mb-6 leading-relaxed">
        Los documentos requeridos varían según tu nacionalidad.
      </p>

      <div className="flex flex-col gap-3">
        <button onClick={() => onSelect('nacional')}
          className="flex items-center gap-4 border-2 border-[#E8E8E8] hover:border-[#FF0033] rounded-md p-4 text-left transition-all group">
          <div className="w-11 h-11 rounded-md bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
            <Flag size={18} className="text-[#FF0033]" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-semibold text-[#111] text-sm">Bolivia / Nacional</div>
            <div className="text-[11px] text-[#6B6B6B] mt-0.5">Cédula de identidad + licencia</div>
          </div>
          <ArrowRight size={15} className="text-[#6B6B6B] ml-auto group-hover:text-[#FF0033] transition-colors" />
        </button>

        <button onClick={() => onSelect('extranjero')}
          className="flex items-center gap-4 border-2 border-[#E8E8E8] hover:border-[#FBBF24] rounded-md p-4 text-left transition-all group">
          <div className="w-11 h-11 rounded-md bg-yellow-50 flex items-center justify-center shrink-0 group-hover:bg-yellow-100 transition-colors">
            <Globe size={18} className="text-[#FBBF24]" strokeWidth={1.5} />
          </div>
          <div>
            <div className="font-semibold text-[#111] text-sm">Extranjero</div>
            <div className="text-[11px] text-[#6B6B6B] mt-0.5">Pasaporte + licencia internacional</div>
          </div>
          <ArrowRight size={15} className="text-[#6B6B6B] ml-auto group-hover:text-[#FBBF24] transition-colors" />
        </button>
      </div>
    </div>
  )
}

/* ─── modal garantía ───────────────────────────────────────── */
function calcGarantia(precio) {
  if (precio <= 490)  return { monto: '3.500 Bs', bs: 3500 }
  if (precio <= 1000) return { monto: '5.000 Bs', bs: 5000 }
  return                     { monto: '7.000 Bs', bs: 7000 }
}

function ModalGarantia({ onClose, preciodiario }) {
  const [paso,        setPaso]        = useState('dni')  // 'dni' | 'qr' | 'comprobante' | 'exitoso'
  const [dni,         setDni]         = useState('')
  const [cliente,     setCliente]     = useState(null)
  const [error,       setError]       = useState('')
  const [buscando,    setBuscando]    = useState(false)
  const [archivo,     setArchivo]     = useState(null)
  const [preview,     setPreview]     = useState(null)
  const [subiendo,    setSubiendo]    = useState(false)
  const fileRef = useRef()

  async function consultar() {
    if (!dni.trim()) return
    setBuscando(true)
    setError('')
    try {
      const res  = await fetch(`${API_URL}/bigone/cliente?ci=${encodeURIComponent(dni.trim())}`)
      const data = await res.json()
      if (!res.ok || data.error) {
        setError('CI no encontrado. Asegúrate de haber completado tu reserva primero.')
      } else {
        setCliente(data)
        setPaso('qr')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setBuscando(false)
    }
  }

  function seleccionarArchivo(file) {
    if (!file) return
    setArchivo(file)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  async function confirmarPago() {
    setSubiendo(true)
    setError('')
    try {
      let comprobanteUrl = null

      if (archivo) {
        const fd = new FormData()
        fd.append('doc', archivo)
        const upRes  = await fetch(`${API_URL}/bigone/upload-doc`, { method: 'POST', body: fd })
        const upData = await upRes.json()
        comprobanteUrl = upData.url || null
      }

      await fetch(`${API_URL}/bigone/garantias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ci:              cliente.ci,
          nombre:          cliente.nombre,
          vehiculo:        cliente.vehiculo,
          telefono:        cliente.telefono,
          monto:           calcGarantia(preciodiario).bs,
          comprobante_url: comprobanteUrl,
        }),
      })

      setPaso('exitoso')
    } catch {
      setError('Error al registrar. Intenta de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  if (paso === 'exitoso') return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-lg p-8 text-center max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check size={30} className="text-green-600" strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-bold text-[#111] mb-1">¡Pago exitoso!</h3>
        <p className="text-sm text-[#6B6B6B] mb-1">Depósito de garantía recibido.</p>
        <p className="text-xs text-[#AAAAAA] mb-6">
          Un asesor se comunicará contigo para confirmar tu reserva. Gracias por confiar en Big One Rent a Car.
        </p>
        <button onClick={onClose}
          className="w-full bg-[#0015FF] hover:bg-[#0010CC] text-white font-bold uppercase tracking-[0.15em] text-[11px] py-3 rounded-lg transition-all active:scale-95">
          Cerrar
        </button>
      </div>
    </div>
  )

  if (paso === 'dni') return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-lg p-7 max-w-sm w-full shadow-2xl relative"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#111]">
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#0015FF]/10 flex items-center justify-center mb-4">
          <CreditCard size={22} className="text-[#0015FF]" strokeWidth={1.5} />
        </div>

        <h3 className="font-display text-2xl uppercase text-[#111] tracking-tight mb-1">Garantía</h3>
        <p className="text-sm text-[#6B6B6B] mb-5">Ingresa tu CI para consultar tu reserva.</p>

        <input
          value={dni}
          onChange={e => { setDni(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && consultar()}
          placeholder="Número de CI"
          className="w-full border border-[#E8E8E8] rounded-lg text-sm px-4 py-3 text-[#111] focus:outline-none focus:border-[#0015FF] transition-colors mb-3"
        />

        {error && <p className="text-[11px] text-[#FF0033] mb-3">{error}</p>}

        <button onClick={consultar} disabled={!dni.trim() || buscando}
          className="w-full bg-[#0015FF] hover:bg-[#0010CC] disabled:opacity-50 text-white font-bold uppercase tracking-[0.15em] text-[11px] py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2">
          {buscando
            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Buscando…</>
            : 'Consultar'}
        </button>
      </div>
    </div>
  )

  // pantalla QR
  if (paso === 'qr') return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4">
          {cliente && (
            <p className="text-center text-[11px] text-[#0015FF] font-bold mb-3">{cliente.nombre} · {cliente.vehiculo}</p>
          )}
          <div className="flex gap-3 items-center mb-4">
            <div className="shrink-0">
              <img src="/images/qr-garantia.png" alt="QR Garantía"
                className="w-44 h-44 object-contain block"
                onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex' }} />
              <div className="w-44 h-44 items-center justify-center flex-col gap-1 text-center hidden border border-dashed border-[#DDD] rounded">
                <QrCode size={28} className="text-[#CCCCCC]" />
                <span className="text-[9px] text-[#AAAAAA]">qr-garantia.png</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div>
                <p className="text-[9px] text-[#AAAAAA] uppercase tracking-wider">A nombre de</p>
                <p className="font-bold text-[#111] text-sm leading-tight">CHIOCI JAIME KIYUNA TRIGO</p>
                <p className="text-xs text-[#6B6B6B]">Cta. <span className="font-semibold text-[#111]">1000929278</span></p>
              </div>
              <div className="border-t border-[#E8E8E8] pt-2">
                <p className="text-[9px] text-[#AAAAAA] uppercase tracking-wider">Concepto</p>
                <p className="text-xs font-bold text-[#111]">GARANTÍA DE BIG ONE</p>
              </div>
              <div className="border-t border-[#E8E8E8] pt-2">
                <p className="text-[9px] text-[#AAAAAA] uppercase tracking-wider">Monto a depositar</p>
                <p className="font-bold text-[#0015FF] text-2xl leading-none">{calcGarantia(preciodiario).monto}</p>
                <p className="text-[8px] text-[#AAAAAA] mt-0.5">100% reembolsable</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPaso('comprobante')}
              className="flex-1 bg-[#0015FF] hover:bg-[#0010CC] text-white font-bold uppercase tracking-[0.15em] text-[10px] py-2.5 rounded-lg transition-all active:scale-95">
              Ya pagué · Subir comprobante
            </button>
            <button onClick={onClose}
              className="flex-1 border border-[#E8E8E8] text-[#6B6B6B] hover:border-[#FF0033] hover:text-[#FF0033] font-bold uppercase tracking-[0.15em] text-[10px] py-2.5 rounded-lg transition-all active:scale-95">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // pantalla comprobante
  if (paso === 'comprobante') return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-lg max-w-sm w-full shadow-2xl p-6 relative"
        onClick={e => e.stopPropagation()}>
        <button onClick={() => setPaso('qr')} className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#111]"><X size={16}/></button>

        <p className="section-label text-[#0015FF] mb-1">Paso final</p>
        <h3 className="font-display text-2xl uppercase text-[#111] tracking-tight mb-1">Subir comprobante</h3>
        <p className="text-[11px] text-[#6B6B6B] mb-4">Sube una foto o captura de pantalla de tu comprobante de transferencia.</p>

        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden"
          onChange={e => seleccionarArchivo(e.target.files[0])} />

        <div className="mb-4">
          {preview ? (
            <div className="relative">
              <img src={preview} alt="comprobante" className="w-full max-h-48 object-contain border border-[#E8E8E8] rounded-lg bg-[#FAFAFA]" />
              <button onClick={() => { setArchivo(null); setPreview(null) }}
                className="absolute top-2 right-2 w-6 h-6 bg-[#FF0033] text-white rounded-full flex items-center justify-center">
                <X size={10} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current.click()}
              className="w-full border-2 border-dashed border-[#E0E0E0] hover:border-[#0015FF] rounded-lg py-8 flex flex-col items-center gap-2 text-[#AAAAAA] hover:text-[#0015FF] transition-all">
              <Upload size={24} />
              <span className="text-[11px] font-semibold">Toca para seleccionar imagen o PDF</span>
            </button>
          )}
        </div>

        {error && <p className="text-[11px] text-[#FF0033] mb-3">{error}</p>}

        <div className="flex flex-col gap-2">
          <button onClick={confirmarPago} disabled={subiendo}
            className="w-full bg-[#0015FF] hover:bg-[#0010CC] disabled:opacity-50 text-white font-bold uppercase tracking-[0.15em] text-[11px] py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2">
            {subiendo
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando…</>
              : <><Check size={13} /> Confirmar pago de garantía</>}
          </button>
          {!archivo && (
            <button onClick={() => confirmarPago()} disabled={subiendo}
              className="text-[10px] text-[#AAAAAA] hover:text-[#6B6B6B] text-center py-1">
              Confirmar sin comprobante
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return null
}

/* ─── car card ─────────────────────────────────────────────── */
export default function CarCard({ v }) {
  const [modal,     setModal]     = useState(null)
  const [paso,      setPaso]      = useState('nacionalidad')
  const [tipo,      setTipo]      = useState(null)
  const [datosDocs, setDatosDocs] = useState(null)
  const ahorroSem = v.preciodiario - v.preciosemanal
  const ahorroMes = v.preciodiario - v.preciomensual

  const { reservas_activas: reservasActivas } = useSettings()

  const cerrar = () => {
    setModal(null)
    setPaso('nacionalidad')
    setTipo(null)
    setDatosDocs(null)
  }

  function intentarReservar() {
    if (!reservasActivas) { setModal('no_disponible'); return }
    setModal('reservar')
  }

  return (
    <>
      <div className="card flex flex-col group">

        {/* image */}
        <div className="relative bg-white h-64 flex items-center justify-center overflow-hidden rounded-t-3xl border-b border-[#0015FF]/10">
          {v.imagen
            ? <img src={v.imagen} alt={v.modelo}
                className="w-full h-full object-contain object-center"
                onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex' }} />
            : null
          }
          <div className="w-full h-full flex items-center justify-center" style={{ display: v.imagen ? 'none' : 'flex' }}>
            <Car size={60} className="text-[#DBEAFE]" strokeWidth={1} />
          </div>
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="bg-white border border-[#0015FF]/20 text-[#0015FF] text-[9px] font-bold uppercase tracking-[0.3em] px-2.5 py-1 rounded-full shadow-sm">
              {catLabel[v.categoria] || v.categoria}
            </span>
            {v.año && (
              <span className="bg-white border border-[#E8E8E8] text-[#6B6B6B] text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                {v.año}
              </span>
            )}
          </div>
          {v.marca && (
            <span className="absolute top-3 right-3 bg-white border border-[#E8E8E8] text-[#6B6B6B] text-[9px] font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-full shadow-sm">
              {v.marca}
            </span>
          )}
        </div>

        {/* body */}
        <div className="p-5 flex flex-col gap-4 flex-1">
          <div>
            <h3 className="font-display text-2xl uppercase tracking-wide text-[#111] leading-none">{v.modelo}</h3>
            <p className="text-[11px] text-[#6B6B6B] mt-1 uppercase tracking-wider">
              {v.transmision}{v.colores ? ` · ${v.colores}` : ''}
            </p>
          </div>

          <div className="bg-[#0015FF]/10 rounded-md p-3 border border-[#0015FF]/20">
            <p className="section-label text-center mb-2.5">Precio por día según duración</p>
            <div className="grid grid-cols-3 divide-x divide-[#0015FF]/20">
              {[
                { label: 'Diario',  precio: v.preciodiario,  ahorro: 0 },
                { label: 'Semanal', precio: v.preciosemanal, ahorro: ahorroSem },
                { label: 'Mensual', precio: v.preciomensual, ahorro: ahorroMes },
              ].map(p => (
                <div key={p.label} className="text-center px-1">
                  <div className="font-display text-xl text-[#0015FF] leading-none tabular-nums">{p.precio.toLocaleString()}</div>
                  <div className="text-[9px] text-[#6B6B6B] uppercase tracking-widest mt-0.5">{p.label}</div>
                  {p.ahorro > 0 && <div className="text-[9px] font-bold text-[#16a34a] mt-0.5">-{p.ahorro}/día</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {v.features.filter(f => !f.includes('Seguro')).slice(0, 3).map(f => (
              <span key={f} className="flex items-center gap-1 text-[9px] text-[#0015FF] border border-[#0015FF]/20 bg-[#0015FF]/10 px-2 py-0.5 rounded-full">
                {featureIcon(f)} {f}
              </span>
            ))}
            <span className="text-[9px] font-bold text-[#0015FF] border border-[#0015FF]/30 bg-[#0015FF]/10 px-2 py-0.5 rounded-full">
              Seguro incluido
            </span>
          </div>

          <div className="mt-auto flex gap-2">
            <button disabled aria-disabled="true" title="Próximamente"
              className="flex-1 !py-2 !px-3 !text-[10px] !rounded-lg justify-center min-w-0 inline-flex flex-col items-center leading-tight bg-[#ECECEC] text-[#9A9A9A] font-bold uppercase tracking-wide cursor-not-allowed">
              Reservar <span className="text-[8px] font-semibold tracking-[0.15em]">Próximamente</span>
            </button>
            <button disabled aria-disabled="true" title="Próximamente"
              className="flex-1 !py-2 !px-3 !text-[10px] !rounded-lg justify-center min-w-0 inline-flex flex-col items-center leading-tight bg-[#F4F4F4] text-[#9A9A9A] font-bold uppercase tracking-wide border border-[#E3E3E3] cursor-not-allowed">
              Garantía <span className="text-[8px] font-semibold tracking-[0.15em]">Próximamente</span>
            </button>
          </div>
        </div>
      </div>

      {modal === 'no_disponible' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={cerrar}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#FF0033" strokeWidth="2"/>
                <path d="M16 9v8M16 21v2" stroke="#FF0033" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF0033] mb-2">No disponible</p>
            <h3 className="font-display text-2xl uppercase text-[#111] tracking-tight mb-3">
              Reservas no disponibles
            </h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
              Las reservas en línea no están disponibles en este momento.<br/>
              Contáctanos directamente para más información.
            </p>
            <button onClick={cerrar}
              className="w-full bg-[#0015FF] hover:bg-[#0010CC] text-white font-bold uppercase tracking-widest text-[11px] py-3 rounded-lg transition-all">
              Entendido
            </button>
          </div>
        </div>
      )}

      {modal === 'reservar' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          {paso === 'nacionalidad' && (
            <ModalNacionalidad
              onSelect={t => { setTipo(t); setPaso('docs') }}
              onClose={cerrar} />
          )}
          {paso === 'docs' && (
            <ModalDocumentos
              tipo={tipo}
              vehiculo={v.modelo}
              vehiculoId={v.id}
              onBack={() => setPaso('nacionalidad')}
              onContinuar={d => {
                setDatosDocs(d)
                setPaso('aviso')
              }}
              onClose={cerrar} />
          )}
          {paso === 'aviso' && (
            <ModalAviso
              onAceptar={() => setPaso('pago')}
              onBack={() => setPaso('docs')}
              onClose={cerrar} />
          )}
          {paso === 'pago' && (
            <ModalPago
              modelo={v.modelo}
              v={v}
              datos={datosDocs}
              tipo={tipo}
              onBack={() => setPaso('aviso')}
              onClose={cerrar} />
          )}
          {paso === 'exitoso' && (
            <ModalExitoso onClose={cerrar} />
          )}
        </div>
      )}
      {modal === 'garantia' && <ModalGarantia onClose={cerrar} preciodiario={v.preciodiario} />}
    </>
  )
}
