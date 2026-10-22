import { useEffect, useState } from 'react'
import { api } from '../lib/api'

let cache = null
let promesa = null

function cargar() {
  if (!promesa) {
    promesa = api.get('/settings').then(s => { cache = s; return s }).catch(() => ({ reservas_activas: true }))
  }
  return promesa
}

export function useSettings() {
  const [settings, setSettings] = useState(cache || { reservas_activas: true })

  useEffect(() => {
    let activo = true
    cargar().then(s => { if (activo) setSettings(s) })
    return () => { activo = false }
  }, [])

  return settings
}
