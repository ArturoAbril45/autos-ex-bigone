import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { Search } from 'lucide-react'

export default function AdminClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    api.get('/admin/clientes')
      .then(d => setClientes(d.data || d))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const lista = clientes.filter(c =>
    !busqueda ||
    `${c.nombre} ${c.apellido} ${c.ci} ${c.email} ${c.telefono}`
      .toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight mb-8">Clientes</h1>

      <div className="relative max-w-sm mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, CI, email..."
          className="w-full bg-white border border-[#E8E8E8] text-[#111] text-sm pl-8 pr-3 py-2.5
            focus:outline-none focus:border-[#0015FF]" />
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm">Cargando...</div>
      ) : (
        <div className="border border-[#E8E8E8] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E8E8]">
                {['Nombre', 'CI', 'Teléfono', 'Email', 'Dirección', 'Reservas'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lista.map(c => (
                <tr key={c.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#F7F7F7] transition-colors">
                  <td className="px-4 py-3 text-[#111] font-medium whitespace-nowrap">{c.nombre} {c.apellido}</td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{c.ci}</td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{c.telefono}</td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{c.email}</td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{c.direccion}</td>
                  <td className="px-4 py-3 text-[#0015FF] font-bold">{c.reservas_count ?? c.reservas?.length ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && (
            <div className="px-5 py-8 text-[#6B6B6B] text-sm">
              {busqueda ? 'Sin resultados.' : 'Sin clientes aún.'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
