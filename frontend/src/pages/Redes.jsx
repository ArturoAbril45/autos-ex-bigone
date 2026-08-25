import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export default function Redes() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    api.get('/tiktok-videos')
      .then(d => setVideos(d.data || d))
      .catch(() => {})
  }, [])

  const mostrar = videos.slice(0, 6)

  return (
    <main className="pt-[64px] bg-[#111] min-h-screen">

      {/* header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-14 py-20">
        <p className="section-label text-[#FFE600] mb-4">Síguenos</p>
        <div className="flex items-end justify-between flex-wrap gap-6">
          <h1 className="font-display text-[clamp(4rem,10vw,8rem)] uppercase text-white tracking-tight leading-none">
            TikTok
          </h1>
          <a href="https://www.tiktok.com/@big_onerentacar" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.22em] px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.17 8.17 0 0 0 4.77 1.52V6.79a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            Ver perfil
          </a>
        </div>
      </div>

      {/* videos */}
      <div className="max-w-7xl mx-auto px-6 lg:px-14 pb-24">
        {mostrar.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i}
                className="rounded-2xl bg-[#1A1A1A] border border-white/10 flex flex-col items-center justify-center gap-4"
                style={{ aspectRatio: '9/16', maxHeight: 580 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white" opacity="0.12">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.17 8.17 0 0 0 4.77 1.52V6.79a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20">Próximamente</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostrar.map(v => (
              <div key={v.id}
                className="rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/10"
                style={{ aspectRatio: '9/16', maxHeight: 580 }}>
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${v.tiktok_id}`}
                  className="w-full h-full"
                  allow="fullscreen; autoplay"
                  allowFullScreen
                  title={`TikTok ${v.id}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
