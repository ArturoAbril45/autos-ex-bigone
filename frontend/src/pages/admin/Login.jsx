import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const inputCls = "w-full border border-[#E8E8E8] rounded-md text-sm px-3.5 py-2.5 focus:outline-none focus:border-[#0015FF] transition-colors bg-white"

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(email, pass); navigate('/admin') }
    catch(err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0015FF] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <img src="/images/logo.png" alt="Big One Rent a Car" className="h-40 w-auto object-contain mb-4" />
          <div className="section-label text-white/60">Panel Administrativo</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-white/10 rounded-lg p-7 shadow-2xl flex flex-col gap-4">
          <div>
            <label className="section-label block mb-1.5">Correo</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className={inputCls} placeholder="admin@bigone.com" />
          </div>
          <div>
            <label className="section-label block mb-1.5">Contraseña</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} required
              className={inputCls} />
          </div>
          {error && <p className="text-[#FF0033] text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center !py-3 mt-1 !rounded-lg disabled:opacity-50">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
