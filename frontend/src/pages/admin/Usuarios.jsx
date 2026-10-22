import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Eye, EyeOff, UserCheck, UserX } from 'lucide-react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

const empty = { nombre: '', email: '', password: '', rol: 'asesor', activo: true }

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold block mb-1">{label}</label>
      {children}
    </div>
  )
}

function Modal({ title, onClose, onSave, saving, esEdicion, form, setForm }) {
  const [verPass, setVerPass] = useState(false)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  const ok = form.nombre.trim() && form.email.trim() && (esEdicion || form.password.trim())

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div className="bg-white border border-[#E8E8E8] w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
          <h2 className="font-display font-black uppercase text-[#111] tracking-wide text-lg">{title}</h2>
          <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#111]"><X size={18}/></button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <Field label="Nombre completo">
            <input value={form.nombre} onChange={e => set('nombre', e.target.value)}
              placeholder="Juan Pérez"
              className="w-full border border-[#E8E8E8] text-sm px-3 py-2 text-[#111] focus:outline-none focus:border-[#0015FF]" />
          </Field>

          <Field label="Correo electrónico">
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="juan@bigone.com"
              className="w-full border border-[#E8E8E8] text-sm px-3 py-2 text-[#111] focus:outline-none focus:border-[#0015FF]" />
          </Field>

          <Field label={esEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'}>
            <div className="relative">
              <input type={verPass ? 'text' : 'password'} value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder={esEdicion ? 'Dejar en blanco para no cambiarla' : 'Mínimo 6 caracteres'}
                className="w-full border border-[#E8E8E8] text-sm px-3 py-2 pr-9 text-[#111] focus:outline-none focus:border-[#0015FF]" />
              <button type="button" onClick={() => setVerPass(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#111]">
                {verPass ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </Field>

          <Field label="Rol">
            <select value={form.rol} onChange={e => set('rol', e.target.value)}
              className="w-full border border-[#E8E8E8] text-sm px-3 py-2 text-[#111] focus:outline-none focus:border-[#0015FF] bg-white">
              <option value="asesor">Asesor — Vehículos, Reservas, Agenda, Clientes</option>
              <option value="admin">Admin — Acceso completo</option>
            </select>
          </Field>

          <label className="flex items-center gap-2 text-sm text-[#111] cursor-pointer select-none">
            <input type="checkbox" checked={form.activo} onChange={e => set('activo', e.target.checked)}
              className="accent-[#0015FF]" />
            Usuario activo
          </label>
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-[#E8E8E8]">
          <button onClick={onClose}
            className="px-5 py-2 border border-[#E8E8E8] text-[#6B6B6B] text-sm hover:text-[#111]">
            Cancelar
          </button>
          <button onClick={onSave} disabled={!ok || saving}
            className="px-5 py-2 bg-[#0015FF] text-white font-bold text-sm uppercase tracking-wide hover:bg-[#0010CC] disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsuarios() {
  const { admin } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modal, setModal] = useState(null)
  const [form,  setForm]  = useState(empty)
  const [saving, setSaving] = useState(false)

  function cargar() {
    setCargando(true)
    api.get('/admin/usuarios')
      .then(setUsuarios)
      .catch(e => alert('No se pudo cargar la lista de usuarios: ' + e.message))
      .finally(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  function openNuevo() { setForm({ ...empty }); setModal('nuevo') }
  function openEdit(u) { setForm({ ...u, password: '' }); setModal(u.id) }

  async function guardar() {
    setSaving(true)
    try {
      if (modal === 'nuevo') {
        await api.post('/admin/usuarios', form)
      } else {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await api.patch(`/admin/usuarios/${modal}`, payload)
      }
      setModal(null)
      cargar()
    } catch (e) {
      alert('No se pudo guardar: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActivo(u) {
    try {
      await api.patch(`/admin/usuarios/${u.id}`, { activo: !u.activo })
      cargar()
    } catch (e) {
      alert('No se pudo actualizar: ' + e.message)
    }
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await api.delete(`/admin/usuarios/${id}`)
      cargar()
    } catch (e) {
      alert('No se pudo eliminar: ' + e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight">Usuarios</h1>
        <button onClick={openNuevo}
          className="flex items-center gap-2 bg-[#0015FF] text-white font-bold uppercase tracking-widest text-xs px-4 py-2.5 hover:bg-[#0010CC]">
          <Plus size={14} /> Nuevo usuario
        </button>
      </div>

      <div className="border border-[#E8E8E8] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
              {['Nombre', 'Correo', 'Rol', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#F7F7F7] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#F0F0F0] flex items-center justify-center text-[#6B6B6B] text-xs font-black shrink-0">
                      {u.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="font-semibold text-[#111]">{u.name}</span>
                    {u.email === admin?.email && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#0015FF]">(tú)</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6B6B6B]">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border
                    ${u.rol === 'admin' ? 'border-[#0015FF]/20 text-[#0015FF]' : 'border-[#6B6B6B]/20 text-[#6B6B6B]'}`}>
                    {u.rol === 'admin' ? 'Admin' : 'Asesor'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.activo
                    ? <span className="flex items-center gap-1 text-[10px] font-bold text-[#16a34a]"><UserCheck size={12}/> Activo</span>
                    : <span className="flex items-center gap-1 text-[10px] font-bold text-[#FF0033]"><UserX size={12}/> Inactivo</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(u)}
                      className="text-[#6B6B6B] hover:text-[#111] transition-colors" title="Editar">
                      <Pencil size={14}/>
                    </button>
                    <button onClick={() => toggleActivo(u)}
                      className="text-[#6B6B6B] hover:text-[#0015FF] transition-colors"
                      title={u.activo ? 'Desactivar' : 'Activar'}>
                      {u.activo ? <UserX size={14}/> : <UserCheck size={14}/>}
                    </button>
                    <button onClick={() => eliminar(u.id)}
                      className="text-[#6B6B6B] hover:text-[#FF0033] transition-colors" title="Eliminar">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!cargando && usuarios.length === 0 && (
          <div className="px-5 py-10 text-center">
            <p className="text-[#6B6B6B] text-sm">Sin usuarios.</p>
          </div>
        )}
      </div>

      {modal !== null && (
        <Modal
          title={modal === 'nuevo' ? 'Nuevo usuario' : 'Editar usuario'}
          onClose={() => setModal(null)}
          onSave={guardar}
          saving={saving}
          esEdicion={modal !== 'nuevo'}
          form={form}
          setForm={setForm}
        />
      )}
    </div>
  )
}
