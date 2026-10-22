import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Car, CalendarDays, Users, TrendingUp, Wallet, LogOut, Menu, X, Tv2, ShieldCheck, UserCog, Activity } from 'lucide-react'
import { useState } from 'react'

const NAV_ADMIN = [
  { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { to: '/admin/vehiculos',  label: 'Vehículos',  icon: Car              },
  { to: '/admin/reservas',   label: 'Reservas',   icon: TrendingUp       },
  { to: '/admin/agenda',     label: 'Agenda',     icon: CalendarDays     },
  { to: '/admin/clientes',   label: 'Clientes',   icon: Users            },
  { to: '/admin/finanzas',   label: 'Finanzas',   icon: Wallet           },
  { to: '/admin/redes',      label: 'Redes',      icon: Tv2              },
  { to: '/admin/garantias',  label: 'Garantías',  icon: ShieldCheck      },
  { to: '/admin/usuarios',   label: 'Usuarios',   icon: UserCog          },
  { to: '/admin/logs',       label: 'Actividad',  icon: Activity         },
]

const NAV_ASESOR = [
  { to: '/admin/vehiculos',  label: 'Vehículos',  icon: Car          },
  { to: '/admin/reservas',   label: 'Reservas',   icon: TrendingUp   },
  { to: '/admin/agenda',     label: 'Agenda',     icon: CalendarDays },
  { to: '/admin/clientes',   label: 'Clientes',   icon: Users        },
]

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const nav = admin?.rol === 'asesor' ? NAV_ASESOR : NAV_ADMIN

  function handleLogout() { logout(); navigate('/admin/login') }

  return (
    <div className="min-h-screen bg-[#FFE600] flex">

      {/* sidebar */}
      <aside className={`fixed inset-y-3 left-3 z-40 w-56 bg-white rounded-[1.5rem] shadow-[0_18px_50px_rgba(0,0,0,0.14)] flex flex-col overflow-hidden
        transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-[130%]'} lg:translate-x-0`}>

        <div className="px-5 py-5 border-b border-[#E8E8E8]">
          <img src="/images/logo.png" alt="Big One" className="h-12 w-auto object-contain" />
          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mt-2">Panel Admin</div>
        </div>

        <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.exact}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors
                 ${isActive ? 'bg-[#0015FF] text-white' : 'text-[#111] hover:bg-[#F0F0F0]'}`
              }>
              <n.icon size={15} strokeWidth={1.5} /> {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#E8E8E8]">
          <div className="text-[10px] text-[#6B6B6B] mb-3 truncate">{admin?.name}</div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#FF0033] text-[11px] font-semibold uppercase tracking-wider transition-colors">
            <LogOut size={13} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setOpen(false)} />}

      {/* main */}
      <div className="flex-1 lg:ml-[248px] flex flex-col min-h-screen">
        <header className="h-14 bg-[#0015FF] border-b border-white/10 flex items-center px-5 gap-3 sticky top-0 z-20">
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="text-xs font-semibold text-white/60 ml-auto uppercase tracking-wider">Big One Rent a Car</span>
        </header>
        <main className="flex-1 p-5 md:p-8 bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
