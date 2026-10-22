import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { TrendingUp, Car, CalendarCheck, Users, Trophy } from 'lucide-react'

const ESTADOS = {
  pendiente:   { label: 'Pendiente',   color: 'text-[#FFE600]'  },
  confirmada:  { label: 'Confirmada',  color: 'text-[#0015FF]'  },
  activa:      { label: 'Activa',      color: 'text-green-500'  },
  completada:  { label: 'Completada',  color: 'text-[#6B6B6B]'  },
  cancelada:   { label: 'Cancelada',   color: 'text-[#FF0033]'  },
  pagada:      { label: 'Pagada',      color: 'text-[#16a34a]'  },
  anulada:     { label: 'Anulada',     color: 'text-[#FF0033]'  },
}

function BarChart({ data, keyVal, keyLabel, color = 'bg-[#0015FF]', height = 'h-24' }) {
  const max = Math.max(...data.map(d => d[keyVal]), 1)
  return (
    <div className={`flex items-end gap-1 ${height}`}>
      {data.map((d, i) => {
        const pct = (d[keyVal] / max) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            {d[keyVal] > 0 && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-[#0015FF] font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                {d[keyVal]}
              </div>
            )}
            <div className="w-full relative" style={{ height: `${Math.max(pct, 3)}%` }}>
              <div className={`absolute inset-0 ${color} opacity-80`} />
            </div>
            <div className="text-[8px] text-[#6B6B6B] uppercase leading-none text-center">{d[keyLabel]}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recientes, setRecientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/bigone/reservas'),
    ]).then(([d, r]) => {
      setStats(d)
      setRecientes((r.data || r).slice(0, 8))
    }).catch(() => setApiError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-[#6B6B6B] text-sm pt-8">Cargando...</div>
  if (apiError) return (
    <div className="text-center py-20">
      <p className="text-[#FF0033] font-bold mb-2">No se pudo conectar con el servidor</p>
      <p className="text-[#6B6B6B] text-sm">Verifica que el backend esté activo e intenta recargar la página.</p>
    </div>
  )

  const cards = [
    { icon: TrendingUp,    label: 'Ingresos del mes',      val: `${(stats?.ingresos_mes ?? 0).toLocaleString('es-BO')} Bs`, sub: 'confirmados + activos', accent: 'bg-[#FFE600]', ico: 'text-[#0015FF]' },
    { icon: CalendarCheck, label: 'Reservas activas',       val: stats?.reservas_activas  ?? 0, sub: 'en curso ahora',        accent: 'bg-[#0015FF]', ico: 'text-white'    },
    { icon: Car,           label: 'Vehículos disponibles',  val: stats?.vehiculos_libres  ?? 0, sub: `de ${stats?.vehiculos_total ?? 0} en flota`, accent: 'bg-[#FF0033]', ico: 'text-white' },
    { icon: Users,         label: 'Clientes registrados',   val: stats?.total_clientes    ?? 0, sub: 'acumulado',             accent: 'bg-[#0015FF]', ico: 'text-white'    },
  ]

  const topMax = Math.max(...(stats?.top_vehiculos ?? []).map(v => v.total_reservas), 1)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-black uppercase text-[#111] tracking-tight">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="border border-[#E8E8E8] rounded-md p-5 overflow-hidden relative">
            <c.icon size={18} className="text-[#0015FF] mb-3" strokeWidth={1.5} />
            <div className="font-display text-2xl font-black text-[#111]">{c.val}</div>
            <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mt-1">{c.label}</div>
            <div className="text-[10px] text-[#6B6B6B] mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* fila: ingresos mes + días semana */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-[#E8E8E8] rounded-md p-5">
          <h2 className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mb-4">
            Ingresos Bs — últimos 6 meses
          </h2>
          {stats?.ingresos_por_mes?.length > 0 ? (
            <BarChart data={stats.ingresos_por_mes} keyVal="total" keyLabel="mes" color="bg-[#0015FF]" height="h-28" />
          ) : (
            <div className="h-28 flex items-center justify-center text-[#6B6B6B] text-xs">Sin datos aún</div>
          )}
        </div>

        <div className="border border-[#E8E8E8] rounded-md p-5">
          <h2 className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mb-4">
            Salidas por día de la semana
          </h2>
          {stats?.reservas_por_dia?.some(d => d.total > 0) ? (
            <BarChart data={stats.reservas_por_dia} keyVal="total" keyLabel="dia" color="bg-[#FF0033]" height="h-28" />
          ) : (
            <div className="h-28 flex items-center justify-center text-[#6B6B6B] text-xs">Sin datos aún</div>
          )}
        </div>
      </div>

      {/* fila: top vehículos + temporada alta */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-[#E8E8E8] rounded-md p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={14} className="text-[#FFE600] drop-shadow" style={{ filter: 'drop-shadow(0 0 2px #0015FF)' }} />
            <h2 className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold">
              Vehículos con mayor flujo
            </h2>
          </div>
          {stats?.top_vehiculos?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {stats.top_vehiculos.map((v, i) => {
                const pct = (v.total_reservas / topMax) * 100
                return (
                  <div key={v.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black w-4 ${i === 0 ? 'text-[#FF0033]' : 'text-[#6B6B6B]'}`}>
                          #{i+1}
                        </span>
                        <span className="text-[#111] text-xs font-medium">{v.modelo}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="text-[#6B6B6B]">{v.total_reservas} reservas</span>
                        <span className="text-[#0015FF] font-bold">{v.total_ingresos.toLocaleString('es-BO')} Bs</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#F0F0F0] w-full rounded-full">
                      <div className="h-full bg-[#0015FF] rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-[#6B6B6B] text-xs">Sin reservas aún</div>
          )}
        </div>

        <div className="border border-[#E8E8E8] rounded-md p-5">
          <h2 className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold mb-4">
            Temporada alta — salidas por mes
          </h2>
          {stats?.reservas_por_mes?.some(d => d.total > 0) ? (
            <BarChart data={stats.reservas_por_mes} keyVal="total" keyLabel="mes" color="bg-[#FFE600]" height="h-28" />
          ) : (
            <div className="h-28 flex items-center justify-center text-[#6B6B6B] text-xs">Sin datos aún</div>
          )}
        </div>
      </div>

      {/* reservas recientes */}
      <div className="border border-[#E8E8E8] rounded-md overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E8E8E8] bg-[#0015FF]">
          <h2 className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Reservas recientes</h2>
        </div>
        {recientes.length === 0 ? (
          <div className="px-5 py-8 text-[#6B6B6B] text-sm">Sin reservas aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA]">
                  {['Cliente', 'Vehículo', 'Desde', 'Hasta', 'Total', 'Estado'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] text-[#6B6B6B] uppercase tracking-widest font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recientes.map(r => (
                  <tr key={r.id} className="border-b border-[#E8E8E8]/80 hover:bg-[#FFE600]/10 transition-colors">
                    <td className="px-4 py-3 text-[#111] whitespace-nowrap">{r.cliente ? `${r.cliente?.nombre ?? ''} ${r.cliente?.apellido ?? ''}` : r.nombre}</td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{r.vehiculo?.modelo ?? [r.vehiculo, r.año].filter(Boolean).join(' ')}</td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{r.fecha_inicio ?? r.fecha_ingreso}</td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{r.fecha_fin ?? r.fecha_entrega}</td>
                    <td className="px-4 py-3 text-[#0015FF] font-bold">{(r.precio_total ?? r.monto)?.toLocaleString('es-BO')} Bs</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${ESTADOS[r.estado]?.color ?? 'text-[#6B6B6B]'}`}>
                        {ESTADOS[r.estado]?.label ?? r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
