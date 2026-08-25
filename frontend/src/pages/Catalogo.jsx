import { useState } from 'react'
import { categorias } from '../data/vehiculos'
import { useVehiculos } from '../hooks/useVehiculos'
import CarCard from '../components/CarCard'
import { X } from 'lucide-react'

const LOGOS = {
  Suzuki:    '/logos/suzuki.png',
  Kia:       '/logos/kia.png',
  Chery:     '/logos/chery.png',
  Nissan:    '/logos/nissan.png',
  Toyota:    '/logos/toyota.png',
  Mazda:     '/logos/mazda.png',
  GAC:       '/logos/gac.png',
  Terralord: null,
  AION:      null,
}

function BrandTicker({ marcaActiva, onSelect, marcas }) {
  const loop = [...marcas, ...marcas, ...marcas]
  return (
    <div className="py-5 bg-[#FFE600]">
      <div className="overflow-hidden">
        <div className="flex items-center gap-14 marquee-track">
          {loop.map((m, i) => (
            <button key={i} onClick={() => onSelect(marcaActiva === m ? null : m)}
              className={`shrink-0 flex flex-col items-center gap-1.5 transition-all group
                ${marcaActiva === m ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}>
              {LOGOS[m]
                ? <img src={LOGOS[m]} alt={m}
                    className={`h-14 w-auto object-contain transition-all
                      ${marcaActiva === m ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                : <span className={`font-display text-sm uppercase tracking-[0.3em] font-bold transition-colors
                    ${marcaActiva === m ? 'text-[#FF0033]' : 'text-[#0015FF] group-hover:text-[#FF0033]'}`}>
                    {m}
                  </span>
              }
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Catalogo() {
  const vehiculos = useVehiculos()
  const [cat,   setCat]   = useState('todos')
  const [marca, setMarca] = useState(null)
  const [orden, setOrden] = useState('precio-asc')

  const marcas = [...new Set(vehiculos.map(v => v.marca).filter(Boolean))]

  const filtrados = vehiculos
    .filter(v => cat === 'todos' || v.categoria === cat)
    .filter(v => !marca || v.marca === marca)
    .sort((a, b) => {
      if (orden === 'precio-asc')  return a.preciodiario - b.preciodiario
      if (orden === 'precio-desc') return b.preciodiario - a.preciodiario
      return a.modelo.localeCompare(b.modelo)
    })

  return (
    <>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-33.333%) } }
        .marquee-track { animation: marquee 32s linear infinite; width: max-content; }
      `}</style>

      <main className="pt-[64px]">
        {/* header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-14 py-14">
          <p className="section-label mb-3 text-[#0015FF]">Flota completa</p>
          <h1 className="font-display text-6xl uppercase text-[#111] tracking-tight leading-none">
            Catálogo
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-3">
            {vehiculos.length} vehículos · 150 km libres diarios · Seguro incluido
          </p>
        </div>

        {/* brand ticker */}
        <BrandTicker marcaActiva={marca} onSelect={setMarca} marcas={marcas} />

        <div className="max-w-7xl mx-auto px-6 lg:px-14 py-10">
          {/* filtros */}
          <div className="flex flex-wrap items-center gap-3 mb-8 justify-between">
            <div className="flex flex-wrap gap-2">
              {categorias.map(c => (
                <button key={c.key} onClick={() => setCat(c.key)}
                  className={`text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border transition-all
                    ${cat === c.key ? 'bg-[#FF0033] border-[#FF0033] text-white' : 'border-[#0015FF]/30 text-[#0015FF] hover:border-[#FF0033] hover:text-[#FF0033]'}`}>
                  {c.label}
                </button>
              ))}
            </div>
            <select value={orden} onChange={e => setOrden(e.target.value)}
              className="border border-[#0015FF]/30 text-[#0015FF] text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-full focus:outline-none focus:border-[#0015FF] bg-white">
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre A–Z</option>
            </select>
          </div>

          {/* filtro activo */}
          {marca && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] text-[#6B6B6B]">Marca:</span>
              <span className="flex items-center gap-1.5 bg-[#FFE600] text-[#0015FF] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                {marca}
                <button onClick={() => setMarca(null)}><X size={11} /></button>
              </span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtrados.map(v => <CarCard key={v.id} v={v} />)}
          </div>

          {filtrados.length === 0 && (
            <div className="text-center py-20 text-[#6B6B6B] text-sm">
              No hay vehículos con esos filtros.
            </div>
          )}

          <p className="mt-14 text-[#6B6B6B] text-xs text-center border-t border-[#E8E8E8] pt-8">
            Precios sujetos a cambio según tipo de uso (urbano o viaje) y duración. Consulta disponibilidad antes de reservar.
          </p>
        </div>
      </main>
    </>
  )
}
