export const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
export async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Unable to reach the restaurant')
  return data
}
