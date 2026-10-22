const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function getToken() {
  return localStorage.getItem('admin_token')
}

async function req(method, path, body) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`)
  return data
}

async function upload(path, formData) {
  const headers = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`)
  return data
}

export const api = {
  get:    (path)       => req('GET',    path),
  post:   (path, body) => req('POST',   path, body),
  put:    (path, body) => req('PUT',    path, body),
  patch:  (path, body) => req('PATCH',  path, body),
  delete: (path)       => req('DELETE', path),
  upload,
}
