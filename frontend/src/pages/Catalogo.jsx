import { useState, useRef, useEffect } from 'react'
import { categorias } from '../data/vehiculos'
import { useVehiculos } from '../hooks/useVehiculos'
import CarCard from '../components/CarCard'
import { ArrowUpDown, ChevronDown, Check, LayoutGrid, Fuel, Car, CarFront, Crown, Mountain, Gem, Gauge, ShieldCheck } from 'lucide-react'

const ICONOS_CAT = {
  todos:   LayoutGrid,
  econ:    Fuel,
  sedan:   Car,
  suv:     CarFront,
  premium: Crown,
  '4x4':   Mountain,
  lujo:    Gem,
}

function CategoriaSidebar({ cat, setCat }) {
  return (
    <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:w-[190px] shrink-0">
      {categorias.map(c => {
        const Icon = ICONOS_CAT[c.key]
        const activo = cat === c.key
        return (
          <button key={c.key} onClick={() => setCat(c.key)}
            className={`flex items-center gap-2.5 shrink-0 text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2.5 rounded-xl transition-all duration-200 text-left
              ${activo
                ? 'bg-[#FF0033] text-white shadow-[0_4px_12px_rgba(255,0,51,0.35)]'
                : 'bg-white/70 text-[#0015FF] ring-1 ring-[#0015FF]/10 hover:bg-white hover:ring-[#0015FF]/25'}`}>
            <Icon size={15} strokeWidth={2.25} className={activo ? 'text-white' : 'text-[#0015FF]/70'} />
            {c.label}
          </button>
        )
      })}
    </div>
  )
}

const OPCIONES_ORDEN = [
  { value: 'precio-asc',  label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'nombre',      label: 'Nombre A–Z' },
]

function OrdenDropdown({ orden, setOrden }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const actual = OPCIONES_ORDEN.find(o => o.value === orden)

  useEffect(() => {
    const onClickOutside = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onEsc = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 border text-[#0015FF] text-[10px] font-bold uppercase tracking-wide pl-3.5 pr-3 py-1.5 rounded-full
          bg-white shadow-sm transition-all
          ${open ? 'border-[#FF0033] ring-2 ring-[#FF0033]/15' : 'border-[#0015FF]/30 hover:border-[#0015FF]'}`}>
        <ArrowUpDown size={12} strokeWidth={2.5} className={open ? 'text-[#FF0033]' : 'text-[#0015FF]/60'} />
        <span>{actual.label}</span>
        <ChevronDown size={13} strokeWidth={2.5}
          className={`transition-transform ${open ? 'text-[#FF0033] rotate-180' : 'text-[#0015FF]/60'}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-[#0015FF]/10 bg-white shadow-xl animate-[fadeIn_.12s_ease-out]">
          {OPCIONES_ORDEN.map(o => (
            <button key={o.value} type="button"
              onClick={() => { setOrden(o.value); setOpen(false) }}
              className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide transition-colors
                ${o.value === orden ? 'bg-[#FFE600]/40 text-[#0015FF]' : 'text-[#333] hover:bg-[#F5F6FF]'}`}>
              {o.label}
              {o.value === orden && <Check size={13} strokeWidth={3} className="text-[#FF0033] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Catalogo() {
  const vehiculos = useVehiculos()
  const [cat,   setCat]   = useState('todos')
  const [orden, setOrden] = useState('precio-asc')

  const filtrados = vehiculos
    .filter(v => cat === 'todos' || v.categoria === cat)
    .sort((a, b) => {
      if (orden === 'precio-asc')  return a.preciodiario - b.preciodiario
      if (orden === 'precio-desc') return b.preciodiario - a.preciodiario
      return a.modelo.localeCompare(b.modelo)
    })

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <main className="">
        {/* header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-14 py-14">
          <p className="section-label mb-3 text-[#0015FF] opacity-0 [animation:fadeUp_.55s_ease-out_forwards]">
            Flota completa
          </p>
          <h1 className="font-display text-7xl md:text-8xl uppercase text-[#111] tracking-tight leading-none drop-shadow-sm
            opacity-0 [animation:fadeUp_.55s_ease-out_.1s_forwards]">
            Catálogo
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 mt-5 opacity-0 [animation:fadeUp_.55s_ease-out_.2s_forwards]">
            <span className="flex items-center gap-1.5 bg-white/70 text-[#0015FF] text-[11px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full ring-1 ring-[#0015FF]/10">
              <Car size={13} strokeWidth={2.25} /> {vehiculos.length} vehículos
            </span>
            <span className="flex items-center gap-1.5 bg-white/70 text-[#0015FF] text-[11px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full ring-1 ring-[#0015FF]/10">
              <Gauge size={13} strokeWidth={2.25} /> 150 km libres diarios
            </span>
            <span className="flex items-center gap-1.5 bg-white/70 text-[#0015FF] text-[11px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full ring-1 ring-[#0015FF]/10">
              <ShieldCheck size={13} strokeWidth={2.25} /> Seguro incluido
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-14 py-10 flex flex-col lg:flex-row gap-8">
          {/* sidebar categorías */}
          <CategoriaSidebar cat={cat} setCat={setCat} />

          <div className="flex-1 min-w-0">
            {/* orden */}
            <div className="flex items-center justify-end mb-6">
              <OrdenDropdown orden={orden} setOrden={setOrden} />
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtrados.map(v => <CarCard key={v.id} v={v} />)}
            </div>

            {filtrados.length === 0 && (
              <div className="text-center py-20 text-[#6B6B6B] text-sm">
                No hay vehículos con esos filtros.
              </div>
            )}

          </div>
        </div>
      </main>
    </>
  )
}
