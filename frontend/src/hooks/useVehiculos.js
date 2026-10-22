import { useState, useEffect } from 'react'
import { api } from '../lib/api'

function normalizar(v) {
  return {
    ...v,
    preciodiario: v.precio_diario,
    preciosemanal: v.precio_semanal,
    preciomensual: v.precio_mensual,
  }
}

export function useVehiculos() {
  const [lista, setLista] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let activo = true
    api.get('/vehiculos')
      .then(data => { if (activo) setLista(data.map(normalizar)) })
      .catch(() => { if (activo) setLista([]) })
      .finally(() => { if (activo) setLoading(false) })
    return () => { activo = false }
  }, [])

  return loading ? [] : lista
}
