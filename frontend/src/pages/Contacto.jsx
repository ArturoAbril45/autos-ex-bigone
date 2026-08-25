import { Phone, MapPin, AtSign, MessageCircle } from 'lucide-react'

const canales = [
  { icon: MessageCircle, label: 'WhatsApp principal',   val: '+591 67666665',          link: 'https://wa.me/59167666665'             },
  { icon: Phone,         label: 'Teléfonos',            val: '72123281 · 62086179',    link: 'tel:+59172123281'                   },
  { icon: AtSign,        label: 'Instagram',            val: '@big_onerentacar',        link: 'https://instagram.com/big_onerentacar' },
  { icon: MapPin,        label: 'Dirección',            val: 'Av. Centenario entre 3/4to anillo c/Valeriano Ortiz #3405, Santa Cruz', link: null },
]

export default function Contacto() {
  return (
    <main className="pt-[64px]">
      <div className="max-w-4xl mx-auto px-6 lg:px-14 py-14">

        <p className="section-label mb-3">Estamos para ayudarte</p>
        <h1 className="font-display text-6xl uppercase text-[#111] tracking-tight leading-none mb-4">
          Contacto
        </h1>
        <p className="text-sm text-[#6B6B6B] mb-14">
          Escríbenos para consultar disponibilidad, precios o cualquier duda. Te respondemos a la brevedad.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {canales.map(c => (
            <div key={c.label} className="card p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center shrink-0">
                <c.icon size={16} className="text-[#FBBF24]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="section-label mb-1">{c.label}</p>
                {c.link ? (
                  <a href={c.link} target="_blank" rel="noreferrer"
                    className="text-sm text-[#111] font-medium hover:text-[#FF0033] transition-colors">
                    {c.val}
                  </a>
                ) : (
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{c.val}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-yellow-50 rounded-3xl p-10 text-center border border-[#0015FF]/20">
          <h2 className="font-display text-4xl uppercase text-[#111] tracking-tight mb-3">
            Reserva por WhatsApp
          </h2>
          <p className="text-[#6B6B6B] text-sm mb-7">
            Cuéntanos qué vehículo necesitas, fechas y destino. Te cotizamos al instante.
          </p>
          <a href="https://wa.me/59167666665?text=Hola,%20quiero%20consultar%20disponibilidad%20de%20veh%C3%ADculos."
            target="_blank" rel="noreferrer"
            className="btn-primary !px-8 !py-3.5">
            <MessageCircle size={15} /> Escribir ahora
          </a>
        </div>
      </div>
    </main>
  )
}
