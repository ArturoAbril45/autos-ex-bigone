import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Check, ImagePlus } from 'lucide-react'
import { api } from '../../lib/api'

const CATS = [
  { key: 'econ',    label: 'Económico' },
  { key: 'sedan',   label: 'Sedán' },
  { key: 'suv',     label: 'SUV' },
  { key: 'premium', label: 'Premium' },
  { key: '4x4',     label: '4×4' },
  { key: 'lujo',    label: 'Lujo' },
]

const empty = {
  modelo: '', marca: '', año: new Date().getFullYear(),
  categoria: 'suv', transmision: 'Automático',
  preciodiario: '', preciosemanal: '', preciomensual: '',
  colores: '', features: '', disponible: true,
  imagenes: ['', '', ''],
}

function normalizar(v) {
  return {
    ...v,
    preciodiario: v.precio_diario,
    preciosemanal: v.precio_semanal,
    preciomensual: v.precio_mensual,
    colores: Array.isArray(v.colores) ? v.colores.join(', ') : (v.colores || ''),
  }
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

function comprimirImagen(file, maxW = 1280, quality = 0.82) {
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
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('toBlob falló')), 'image/jpeg', quality)
      }
      img.onerror = reject
      img.src = ev.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function ImageSlot({ index, src, onChange }) {
  const ref = useRef()
  const [subiendo, setSubiendo] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setSubiendo(true)
    try {
      const comprimido = await comprimirImagen(file)
      const formData = new FormData()
      formData.append('imagen', comprimido, file.name.replace(/\.\w+$/, '.jpg'))
      const { url } = await api.upload('/admin/vehiculos/upload-imagen', formData)
      onChange(url)
    } catch (err) {
      alert('No se pudo subir la imagen: ' + (err.message || 'error desconocido'))
    } finally {
      setSubiendo(false)
      e.target.value = ''
    }
  }

  return (
    <div className="relative">
      <div
        onClick={() => !subiendo && ref.current.click()}
        className={`border-2 border-dashed rounded cursor-pointer flex flex-col items-center justify-center transition-all
          ${src ? 'border-[#0015FF]/30 bg-[#F7F9FF]' : 'border-[#E8E8E8] hover:border-[#0015FF]/40 hover:bg-[#F7F9FF]'}`}
        style={{ height: 100 }}>
        {subiendo ? (
          <span className="text-[10px] uppercase tracking-widest text-[#0015FF]">Subiendo...</span>
        ) : src ? (
          <img src={src} alt="" className="w-full h-full object-cover rounded" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#BBBBBB]">
            <ImagePlus size={20} />
            <span className="text-[10px] uppercase tracking-widest">Foto {index + 1}</span>
            <span className="text-[9px] text-[#CCCCCC]">Opcional</span>
          </div>
        )}
      </div>
      {src && !subiendo && (
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

function Modal({ title, onClose, onSave, saving, form, setForm }) {
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
  const [cargando, setCargando] = useState(true)
  const [modal,  setModal]  = useState(null)
  const [form,   setForm]   = useState(empty)
  const [saving, setSaving] = useState(false)

  function cargar() {
    setCargando(true)
    api.get('/vehiculos')
      .then(data => setVehiculos(data.map(normalizar)))
      .catch(() => alert('No se pudo cargar el catálogo. Revisá tu conexión.'))
      .finally(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  function openNuevo() {
    setForm({ ...empty, imagenes: ['', '', ''] })
    setModal('nuevo')
  }

  function openEdit(v) {
    setForm({
      ...v,
      marca: v.marca || '',
      features: Array.isArray(v.features) ? v.features.join(', ') : (v.features || ''),
      imagenes: v.imagen ? [v.imagen, '', ''] : ['', '', ''],
    })
    setModal(v.id)
  }

  async function guardar() {
    setSaving(true)
    const payload = {
      modelo: form.modelo,
      marca: form.marca,
      año: Number(form.año),
      categoria: form.categoria,
      transmision: form.transmision,
      precio_diario: Number(form.preciodiario) || 0,
      precio_semanal: form.preciosemanal ? Number(form.preciosemanal) : null,
      precio_mensual: form.preciomensual ? Number(form.preciomensual) : null,
      colores: typeof form.colores === 'string'
        ? form.colores.split(',').map(s => s.trim()).filter(Boolean)
        : form.colores,
      features: typeof form.features === 'string'
        ? form.features.split(',').map(s => s.trim()).filter(Boolean)
        : form.features,
      imagen: form.imagenes?.find(Boolean) || null,
      disponible: !!form.disponible,
    }

    try {
      if (modal === 'nuevo') {
        await api.post('/admin/vehiculos', payload)
      } else {
        await api.put(`/admin/vehiculos/${modal}`, payload)
      }
      setModal(null)
      cargar()
    } catch (e) {
      alert('No se pudo guardar: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  async function eliminar(v) {
    if (!confirm('¿Eliminar este vehículo del catálogo?')) return
    try {
      await api.delete(`/admin/vehiculos/${v.id}`)
      cargar()
    } catch (e) {
      alert('No se pudo eliminar: ' + e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight">Vehículos</h1>
          <p className="text-[11px] text-[#6B6B6B] mt-0.5">{vehiculos.length} vehículos en el catálogo</p>
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
              <tr key={v.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#F7F7F7] transition-colors">
                <td className="px-4 py-3">
                  {v.imagen
                    ? <img src={v.imagen} alt="" className="w-14 h-10 object-cover rounded border border-[#E8E8E8]" />
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
        {!cargando && vehiculos.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-[#6B6B6B] text-sm mb-1">Sin vehículos en el catálogo.</p>
          </div>
        )}
        {cargando && (
          <div className="px-5 py-12 text-center">
            <p className="text-[#6B6B6B] text-sm mb-1">Cargando...</p>
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
        />
      )}
    </div>
  )
}
