import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, LogIn } from 'lucide-react'

const links = [
  { to: '/',           label: 'Inicio',     exact: true },
  { to: '/catalogo',   label: 'Catálogo'               },
  { to: '/requisitos', label: 'Requisitos'              },
  { to: '/contacto',   label: 'Contacto'               },
  { to: '/redes',           label: 'Redes'              },
  { to: '/pago-servicios',  label: 'Pago de servicios' },
]

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const forceWhite  = location.pathname === '/redes'
  const isHome      = location.pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center transition-all duration-300"
        style={!transparent
          ? { background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px) saturate(1.6)', borderBottom: '1px solid #E8E8E8' }
          : { background: 'transparent' }
        }
      >
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">

          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="Big One Rent a Car" className="h-9 w-auto" />
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.exact}
                className={({ isActive }) =>
                  `text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors
                   ${isActive ? 'text-[#FF0033]' : transparent ? 'text-white hover:text-[#FFE600]' : 'text-[#111] hover:text-[#FF0033]'}`
                }>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* right */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2.5">
              <a href="https://facebook.com/bigonerentacar" target="_blank" rel="noreferrer"
                className={`${transparent ? 'text-white/80' : 'text-[#6B6B6B]'} hover:text-[#1877F2] transition-colors`} aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://tiktok.com/@bigonerentacar" target="_blank" rel="noreferrer"
                className={`${transparent ? 'text-white/80' : 'text-[#6B6B6B]'} hover:text-[#111] transition-colors`} aria-label="TikTok">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                </svg>
              </a>
              <a href="https://instagram.com/big_onerentacar" target="_blank" rel="noreferrer"
                className={`${transparent ? 'text-white/80' : 'text-[#6B6B6B]'} hover:text-[#E1306C] transition-colors`} aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </div>

            <div className="hidden sm:block w-px h-4 bg-[#E8E8E8]" />
            <Link to="/admin/login"
              className={`hidden sm:inline-flex items-center gap-1.5 btn-ghost !py-2 !px-4 text-[10px] ${transparent ? '!border-white/40 !text-white hover:!bg-white/10' : ''}`}>
              <LogIn size={12} /> Admin
            </Link>
            <button className={`md:hidden p-2 ${transparent ? 'text-white' : 'text-[#111]'}`} onClick={() => setOpen(!open)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-[#FFE600] flex flex-col pt-[64px]">
          <nav className="flex flex-col px-8 pt-10 gap-5">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.exact}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `font-display text-5xl uppercase tracking-wide transition-colors
                   ${isActive ? 'text-[#FF5A1F]' : 'text-[#111]'}`
                }>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-8 mt-10 flex flex-col gap-3">
            <Link to="/admin/login" onClick={() => setOpen(false)}
              className="btn-ghost w-full justify-center !py-3 text-sm">
              <LogIn size={14} /> Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
