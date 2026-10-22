import { Link } from 'react-router-dom'
import { Shield, Clock, Car, MapPin, ArrowRight, MessageCircle, Send, Star, Gauge, Headset } from 'lucide-react'
import { useVehiculos } from '../hooks/useVehiculos'
import CarCard from '../components/CarCard'

const stats = [
  { num: '50+',  label: 'Vehículos',     icon: Car,     bg: 'bg-[#FF0033]/10', color: 'text-[#FF0033]' },
  { num: '3',    label: 'Días mínimo',   icon: Clock,   bg: 'bg-[#0015FF]/10', color: 'text-[#0015FF]' },
  { num: '150',  label: 'Km libres/día', icon: Gauge,   bg: 'bg-[#FF0033]/10', color: 'text-[#FF0033]' },
  { num: '24/7', label: 'Atención',      icon: Headset, bg: 'bg-[#0015FF]/10', color: 'text-[#0015FF]' },
]

const ventajas = [
  { icon: Shield,  title: 'Seguro incluido',   desc: 'Todos los vehículos con seguro en el precio, sin sorpresas.',  bg: 'bg-[#0015FF]/10', ico: 'text-[#0015FF]' },
  { icon: Clock,   title: 'Reserva previa',     desc: 'Asegura tu vehículo con anticipación según disponibilidad.',   bg: 'bg-[#FF0033]/10', ico: 'text-[#FF0033]' },
  { icon: Car,     title: 'Flota variada',      desc: 'Económicos, SUVs, 4×4 y autos de lujo para cada necesidad.',  bg: 'bg-[#FFE600]/40', ico: 'text-[#8a7400]' },
  { icon: MapPin,  title: 'Urbano o viaje',     desc: 'Tarifas diferenciadas según destino y duración del alquiler.',bg: 'bg-[#0015FF]/10', ico: 'text-[#0015FF]' },
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
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
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
      <section className="max-w-7xl mx-auto px-6 -mt-10 md:-mt-14 relative z-10">
        <div className="bg-white rounded-[1.75rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#E8E8E8] grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#EFEFEF] overflow-hidden">
          {stats.map((s, i) => (
            <div key={s.num}
              className="group flex items-center gap-3.5 px-6 py-7 hover:bg-[#FAFAFA] transition-colors
                opacity-0 [animation:fadeUp_.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-11 h-11 rounded-2xl ${s.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <s.icon size={19} className={s.color} strokeWidth={1.75} />
              </div>
              <div>
                <div className={`font-display text-3xl leading-none ${s.color}`}>{s.num}</div>
                <div className="section-label mt-1.5 text-[10px]">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-24">
        <span className="inline-flex items-center gap-2 bg-[#0015FF]/8 text-[#0015FF] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-5
          opacity-0 [animation:fadeUp_.55s_ease-out_forwards]">
          Por qué elegirnos
        </span>
        <h2 className="font-display text-6xl md:text-7xl uppercase text-[#111] mb-14 tracking-tight leading-none
          opacity-0 [animation:fadeUp_.55s_ease-out_.1s_forwards]">
          Servicio diferente
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ventajas.map((v, i) => (
            <div key={v.title}
              className="group relative bg-white border border-[#E8E8E8] rounded-[1.75rem] p-7 shadow-card hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300
                opacity-0 [animation:fadeUp_.55s_ease-out_forwards]"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
              <div className={`relative w-14 h-14 rounded-2xl ${v.bg} ring-1 ring-black/5 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <v.icon size={22} className={v.ico} strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-xl uppercase tracking-tight text-[#111] mb-2">{v.title}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="bg-[#0015FF] py-24 rounded-[2rem] mx-3 sm:mx-6 mb-4 sm:mb-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 text-[#FFE600] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full ring-1 ring-white/15 mb-4
                opacity-0 [animation:fadeUp_.55s_ease-out_forwards]">
                <Star size={13} strokeWidth={2.5} /> Flota
              </span>
              <h2 className="font-display text-6xl md:text-7xl uppercase text-white tracking-tight leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]
                opacity-0 [animation:fadeUp_.55s_ease-out_.1s_forwards]">
                Vehículos<br/><span className="text-[#FFE600]">destacados</span>
              </h2>
            </div>
            <Link to="/catalogo"
              className="btn-primary !bg-[#FFE600] !text-[#111] hover:!bg-white hover:scale-[1.04] transition-all
                opacity-0 [animation:fadeUp_.55s_ease-out_.2s_forwards]">
              Ver todos <ArrowRight size={13} />
            </Link>
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
      <section className="relative overflow-hidden bg-[#FF0033] py-20 rounded-[2rem] mx-3 sm:mx-6 mb-4 sm:mb-6">
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#FFE600]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-[#0015FF]/25 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-14 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-white/10 text-[#FFE600] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full ring-1 ring-white/20 mb-6
              opacity-0 [animation:fadeUp_.55s_ease-out_forwards]">
              <MessageCircle size={13} strokeWidth={2.5} /> ¿Listo para reservar?
            </span>

            <h2 className="font-display text-6xl md:text-7xl uppercase text-white mb-5 tracking-tight leading-[0.95] drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]
              opacity-0 [animation:fadeUp_.55s_ease-out_.1s_forwards]">
              Escríbenos<br/><span className="text-[#FFE600]">ahora</span>
            </h2>

            <p className="text-white/85 text-base max-w-md mx-auto lg:mx-0
              opacity-0 [animation:fadeUp_.55s_ease-out_.2s_forwards]">
              Cuéntanos el vehículo, fechas y destino. Te cotizamos al instante.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0
            opacity-0 [animation:fadeUp_.55s_ease-out_.3s_forwards]">
            <Link to="/reservar"
              className="inline-flex items-center justify-center gap-2 bg-[#FFE600] text-[#111] font-bold uppercase tracking-[0.2em] text-[11px] px-10 py-4 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:bg-white hover:scale-[1.03] transition-all">
              <Send size={13} strokeWidth={2.5} /> Reservar ahora
            </Link>
            <a href="https://wa.me/59179462060?text=Hola%2C%20quiero%20reservar%20un%20veh%C3%ADculo"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold uppercase tracking-[0.2em] text-[11px] px-10 py-4 rounded-full hover:bg-white hover:text-[#FF0033] hover:scale-[1.03] transition-all">
              <MessageCircle size={13} strokeWidth={2.5} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
