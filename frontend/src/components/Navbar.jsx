import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, LogIn, MapPin } from 'lucide-react'

const links = [
  { to: '/',           label: 'Inicio',     exact: true },
  { to: '/catalogo',   label: 'Catálogo'               },
  { to: '/requisitos', label: 'Requisitos'              },
  { to: '/contacto',   label: 'Contacto'               },
  { to: '/redes',           label: 'Redes'              },
  { to: '/pago-servicios',  label: 'Pago de servicios' },
]

const social = [
  {
    href: 'https://wa.me/59167666665', label: 'WhatsApp',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  },
  {
    href: 'https://facebook.com/bigonerentacar', label: 'Facebook',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  },
  {
    href: 'https://instagram.com/big_onerentacar', label: 'Instagram',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
  },
  {
    href: 'https://tiktok.com/@bigonerentacar', label: 'TikTok',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>,
  },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ───── Tier 1: franja de info (se va al hacer scroll) ───── */}
      <div className="hidden md:block bg-[#111] border-b border-black/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/images/logo.png" alt="Big One Rent a Car" className="h-[56px] w-auto" />
          </Link>

          <div className="flex items-center gap-7">
            <div className="hidden lg:flex items-center gap-2">
              <MapPin size={16} className="text-[#FF0033]" />
              <div className="leading-tight">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8A8A8A]">Ubicación</p>
                <p className="text-[12px] font-semibold text-white">Santa Cruz · Bolivia</p>
              </div>
            </div>

            <a href="https://wa.me/59167666665" target="_blank" rel="noreferrer" className="leading-tight group">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8A8A8A]">Reservaciones</p>
              <p className="text-[13px] font-extrabold text-[#FFE600] group-hover:text-[#FF0033] transition-colors">+591 67666665</p>
            </a>

            <a href="tel:+59172123281" className="leading-tight group hidden lg:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8A8A8A]">Información</p>
              <p className="text-[13px] font-extrabold text-[#FFE600] group-hover:text-[#FF0033] transition-colors">72123281 · 62086179</p>
            </a>
          </div>
        </div>
      </div>

      {/* ───── Tier 2: barra de menú (sticky, queda fija al scrollear) ───── */}
      <div className="sticky top-0 z-50 bg-[#0015FF] border-t-[3px] border-[#FF0033] shadow-[0_3px_14px_rgba(0,0,0,0.18)]">
        <div className="max-w-7xl mx-auto px-6 relative flex items-center h-[52px]">
          {/* logo en móvil */}
          <Link to="/" className="md:hidden flex items-center">
            <img src="/images/logo.png" alt="Big One Rent a Car" className="h-8 w-auto brightness-0 invert" />
          </Link>

          {/* menú centrado (desktop) */}
          <nav className="hidden md:flex items-center gap-8 mx-auto">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.exact}
                className={({ isActive }) =>
                  `text-[11px] font-bold uppercase tracking-[0.14em] transition-colors
                   ${isActive ? 'text-[#FFE600] underline underline-offset-[7px] decoration-2 decoration-[#FFE600]' : 'text-white hover:text-[#FFE600]'}`
                }>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* derecha: admin + hamburguesa */}
          <div className="ml-auto md:absolute md:right-6 flex items-center gap-3">
            <Link to="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#0015FF] bg-[#FFE600] hover:bg-white rounded-full py-1.5 px-4 transition-colors">
              <LogIn size={12} /> Admin
            </Link>
            <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)} aria-label="Menú">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ───── overlay móvil ───── */}
      {open && (
        <div className="fixed inset-0 z-40 bg-[#FFE600] flex flex-col pt-[64px] md:hidden">
          <nav className="flex flex-col px-8 pt-8 gap-5">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.exact}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `font-display text-4xl uppercase tracking-wide transition-colors
                   ${isActive ? 'text-[#FF5A1F]' : 'text-[#111]'}`
                }>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-8 mt-10 flex flex-col gap-4">
            <a href="https://wa.me/59167666665" target="_blank" rel="noreferrer"
              className="text-sm font-bold text-[#0015FF]">WhatsApp · +591 67666665</a>
            <Link to="/admin/login" onClick={() => setOpen(false)}
              className="btn-ghost w-full justify-center !py-3 text-sm mt-2">
              <LogIn size={14} /> Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
