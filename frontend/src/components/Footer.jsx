import { Phone, MapPin, AtSign } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        <div>
          <div className="mb-5">
            <img src="/images/logo.png" alt="Big One Rent a Car" className="h-14 w-auto object-contain" />
          </div>
          <p className="text-sm text-[#888] leading-relaxed">
            Más de 40 vehículos disponibles para uso urbano o viaje. Reserva con anticipación según disponibilidad.
          </p>
        </div>

        <div>
          <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#6B6B6B] mb-5">Contacto</h4>
          <div className="flex flex-col gap-3">
            <a href="https://wa.me/59167666665" target="_blank" rel="noreferrer"
              className="flex items-center gap-2.5 text-sm text-[#ccc] hover:text-white transition-colors">
              <Phone size={13} className="text-[#0015FF]" /> +591 67666665
            </a>
            <a href="tel:+59172123281,+59162086179"
              className="flex items-center gap-2.5 text-sm text-[#ccc] hover:text-white transition-colors">
              <Phone size={13} className="text-[#0015FF]" /> 72123281 / 62086179
            </a>
<a href="https://instagram.com/big_onerentacar" target="_blank" rel="noreferrer"
              className="flex items-center gap-2.5 text-sm text-[#ccc] hover:text-white transition-colors">
              <AtSign size={13} className="text-[#0015FF]" /> @big_onerentacar
            </a>
            <div className="flex items-start gap-2.5 text-sm text-[#888]">
              <MapPin size={13} className="text-[#0015FF] mt-0.5 shrink-0" />
              Av. Centenario entre 3/4to anillo c/Valeriano Ortiz #3405
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#6B6B6B] mb-5">Navegación</h4>
          <div className="flex flex-col gap-2.5">
            {[['/', 'Inicio'], ['/catalogo', 'Catálogo'], ['/requisitos', 'Requisitos'], ['/contacto', 'Contacto'], ['/reservar', 'Reservar']].map(([to, label]) => (
              <Link key={to} to={to} className="text-sm text-[#888] hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-[11px] text-[#555] uppercase tracking-widest">
        © {new Date().getFullYear()} SIDKAP · Santa Cruz, Bolivia
      </div>
    </footer>
  )
}
