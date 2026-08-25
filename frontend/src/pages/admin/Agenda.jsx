import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

const COLORES_ESTADO = {
  pendiente:  'bg-yellow-400/70',
  confirmada: 'bg-blue-400/70',
  activa:     'bg-green-400/70',
  completada: 'bg-gray-300/60',
  cancelada:  'bg-red-400/60',
}

export default function Agenda() {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [reservas, setReservas] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [selVehiculo, setSelVehiculo] = useState('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/reservas'),
      api.get('/admin/vehiculos'),
    ]).then(([r, v]) => {
      setReservas(r.data || r)
      setVehiculos(v.data || v)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function prevMes() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMes() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )

  // Filter reservas
  const filtradas = selVehiculo === 'todos'
    ? reservas
    : reservas.filter(r => String(r.vehiculo_id) === String(selVehiculo))

  function getReservasForDay(day) {
    if (!day) return []
    const fecha = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return filtradas.filter(r => r.fecha_inicio <= fecha && r.fecha_fin >= fecha && r.estado !== 'cancelada')
  }

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div>
      <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight mb-6">Agenda</h1>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button onClick={prevMes} className="w-8 h-8 border border-[#E8E8E8] flex items-center justify-center text-[#6B6B6B] hover:text-[#111]">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[#111] font-bold text-sm min-w-[130px] text-center">
            {MESES[month]} {year}
          </span>
          <button onClick={nextMes} className="w-8 h-8 border border-[#E8E8E8] flex items-center justify-center text-[#6B6B6B] hover:text-[#111]">
            <ChevronRight size={16} />
          </button>
        </div>
        <select value={selVehiculo} onChange={e => setSelVehiculo(e.target.value)}
          className="bg-white border border-[#E8E8E8] text-[#111] text-xs px-3 py-2 focus:outline-none focus:border-[#FF0033]">
          <option value="todos">Todos los vehículos</option>
          {vehiculos.map(v => <option key={v.id} value={v.id}>{v.modelo} ({v.año})</option>)}
        </select>
      </div>

      {/* leyenda */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(COLORES_ESTADO).filter(([k]) => k !== 'cancelada').map(([k, c]) => (
          <div key={k} className="flex items-center gap-1.5 text-[10px] text-[#6B6B6B] uppercase tracking-wide">
            <div className={`w-2.5 h-2.5 ${c}`} />
            {k}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm">Cargando...</div>
      ) : (
        <div className="border border-[#E8E8E8] overflow-x-auto">
          {/* header días */}
          <div className="grid grid-cols-7 border-b border-[#E8E8E8]">
            {DIAS.map(d => (
              <div key={d} className="px-2 py-2 text-center text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold">
                {d}
              </div>
            ))}
          </div>
          {/* grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              const rs = getReservasForDay(day)
              return (
                <div key={idx}
                  className={`min-h-[72px] border-b border-r border-[#E8E8E8] p-1.5 relative
                    ${!day ? 'bg-[#F7F7F7]' : ''}
                    ${isToday(day) ? 'bg-[#FFF0EA]' : ''}`}>
                  {day && (
                    <>
                      <span className={`text-xs font-bold block mb-1
                        ${isToday(day) ? 'text-[#FF0033]' : 'text-[#6B6B6B]'}`}>
                        {day}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {rs.slice(0, 3).map(r => (
                          <div key={r.id}
                            title={`${r.vehiculo?.modelo} · ${r.cliente?.nombre} ${r.cliente?.apellido}`}
                            className={`text-[9px] text-white font-bold px-1 py-0.5 truncate ${COLORES_ESTADO[r.estado]}`}>
                            {r.vehiculo?.modelo?.split(' ')[0]}
                          </div>
                        ))}
                        {rs.length > 3 && (
                          <div className="text-[9px] text-[#6B6B6B]">+{rs.length - 3} más</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
