import { Link } from 'react-router-dom'
import { Shield, Clock, Car, MapPin, ArrowRight } from 'lucide-react'
import { useVehiculos } from '../hooks/useVehiculos'
import CarCard from '../components/CarCard'

const stats = [
  { num: '50+',  label: 'Vehículos',    color: 'text-[#FF0033]' },
  { num: '3',    label: 'Días mínimo',  color: 'text-[#0015FF]' },
  { num: '150',  label: 'Km libres/día',color: 'text-[#FF0033]' },
  { num: '24/7', label: 'Atención',     color: 'text-[#0015FF]' },
]

const ventajas = [
  { icon: Shield,  title: 'Seguro incluido',   desc: 'Todos los vehículos con seguro en el precio, sin sorpresas.',  bg: 'bg-white', ico: 'text-[#0015FF]' },
  { icon: Clock,   title: 'Reserva previa',     desc: 'Asegura tu vehículo con anticipación según disponibilidad.',   bg: 'bg-white', ico: 'text-[#FF0033]' },
  { icon: Car,     title: 'Flota variada',      desc: 'Económicos, SUVs, 4×4 y autos de lujo para cada necesidad.',  bg: 'bg-white', ico: 'text-[#0015FF]' },
  { icon: MapPin,  title: 'Urbano o viaje',     desc: 'Tarifas diferenciadas según destino y duración del alquiler.',bg: 'bg-white', ico: 'text-[#FF0033]' },
]

export default function Home() {
  const vehiculos = useVehiculos()
  const destacados = vehiculos.filter(v => [3, 9, 11, 17].includes(v.id))

  return (
    <main>
      <style>{`
        @keyframes heroPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes personaFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes titila {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.7; }
        }
        @keyframes carFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .hero-ciudad  { height: 100%; }
        .hero-persona { transform: translateX(-50%); bottom: -5%; opacity: 0; animation: heroFadeIn 0.8s ease 0.3s forwards; }
        .hero-letras  { transform: translate(-50%, -50%) scale(0.95); opacity: 0; animation: heroFadeIn 0.6s ease 0s forwards, titila 3s ease-in-out 0.8s infinite; }
        .hero-3carros { opacity: 0; animation: heroFadeIn 0.8s ease 0.5s forwards; }
        .hero-suv     { opacity: 0; animation: heroFadeIn 0.8s ease 0.7s forwards, carFloat 3.5s ease-in-out 1.6s infinite; }
        @media (min-width: 768px) {
          .hero-ciudad  { height: 60%; }
          .hero-persona { bottom: 40%; }
          .hero-letras  { transform: translate(-50%, -50%) scale(0.3); }
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-transparent md:bg-[#1515EE]" style={{ height: '100vh', minHeight: 640 }}>

        {/* Fondo ciudad — full en mobile, 60% en desktop */}
        <div className="absolute top-0 left-0 right-0 hero-ciudad">
          <img src="/images/hero/paisaje.jpeg" alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Persona */}
        <img
          src="/images/hero/persona.png"
          alt="Conductor"
          className="absolute z-10 object-contain object-bottom select-none hero-persona"
          style={{ height: '60%', left: '50%' }}
        />

        {/* Letras "Muévete sin Límites" */}
        <img
          src="/images/hero/letras.png"
          alt="Muévete sin Límites"
          className="absolute z-10 select-none w-[100%] hero-letras"
          style={{ top: '48%', left: '50%', transformOrigin: 'center center' }}
        />

        {/* 3 carros — izquierda, dentro de la franja azul (solo desktop) */}
        <img
          src="/images/hero/3carros.png"
          alt="Flota de vehículos"
          className="absolute z-10 object-contain object-bottom select-none hidden md:block hero-3carros"
          style={{ bottom: '0%', left: '8%', height: '80%' }}
        />

        {/* SUV grande — derecha (solo desktop) */}
        <img
          src="/images/hero/carro-solo.png"
          alt="SUV"
          className="absolute z-20 object-contain object-bottom select-none hidden md:block hero-suv"
          style={{ bottom: '-8%', right: '2%', height: '75%' }}
        />

      </section>

      {/* STATS */}
      <section className="border-y border-[#E8E8E8]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E8E8E8]">
          {stats.map(s => (
            <div key={s.num} className="py-10 text-center">
              <div className={`font-display text-5xl leading-none ${s.color}`}>{s.num}</div>
              <div className="section-label mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-24">
        <p className="section-label mb-4">Por qué elegirnos</p>
        <h2 className="font-display text-5xl uppercase text-[#111] mb-14 tracking-tight">
          Servicio diferente
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ventajas.map(v => (
            <div key={v.title}>
              <div className={`w-10 h-10 rounded-2xl ${v.bg} flex items-center justify-center mb-4`}>
                <v.icon size={18} className={v.ico} strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-[#111] text-sm mb-2">{v.title}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="bg-[#0015FF] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="section-label mb-3 text-[#FFE600]">Flota</p>
              <h2 className="font-display text-5xl uppercase text-white tracking-tight">
                Vehículos destacados
              </h2>
            </div>
            <Link to="/catalogo" className="btn-ghost !border-white/30 !text-white hover:!bg-white/10">Ver todos <ArrowRight size={13} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {destacados.map(v => <CarCard key={v.id} v={v} />)}
          </div>
        </div>
      </section>

      {/* GARANTÍA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-24">
        <div className="bg-[#FFE600] rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center border-2 border-[#0015FF]/20">
          <div>
            <p className="section-label mb-4">Garantía</p>
            <h2 className="font-display text-4xl uppercase text-[#111] tracking-tight mb-4">
              Depósito reembolsable
            </h2>
            <p className="text-sm text-[#333] leading-relaxed mb-6">
              La garantía es <strong className="text-[#111]">100% reembolsable</strong> al devolver el vehículo en las mismas condiciones. No corresponde al pago del alquiler.
            </p>
            <div className="flex gap-3 flex-wrap">
              {[
                { monto: '3.500 Bs', color: 'text-[#0015FF]' },
                { monto: '5.000 Bs', color: 'text-[#FF0033]' },
                { monto: '7.000 Bs', color: 'text-[#0015FF]' },
              ].map(g => (
                <div key={g.monto} className="bg-white border border-[#E8E8E8] rounded-2xl px-4 py-3 text-center shadow-card">
                  <div className={`font-display text-2xl ${g.color}`}>{g.monto}</div>
                  <div className="section-label mt-1">desde</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="section-label mb-1">Formas de pago</p>
            {[
              { label: 'Pago con Tarjeta',                      color: 'bg-[#FF0033]' },
              { label: 'Transferencia bancaria',               color: 'bg-[#0015FF]' },
              { label: 'QR (clientes del exterior)',           color: 'bg-[#0015FF]' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-3 bg-white border border-[#E8E8E8] rounded-2xl px-4 py-3 shadow-card">
                <div className={`w-2 h-2 rounded-full ${p.color}`} />
                <span className="text-sm text-[#111]">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#FF0033] py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="section-label text-[#FFE600] mb-5">¿Listo para reservar?</p>
          <h2 className="font-display text-6xl uppercase text-white mb-5 tracking-tight">
            Escríbenos ahora
          </h2>
          <p className="text-white/80 text-sm mb-8">
            Cuéntanos el vehículo, fechas y destino. Te cotizamos al instante.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/reservar"
              className="inline-flex items-center justify-center gap-2 bg-[#FFE600] text-[#111] font-bold uppercase tracking-[0.2em] text-[11px] px-8 py-4 hover:bg-white transition-colors">
              Reservar ahora
            </Link>
            <a href="https://wa.me/59179462060?text=Hola%2C%20quiero%20reservar%20un%20veh%C3%ADculo"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold uppercase tracking-[0.2em] text-[11px] px-8 py-4 hover:bg-white hover:text-[#FF0033] transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
