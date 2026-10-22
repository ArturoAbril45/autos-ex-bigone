import { Phone, MapPin, AtSign } from 'lucide-react'
import { Link } from 'react-router-dom'

function ContactRow({ icon: Icon, children, href, multiline }) {
  const content = (
    <>
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/8 shrink-0 group-hover:bg-[#FF0033]/20 transition-colors">
        <Icon size={13} className="text-[#FF4D6D]" />
      </span>
      <span className={multiline ? 'text-[#999] leading-snug pt-1' : ''}>{children}</span>
    </>
  )
  const cls = `group flex items-center gap-3 text-sm text-[#ccc] hover:text-white transition-colors ${multiline ? 'items-start' : ''}`
  return href
    ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={cls}>{content}</a>
    : <div className={cls}>{content}</div>
}

export default function Footer() {
  return (
    <div className="px-3 sm:px-6 pb-3 sm:pb-6">
      <footer className="bg-[#111] text-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">

          <div>
            <div className="mb-5">
              <img src="/images/logo.png" alt="Big One Rent a Car" className="h-14 w-auto object-contain" />
            </div>
            <p className="text-sm text-[#999] leading-relaxed max-w-xs">
              Más de 40 vehículos disponibles para uso urbano o viaje. Reserva con anticipación según disponibilidad.
            </p>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-[#6B6B6B] mb-5">
              <span className="w-3 h-[2px] bg-[#FF0033] rounded-full" /> Contacto
            </h4>
            <div className="flex flex-col gap-3.5">
              <ContactRow icon={Phone} href="https://wa.me/59167666665">+591 67666665</ContactRow>
              <ContactRow icon={Phone} href="tel:+59172123281,+59162086179">72123281 / 62086179</ContactRow>
              <ContactRow icon={AtSign} href="https://instagram.com/big_onerentacar">@big_onerentacar</ContactRow>
              <ContactRow icon={MapPin} multiline>
                Av. Centenario entre 3/4to anillo c/Valeriano Ortiz #3405
              </ContactRow>
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-[#6B6B6B] mb-5">
              <span className="w-3 h-[2px] bg-[#FF0033] rounded-full" /> Navegación
            </h4>
            <div className="flex flex-col gap-2.5">
              {[['/', 'Inicio'], ['/catalogo', 'Catálogo'], ['/requisitos', 'Requisitos'], ['/contacto', 'Contacto'], ['/reservar', 'Reservar']].map(([to, label]) => (
                <Link key={to} to={to} className="text-sm text-[#999] hover:text-white hover:translate-x-1 transition-all w-fit">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="py-5 text-center text-[11px] text-[#555] uppercase tracking-widest">
          © {new Date().getFullYear()} SIDKAP · Santa Cruz, Bolivia
        </div>
      </footer>
    </div>
  )
}
