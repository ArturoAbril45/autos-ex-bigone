import { useState, useEffect } from 'react'
import { vehiculos as base } from '../data/vehiculos'

function leer() {
  try {
    const admin      = JSON.parse(localStorage.getItem('bigone_vehiculos_admin')     || '[]')
    const overrides  = JSON.parse(localStorage.getItem('bigone_vehiculos_overrides') || '{}')
    const deletedIds = new Set(JSON.parse(localStorage.getItem('bigone_vehiculos_deleted') || '[]'))

    const predefinidos = base
      .filter(v => !deletedIds.has(v.id))
      .map(v => overrides[v.id] ? { ...v, ...overrides[v.id] } : v)

    return [...predefinidos, ...admin]
  } catch {
    return [...base]
  }
}

export function useVehiculos() {
  const [lista, setLista] = useState(leer)

  useEffect(() => { setLista(leer()) }, [])

  return lista
}
