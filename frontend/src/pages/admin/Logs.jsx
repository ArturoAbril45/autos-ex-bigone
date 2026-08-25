import { useEffect, useState } from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import { api } from '../../lib/api'

const ACCION_STYLE = {
  papelera:           { label: 'Papelera',             cls: 'bg-red-50 text-[#FF0033] border-[#FF0033]/20' },
  eliminar_permanente:{ label: 'Eliminación permanente',cls: 'bg-red-100 text-[#CC0000] border-[#CC0000]/20' },
  restaurar:          { label: 'Restaurado',            cls: 'bg-green-50 text-[#16a34a] border-green-200' },
  restaurar_estado:   { label: 'Estado cambiado',       cls: 'bg-blue-50 text-[#0015FF] border-[#0015FF]/20' },
  anular:             { label: 'Anulada',               cls: 'bg-orange-50 text-[#F59E0B] border-[#F59E0B]/20' },
  exportar:           { label: 'Exportación CSV',       cls: 'bg-purple-50 text-purple-700 border-purple-200' },
}

function fmtFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-BO', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export default function AdminLogs() {
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)

  async function cargar() {
    setLoading(true)
    try {
      const data = await api.get('/admin/bigone/logs')
      setLogs(data)
    } catch {
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Activity size={22} className="text-[#0015FF]" />
          <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight">Registro de actividad</h1>
        </div>
        <button onClick={cargar} disabled={loading}
          className="flex items-center gap-2 border border-[#E8E8E8] text-[#6B6B6B] font-bold uppercase tracking-widest text-xs px-4 py-2.5 hover:text-[#111] hover:border-[#111] transition-all disabled:opacity-50">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {loading ? (
        <div className="border border-[#E8E8E8] px-5 py-12 text-center text-[#6B6B6B] text-sm">Cargando...</div>
      ) : logs.length === 0 ? (
        <div className="border border-[#E8E8E8] px-5 py-12 text-center text-[#6B6B6B] text-sm">
          Sin actividad registrada aún.
        </div>
      ) : (
        <div className="border border-[#E8E8E8] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
                {['Fecha', 'Acción', 'Descripción', 'Ref'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map(log => {
                const estilo = ACCION_STYLE[log.accion] || { label: log.accion, cls: 'bg-[#F0F0F0] text-[#6B6B6B] border-[#E8E8E8]' }
                return (
                  <tr key={log.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#F7F7F7] transition-colors">
                    <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap text-xs font-mono">{fmtFecha(log.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded-full whitespace-nowrap ${estilo.cls}`}>
                        {estilo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#111] text-xs">{log.descripcion || '—'}</td>
                    <td className="px-4 py-3 text-[#BBBBBB] text-xs font-mono">{log.ref_id || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
