import { CheckCircle2, ShieldCheck, CreditCard, QrCode, Info, FileCheck2, Globe2 } from 'lucide-react'

const reqLocal = [
  'Foto de cédula de identidad (vigente)',
  'Foto de licencia de conducir (vigente)',
  'Foto de factura de luz o agua (vigente)',
  'Ubicación exacta de domicilio (Google Maps)',
  'Verificación de domicilio',
  'Pago adelantado de los días requeridos',
]

const reqInterior = [
  'Foto de cédula de identidad (vigente)',
  'Foto de licencia de conducir (vigente)',
  'Voucher o reserva de su hotel',
  'Pago adelantado',
  'Depósito de garantía',
  'Pago por QR disponible de forma independiente',
]

const garantias = [
  { monto: '3.500 Bs', desc: 'Hasta 490 Bs/día',     color: 'text-[#0015FF]' },
  { monto: '5.000 Bs', desc: 'Vehículos intermedios', color: 'text-[#FF0033]' },
  { monto: '7.000 Bs', desc: 'Premium / 4×4',         color: 'text-[#0015FF]' },
]

const pagos = [
  { label: 'Tarjeta débito y crédito',             icon: CreditCard, bg: 'bg-[#FF0033]/10', ico: 'text-[#FF0033]' },
  { label: 'QR',                                   icon: QrCode,     bg: 'bg-[#0015FF]/10', ico: 'text-[#0015FF]' },
  { label: 'QR independiente (clientes extranjeros)', icon: QrCode,  bg: 'bg-[#FF0033]/10', ico: 'text-[#FF0033]' },
]

export default function Requisitos() {
  return (
    <main className="">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 lg:px-14 py-14">

        {/* header */}
        <span className="inline-flex items-center gap-2 bg-[#0015FF]/8 text-[#0015FF] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-5
          opacity-0 [animation:fadeUp_.55s_ease-out_forwards]">
          Antes de reservar
        </span>
        <h1 className="font-display text-7xl md:text-8xl uppercase text-[#111] tracking-tight leading-none mb-5
          opacity-0 [animation:fadeUp_.55s_ease-out_.1s_forwards]">
          Requisitos
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-14
          opacity-0 [animation:fadeUp_.55s_ease-out_.2s_forwards]">
          Duración mínima de alquiler: <strong className="text-[#111]">3 días</strong>. Reserva con anticipación.
        </p>

        {/* requisitos */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {[
            { title: 'Residentes en Bolivia', items: reqLocal, icon: FileCheck2 },
            { title: 'Del interior o del extranjero', items: reqInterior, icon: Globe2 },
          ].map((g, gi) => (
            <div key={g.title}
              className="bg-white border border-[#E8E8E8] rounded-[1.75rem] p-7 shadow-card hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300
                opacity-0 [animation:fadeUp_.55s_ease-out_forwards]"
              style={{ animationDelay: `${0.2 + gi * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#E8E8E8]">
                <div className="w-10 h-10 rounded-2xl bg-[#0015FF]/10 flex items-center justify-center shrink-0">
                  <g.icon size={18} className="text-[#0015FF]" strokeWidth={1.75} />
                </div>
                <h2 className="font-display text-xl uppercase tracking-tight text-[#111]">{g.title}</h2>
              </div>
              <ul className="flex flex-col gap-3.5">
                {g.items.map(r => (
                  <li key={r} className="flex items-start gap-3 text-sm text-[#444] leading-snug">
                    <CheckCircle2 size={16} className="text-[#FF0033] shrink-0 mt-0.5" strokeWidth={2} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* garantía */}
        <div className="relative overflow-hidden bg-[#0015FF] rounded-[1.75rem] p-8 md:p-10 mb-8
          opacity-0 [animation:fadeUp_.55s_ease-out_.4s_forwards]">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#FFE600]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 bg-white/10 text-[#FFE600] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full ring-1 ring-white/15 mb-5">
              <ShieldCheck size={13} strokeWidth={2.5} /> Garantía
            </span>
            <h2 className="font-display text-4xl uppercase text-white tracking-tight mb-3">Depósito reembolsable</h2>
            <p className="text-sm text-white/75 mb-7 max-w-xl leading-relaxed">
              100% reembolsable al devolver el vehículo en las mismas condiciones.{' '}
              <span className="text-[#FFE600] font-medium">La garantía no corresponde al pago del alquiler.</span>
            </p>
            <div className="grid grid-cols-3 gap-4">
              {garantias.map(g => (
                <div key={g.monto} className="bg-white rounded-2xl p-5 text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                  <div className={`font-display text-2xl md:text-3xl ${g.color}`}>{g.monto}</div>
                  <div className="section-label mt-1.5 text-[10px]">{g.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* pago */}
        <div className="bg-white border border-[#E8E8E8] rounded-[1.75rem] p-7 mb-6 shadow-card
          opacity-0 [animation:fadeUp_.55s_ease-out_.5s_forwards]">
          <h2 className="font-display text-xl uppercase tracking-tight text-[#111] mb-5">Formas de pago</h2>
          <div className="flex gap-3 flex-wrap">
            {pagos.map(p => (
              <div key={p.label} className={`flex items-center gap-2.5 ${p.bg} rounded-full pl-3 pr-5 py-2.5`}>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <p.icon size={14} className={p.ico} strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-[#111]">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* avisos */}
        <div className="flex flex-col gap-3
          opacity-0 [animation:fadeUp_.55s_ease-out_.6s_forwards]">
          <div className="flex items-start gap-3 text-[#333] text-xs rounded-2xl p-4 bg-[#FFE600]/60 border border-[#FFE600]">
            <Info size={15} className="text-[#8a7400] shrink-0 mt-0.5" strokeWidth={2} />
            <span><strong>Condición de entrega y devolución:</strong> el vehículo se entrega lavado y con tanque a full. Debe devolverse en las mismas condiciones.</span>
          </div>
          <div className="flex items-start gap-3 text-[#333] text-xs rounded-2xl p-4 bg-[#FFE600]/60 border border-[#FFE600]">
            <Info size={15} className="text-[#8a7400] shrink-0 mt-0.5" strokeWidth={2} />
            Los precios y condiciones pueden variar según tipo de uso y duración. Consulta disponibilidad antes de reservar.
          </div>
        </div>
      </div>
    </main>
  )
}
