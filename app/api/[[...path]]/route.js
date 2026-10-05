import { NextResponse } from 'next/server'
import { reference, store } from '../../../src/server/store'

const json = (data, status = 200) => NextResponse.json(data, { status })
const authorized = request => request.headers.get('authorization') === 'Bearer mare-demo-token'
const routeParts = async context => (await context.params).path || []

export async function GET(request, context) {
  const parts = await routeParts(context)
  const path = parts.join('/')
  if (path === 'availability') {
    const { searchParams } = new URL(request.url)
    if (!searchParams.get('date')) return json({ error: 'Choose a reservation date' }, 400)
    return json({ times: ['12:30', '13:45', '16:15', '18:30', '20:00', '21:30'] })
  }
  if (path === 'restaurants/mare/content') return json({ menu: store.menu.filter(item => item.available) })
  if (path === 'admin/mare/menu' || path === 'admin/mare/reservations') {
    if (!authorized(request)) return json({ error: 'Owner access required' }, 401)
    return json(path.endsWith('menu') ? store.menu : store.reservations)
  }
  return json({ error: 'Not found' }, 404)
}

export async function POST(request, context) {
  const path = (await routeParts(context)).join('/')
  const body = await request.json().catch(() => ({}))
  if (path === 'auth/login') {
    if (!body.email || !body.password) return json({ error: 'Email and password are required' }, 400)
    return json({ token: 'mare-demo-token', user: { restaurants: [{ slug: 'mare' }] } })
  }
  if (path === 'reservations') {
    if (!body.name || !body.phone || !body.date || !body.time || !body.guests) return json({ error: 'Complete the required reservation details' }, 400)
    const booking = { ...body, _id: crypto.randomUUID(), reference: reference(), status: 'confirmed', table: { name: 'Tide', area: 'Atlantic Room' }, createdAt: new Date().toISOString() }
    store.reservations.unshift(booking)
    return json({ reference: booking.reference, reservation: booking }, 201)
  }
  if (path === 'admin/mare/menu') {
    if (!authorized(request)) return json({ error: 'Owner access required' }, 401)
    const item = { ...body, ingredients: String(body.ingredients || '').split(',').map(value => value.trim()).filter(Boolean), allergens: String(body.allergens || '').split(',').map(value => value.trim()).filter(Boolean), category: body.category || "Tonight's catch", _id: crypto.randomUUID(), available: true }
    store.menu.push(item)
    return json(item, 201)
  }
  return json({ error: 'Not found' }, 404)
}

export async function PATCH(request, context) {
  const parts = await routeParts(context)
  if (!authorized(request)) return json({ error: 'Owner access required' }, 401)
  const body = await request.json().catch(() => ({}))
  const collection = parts[2] === 'menu' ? store.menu : store.reservations
  const item = collection.find(entry => entry._id === parts[3])
  if (!item) return json({ error: 'Record not found' }, 404)
  if (typeof body.ingredients === 'string') body.ingredients = body.ingredients.split(',').map(value => value.trim()).filter(Boolean)
  if (typeof body.allergens === 'string') body.allergens = body.allergens.split(',').map(value => value.trim()).filter(Boolean)
  Object.assign(item, body)
  return json(item)
}

export async function DELETE(request, context) {
  const parts = await routeParts(context)
  if (!authorized(request)) return json({ error: 'Owner access required' }, 401)
  if (parts[2] !== 'menu') return json({ error: 'Not found' }, 404)
  const index = store.menu.findIndex(item => item._id === parts[3])
  if (index < 0) return json({ error: 'Dish not found' }, 404)
  store.menu.splice(index, 1)
  return json({ ok: true })
}
