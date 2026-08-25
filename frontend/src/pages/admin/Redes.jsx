import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Link2, Trash2, Plus, ExternalLink, Video } from 'lucide-react'
import { api } from '../../lib/api'

function extractTikTokId(input) {
  const s = input.trim()
  // Si es solo un número (el ID directo)
  if (/^\d{10,25}$/.test(s)) return s
  // /video/NNNN o /v/NNNN
  const m = s.match(/(?:\/video\/|\/v\/)(\d{10,25})/)
  if (m) return m[1]
  // item_id en query string
  const q = s.match(/[?&]item_id=(\d{10,25})/)
  if (q) return q[1]
  // Cualquier número largo en la URL (TikTok IDs son 15-19 dígitos)
  const n = s.match(/\b(\d{15,25})\b/)
  if (n) return n[1]
  return null
}

export default function Redes() {
  const [videos, setVideos]   = useState([])
  const [input, setInput]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/tiktok-videos')
      .then(d => setVideos(d.data || d))
      .catch(() => setError('No se pudieron cargar los videos.'))
      .finally(() => setLoading(false))
  }, [])

  async function agregar() {
    setError('')
    const url = input.trim()
    if (!url) return
    const id = extractTikTokId(url)
    if (!id) {
      setError('No se pudo extraer el ID. Pega el enlace del video de TikTok o solo el número del video.')
      return
    }
    if (videos.find(v => v.tiktok_id === id)) {
      setError('Este video ya fue agregado.')
      return
    }
    try {
      const nuevo = await api.post('/admin/tiktok-videos', { tiktok_id: id, url })
      setVideos([nuevo.data || nuevo, ...videos])
      setInput('')
    } catch (e) {
      setError(e?.response?.data?.message || 'Error al agregar el video.')
    }
  }

  async function eliminar(videoId, tiktokId) {
    try {
      await api.delete(`/admin/tiktok-videos/${videoId}`)
      setVideos(videos.filter(v => v.id !== videoId))
    } catch {
      setError('No se pudo eliminar el video.')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl">

        {/* header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B] mb-1">Admin</p>
          <h1 className="font-display text-4xl uppercase text-[#111] tracking-tight">Redes sociales</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Los videos aparecerán en la sección TikTok de la página principal.</p>
        </div>

        {/* input */}
        <div className="bg-[#F7F8FA] border border-[#E8E8E8] rounded-md p-5 mb-8">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] block mb-2">
            Pegar URL de TikTok
          </label>
          <p className="text-[11px] text-[#6B6B6B] mb-3">
            Pega el enlace del video o solo el ID numérico. Funciona con enlaces de escritorio, móvil y TikTok Bolivia.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
              <input
                value={input}
                onChange={e => { setInput(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && agregar()}
                placeholder="https://www.tiktok.com/@usuario/video/..."
                className="w-full border border-[#E8E8E8] rounded-md text-sm pl-9 pr-3 py-2.5 text-[#111] focus:outline-none focus:border-[#0015FF] transition-colors bg-white placeholder:text-[#BBBBBB]"
              />
            </div>
            <button onClick={agregar}
              className="flex items-center gap-2 bg-[#0015FF] text-white font-bold uppercase tracking-[0.2em] text-[10px] px-5 py-2.5 rounded-md hover:bg-[#0012CC] active:scale-95 transition-all whitespace-nowrap">
              <Plus size={13} /> Agregar
            </button>
          </div>
          {error && <p className="text-[11px] text-[#FF0033] mt-2">{error}</p>}
        </div>

        {/* lista */}
        {loading ? (
          <div className="text-center py-16 text-sm text-[#6B6B6B]">Cargando videos...</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[#E8E8E8] rounded-md">
            <Video size={32} className="mx-auto text-[#CCCCCC] mb-3" />
            <p className="text-sm text-[#6B6B6B]">No hay videos agregados aún.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6B6B]">
              {videos.length} video{videos.length !== 1 ? 's' : ''} publicado{videos.length !== 1 ? 's' : ''}
            </p>
            {videos.map((v, i) => (
              <div key={v.id}
                className="flex items-center gap-4 bg-white border border-[#E8E8E8] rounded-md p-4 hover:border-[#0015FF]/30 transition-colors">

                {/* preview miniatura */}
                <div className="w-14 h-20 rounded-md bg-[#F7F8FA] border border-[#E8E8E8] overflow-hidden shrink-0 flex items-center justify-center">
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${v.tiktok_id}`}
                    className="w-full h-full pointer-events-none"
                    style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                    allow="fullscreen"
                    title={`TikTok ${v.tiktok_id}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B6B6B] mb-0.5">Video #{i + 1}</p>
                  <p className="text-xs text-[#111] font-mono truncate">{v.url}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a href={v.url} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-lg border border-[#E8E8E8] flex items-center justify-center text-[#6B6B6B] hover:text-[#0015FF] hover:border-[#0015FF]/30 transition-colors">
                    <ExternalLink size={13} />
                  </a>
                  <button onClick={() => eliminar(v.id, v.tiktok_id)}
                    className="w-8 h-8 rounded-lg border border-[#E8E8E8] flex items-center justify-center text-[#6B6B6B] hover:text-[#FF0033] hover:border-[#FF0033]/30 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
