import { Phone, MapPin, AtSign, MessageCircle, Send } from 'lucide-react'

const canales = [
  { icon: MessageCircle, label: 'WhatsApp principal', val: '+591 67666665',       link: 'https://wa.me/59167666665',             bg: 'bg-[#25D366]/10', ico: 'text-[#1fa855]' },
  { icon: Phone,         label: 'Teléfonos',          val: '72123281 · 62086179', link: 'tel:+59172123281',                      bg: 'bg-[#0015FF]/10', ico: 'text-[#0015FF]' },
  { icon: AtSign,        label: 'Instagram',          val: '@big_onerentacar',    link: 'https://instagram.com/big_onerentacar', bg: 'bg-[#FF0033]/10', ico: 'text-[#FF0033]' },
  { icon: MapPin,        label: 'Dirección',          val: 'Av. Centenario entre 3/4to anillo c/Valeriano Ortiz #3405, Santa Cruz', link: null, bg: 'bg-[#FFE600]/40', ico: 'text-[#8a7400]' },
]

export default function Contacto() {
  return (
    <main className="">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 lg:px-14 py-14">

        <span className="inline-flex items-center gap-2 bg-[#0015FF]/8 text-[#0015FF] text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-5
          opacity-0 [animation:fadeUp_.55s_ease-out_forwards]">
          Estamos para ayudarte
        </span>
        <h1 className="font-display text-7xl md:text-8xl uppercase text-[#111] tracking-tight leading-none mb-5
          opacity-0 [animation:fadeUp_.55s_ease-out_.1s_forwards]">
          Contacto
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-14 max-w-md
          opacity-0 [animation:fadeUp_.55s_ease-out_.2s_forwards]">
          Escríbenos para consultar disponibilidad, precios o cualquier duda. Te respondemos a la brevedad.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {canales.map((c, i) => (
            <div key={c.label}
              className="group bg-white border border-[#E8E8E8] rounded-[1.75rem] p-6 flex items-start gap-4 shadow-card hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300
                opacity-0 [animation:fadeUp_.55s_ease-out_forwards]"
              style={{ animationDelay: `${0.25 + i * 0.08}s` }}>
              <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <c.icon size={19} className={c.ico} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="section-label mb-1.5 text-[10px]">{c.label}</p>
                {c.link ? (
                  <a href={c.link} target="_blank" rel="noreferrer"
                    className="text-sm text-[#111] font-semibold hover:text-[#FF0033] transition-colors break-words">
                    {c.val}
                  </a>
                ) : (
                  <p className="text-sm text-[#555] leading-relaxed">{c.val}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden bg-[#FF0033] rounded-[1.75rem] p-10 md:p-14 text-center
          opacity-0 [animation:fadeUp_.55s_ease-out_.6s_forwards]">
          <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#FFE600]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 w-56 h-56 rounded-full bg-[#0015FF]/25 blur-3xl" />

          <div className="relative">
            <h2 className="font-display text-5xl md:text-6xl uppercase text-white tracking-tight mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
              Reserva por<br/><span className="text-[#FFE600]">WhatsApp</span>
            </h2>
            <p className="text-white/85 text-sm mb-8 max-w-sm mx-auto">
              Cuéntanos qué vehículo necesitas, fechas y destino. Te cotizamos al instante.
            </p>
            <a href="https://wa.me/59167666665?text=Hola,%20quiero%20consultar%20disponibilidad%20de%20veh%C3%ADculos."
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#FFE600] text-[#111] font-bold uppercase tracking-[0.2em] text-[11px] px-9 py-4 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:bg-white hover:scale-[1.03] transition-all">
              <Send size={14} strokeWidth={2.5} /> Escribir ahora
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
