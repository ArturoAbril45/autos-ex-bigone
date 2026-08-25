import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Check, ImagePlus, Lock } from 'lucide-react'
import { vehiculos as vehiculosPredefinidos } from '../../data/vehiculos'

const CATS = [
  { key: 'econ',    label: 'Económico' },
  { key: 'sedan',   label: 'Sedán' },
  { key: 'suv',     label: 'SUV' },
  { key: 'premium', label: 'Premium' },
  { key: '4x4',     label: '4×4' },
  { key: 'lujo',    label: 'Lujo' },
]

const PREDEFINIDOS_IDS = new Set(vehiculosPredefinidos.map(v => v.id))

const empty = {
  modelo: '', marca: '', año: new Date().getFullYear(),
  categoria: 'suv', transmision: 'Automático',
  preciodiario: '', preciosemanal: '', preciomensual: '',
  colores: '', features: '', disponible: true,
  imagenes: ['', '', ''],
}

function leerVehiculos() {
  const adminList = JSON.parse(localStorage.getItem('bigone_vehiculos_admin') || '[]')
  const overrides  = JSON.parse(localStorage.getItem('bigone_vehiculos_overrides') || '{}')
  const deletedIds = new Set(JSON.parse(localStorage.getItem('bigone_vehiculos_deleted') || '[]'))

  const predefinidos = vehiculosPredefinidos
    .filter(v => !deletedIds.has(v.id))
    .map(v => {
      const base = {
        ...v,
        imagenes: [v.imagen || '', '', ''],
        disponible: v.disponible !== undefined ? v.disponible : true,
        _predefinido: true,
      }
      return overrides[v.id] ? { ...base, ...overrides[v.id], _predefinido: true } : base
    })

  return [...predefinidos, ...adminList]
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-1">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, ...rest }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} {...rest}
      className="w-full bg-white border border-[#E8E8E8] text-[#111] text-sm px-3 py-2
        focus:outline-none focus:border-[#FF0033] transition-colors" />
  )
}

function comprimirImagen(file, maxW = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxW / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = ev.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function guardarLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    return false
  }
}

function ImageSlot({ index, src, onChange }) {
  const ref = useRef()

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const compressed = await comprimirImagen(file)
      onChange(compressed)
    } catch {
      alert('No se pudo procesar la imagen.')
    }
  }

  return (
    <div className="relative">
      <div
        onClick={() => ref.current.click()}
        className={`border-2 border-dashed rounded cursor-pointer flex flex-col items-center justify-center transition-all
          ${src ? 'border-[#0015FF]/30 bg-[#F7F9FF]' : 'border-[#E8E8E8] hover:border-[#0015FF]/40 hover:bg-[#F7F9FF]'}`}
        style={{ height: 100 }}>
        {src ? (
          <img src={src} alt="" className="w-full h-full object-cover rounded" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#BBBBBB]">
            <ImagePlus size={20} />
            <span className="text-[10px] uppercase tracking-widest">Foto {index + 1}</span>
            <span className="text-[9px] text-[#CCCCCC]">Opcional</span>
          </div>
        )}
      </div>
      {src && (
        <button
          onClick={() => onChange('')}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF0033] text-white rounded-full flex items-center justify-center hover:bg-[#CC0000]">
          <X size={10} />
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

function Modal({ title, onClose, onSave, saving, form, setForm, esPredefinido }) {
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  function setImg(i, v) {
    setForm(f => {
      const imgs = [...(f.imagenes || ['', '', ''])]
      imgs[i] = v
      return { ...f, imagenes: imgs }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="bg-[#F7F7F7] border border-[#E8E8E8] w-full max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-black uppercase text-[#111] tracking-wide">{title}</h2>
            </div>
          <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#111]"><X size={18}/></button>
        </div>

        <div className="p-5 flex flex-col gap-4">

          <div>
            <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-2">
              Imágenes (hasta 3, opcionales)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map(i => (
                <ImageSlot key={i} index={i}
                  src={form.imagenes?.[i] || ''}
                  onChange={v => setImg(i, v)} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Modelo"><Input value={form.modelo} onChange={v => set('modelo', v)} placeholder="Kia Sportage" /></Field>
            <Field label="Marca"><Input value={form.marca} onChange={v => set('marca', v)} placeholder="Kia" /></Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Año"><Input type="number" value={form.año} onChange={v => set('año', v)} /></Field>
            <Field label="Categoría">
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)}
                className="w-full bg-white border border-[#E8E8E8] text-[#111] text-sm px-3 py-2 focus:outline-none focus:border-[#FF0033]">
                {CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Transmisión">
            <select value={form.transmision} onChange={e => set('transmision', e.target.value)}
              className="w-full bg-white border border-[#E8E8E8] text-[#111] text-sm px-3 py-2 focus:outline-none focus:border-[#FF0033]">
              <option value="Automático">Automático</option>
              <option value="Manual">Manual</option>
              <option value="Mecánico">Mecánico</option>
            </select>
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Precio/día (Bs)"><Input type="number" value={form.preciodiario}  onChange={v => set('preciodiario',  Number(v))} /></Field>
            <Field label="Precio/sem. (Bs)"><Input type="number" value={form.preciosemanal} onChange={v => set('preciosemanal', Number(v))} /></Field>
            <Field label="Precio/mes (Bs)"><Input type="number" value={form.preciomensual} onChange={v => set('preciomensual', Number(v))} /></Field>
          </div>

          <div className="flex items-center gap-2 bg-[#F0F4FF] border border-[#0015FF]/20 rounded px-4 py-3">
            <Lock size={13} className="text-[#0015FF] shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6B6B]">Anticipo de reserva </span>
              <span className="text-sm font-black text-[#0015FF]">1.000 Bs</span>
              <span className="text-[10px] text-[#6B6B6B] ml-1">(fijo, no modificable)</span>
            </div>
          </div>

          <Field label="Colores disponibles">
            <Input value={form.colores || ''} onChange={v => set('colores', v)} placeholder="Blanco, Negro, Gris" />
          </Field>

          <Field label="Características (separadas por coma)">
            <Input value={form.features || ''} onChange={v => set('features', v)} placeholder="GPS, Bluetooth, 5 pasajeros" />
          </Field>

          <label className="flex items-center gap-2 text-sm text-[#111] cursor-pointer select-none">
            <input type="checkbox" checked={form.disponible} onChange={e => set('disponible', e.target.checked)}
              className="accent-[#FF0033]" />
            Disponible en catálogo
          </label>
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-[#E8E8E8]">
          <button onClick={onClose}
            className="px-5 py-2 border border-[#E8E8E8] text-[#6B6B6B] text-sm hover:text-[#111]">
            Cancelar
          </button>
          <button onClick={onSave} disabled={saving || !form.modelo?.trim() || !form.preciodiario}
            className="px-5 py-2 bg-[#FF0033] text-white font-bold text-sm uppercase tracking-wide hover:bg-[#CC0000] disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminVehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [modal,  setModal]  = useState(null)
  const [form,   setForm]   = useState(empty)
  const [saving, setSaving] = useState(false)
  const [editandoPredefinido, setEditandoPredefinido] = useState(false)

  function cargar() { setVehiculos(leerVehiculos()) }

  useEffect(() => { cargar() }, [])

  function openNuevo() {
    setForm({ ...empty, imagenes: ['', '', ''] })
    setEditandoPredefinido(false)
    setModal('nuevo')
  }

  function openEdit(v) {
    setForm({
      ...v,
      features: Array.isArray(v.features) ? v.features.join(', ') : (v.features || ''),
      imagenes: v.imagenes?.length
        ? [...v.imagenes, '', '', ''].slice(0, 3)
        : v.imagen ? [v.imagen, '', ''] : ['', '', ''],
    })
    setEditandoPredefinido(!!v._predefinido)
    setModal(v.id)
  }

  function guardar() {
    setSaving(true)
    const { _predefinido, ...rest } = form
    const payload = {
      ...rest,
      features: typeof rest.features === 'string'
        ? rest.features.split(',').map(s => s.trim()).filter(Boolean)
        : rest.features,
      imagen: rest.imagenes?.find(Boolean) || null,
    }

    let ok = false
    if (modal === 'nuevo') {
      const lista = JSON.parse(localStorage.getItem('bigone_vehiculos_admin') || '[]')
      ok = guardarLS('bigone_vehiculos_admin', [...lista, { ...payload, id: Date.now() }])
    } else if (editandoPredefinido) {
      const overrides = JSON.parse(localStorage.getItem('bigone_vehiculos_overrides') || '{}')
      overrides[modal] = payload
      ok = guardarLS('bigone_vehiculos_overrides', overrides)
    } else {
      const lista = JSON.parse(localStorage.getItem('bigone_vehiculos_admin') || '[]')
      ok = guardarLS('bigone_vehiculos_admin', lista.map(v => v.id === modal ? { ...payload, id: modal } : v))
    }

    setSaving(false)
    if (!ok) {
      alert('No se pudo guardar: espacio del navegador lleno. Intenta con imágenes más pequeñas o elimina vehículos antiguos.')
      return
    }
    setModal(null)
    cargar()
  }

  function eliminar(v) {
    if (!confirm('¿Eliminar este vehículo del catálogo?')) return
    if (v._predefinido) {
      const deleted = JSON.parse(localStorage.getItem('bigone_vehiculos_deleted') || '[]')
      guardarLS('bigone_vehiculos_deleted', [...deleted, v.id])
    } else {
      const lista = JSON.parse(localStorage.getItem('bigone_vehiculos_admin') || '[]')
      guardarLS('bigone_vehiculos_admin', lista.filter(x => x.id !== v.id))
    }
    cargar()
  }

  const predefinidosCount = vehiculos.filter(v => v._predefinido).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight">Vehículos</h1>
          {predefinidosCount > 0 && (
            <p className="text-[11px] text-[#6B6B6B] mt-0.5">
              {predefinidosCount} del catálogo predefinido · {vehiculos.length - predefinidosCount} personalizados
            </p>
          )}
        </div>
        <button onClick={openNuevo}
          className="flex items-center gap-2 bg-[#FF0033] text-white font-bold uppercase tracking-widest text-xs px-4 py-2.5 hover:bg-[#CC0000]">
          <Plus size={14} /> Nuevo vehículo
        </button>
      </div>

      <div className="border border-[#E8E8E8] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
              {['Foto', 'Modelo', 'Marca', 'Año', 'Categoría', 'Precio/día', 'Disponible', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehiculos.map(v => (
              <tr key={v.id} className={`border-b border-[#E8E8E8]/80 hover:bg-[#F7F7F7] transition-colors ${v._predefinido ? 'bg-[#FFFDF5]' : ''}`}>
                <td className="px-4 py-3">
                  {v.imagen || v.imagenes?.find(Boolean)
                    ? <img src={v.imagen || v.imagenes.find(Boolean)} alt="" className="w-14 h-10 object-cover rounded border border-[#E8E8E8]" />
                    : <div className="w-14 h-10 bg-[#F0F0F0] rounded border border-[#E8E8E8] flex items-center justify-center text-[#CCCCCC]">
                        <ImagePlus size={14} />
                      </div>
                  }
                </td>
                <td className="px-4 py-3 text-[#111] font-medium whitespace-nowrap">{v.modelo}</td>
                <td className="px-4 py-3 text-[#6B6B6B]">{v.marca}</td>
                <td className="px-4 py-3 text-[#6B6B6B]">{v.año}</td>
                <td className="px-4 py-3 text-[#6B6B6B] capitalize">{CATS.find(c => c.key === v.categoria)?.label || v.categoria}</td>
                <td className="px-4 py-3 text-[#FF0033] font-bold whitespace-nowrap">{v.preciodiario} Bs</td>
                <td className="px-4 py-3">
                  {v.disponible
                    ? <Check size={14} className="text-green-500" />
                    : <X size={14} className="text-[#FF0033]" />}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(v)} className="text-[#6B6B6B] hover:text-[#111]">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => eliminar(v)} className="text-[#6B6B6B] hover:text-[#FF0033]">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehiculos.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-[#6B6B6B] text-sm mb-1">Sin vehículos en el catálogo.</p>
          </div>
        )}
      </div>

      {modal !== null && (
        <Modal
          title={modal === 'nuevo' ? 'Nuevo vehículo' : 'Editar vehículo'}
          onClose={() => setModal(null)}
          onSave={guardar}
          saving={saving}
          form={form}
          setForm={setForm}
          esPredefinido={editandoPredefinido}
        />
      )}
    </div>
  )
}
