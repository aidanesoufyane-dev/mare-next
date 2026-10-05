'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from './api'
import { menu as fallback } from './data'
import DishDetailsModal from './components/DishDetailsModal'

export default function MenuPage() {
  const fallbackItems = fallback.map(([name, price, image], index) => ({ _id: `fallback-${index}`, name, price, image, description: 'Fresh from the Atlantic and prepared simply.', category: "Tonight's catch", ingredients: ['Daily Atlantic catch', 'Olive oil', 'Sea salt', 'Coastal herbs', 'Lemon'] }))
  const [items, setItems] = useState(fallbackItems), [loading, setLoading] = useState(true), [selectedDish, setSelectedDish] = useState(null)
  useEffect(() => { api('/api/restaurants/mare/content').then(data => data.menu.length && setItems(data.menu)).catch(() => {}).finally(() => setLoading(false)) }, [])
  const closeDish = useCallback(() => setSelectedDish(null), [])
  const groups = useMemo(() => Object.entries(items.reduce((all, item) => { const key = item.category || "Tonight's catch"; (all[key] ??= []).push(item); return all }, {})), [items])
  return <main className="mare-menu-page">
    <header><a href="/" className="mare-menu-logo">MARÉ</a><nav><a href="/">The restaurant</a><a className="active" href="/menu">Menu</a><a href="/#location">Find us</a></nav><a className="mare-menu-book" href="/#reserve">Reserve a table ↗</a></header>
    <section className="mare-menu-hero"><div><p>ATLANTIC COAST · AGADIR</p><h1>THE<br /><em>MENU.</em></h1></div><p>What the ocean gives us,<br />we bring to the table.</p><span>DAILY CATCH · OPEN FIRE · MOROCCAN SOUL</span></section>
    <section className="mare-menu-intro"><p>OUR PHILOSOPHY</p><h2>The menu follows<br />the <em>tide.</em></h2><div><p>Our cooking begins each morning at the harbour. Fish is chosen by season, weather and instinct, then handled simply—with fire, salt and respect.</p><small>Menu items and prices may change with the day’s catch.</small></div></section>
    <section className="mare-menu-list">{loading && <p className="mare-menu-loading">Reading today’s tide…</p>}{groups.map(([category, dishes], groupIndex) => <div className="mare-menu-group" key={category}><aside><span>0{groupIndex + 1}</span><h3>{category}</h3><p>{groupIndex === 0 ? 'Landed today. Served tonight.' : 'From our kitchen to the coast.'}</p></aside><div>{dishes.map((item, index) => <button type="button" className="mare-menu-dish" key={item._id || item.name} onClick={() => setSelectedDish(item)}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{item.name}</h4>{item.description && <p>{item.description}</p>}<small>View ingredients ↗</small></div><b>{item.price || 'Market'}</b>{item.image && <div className="mare-menu-image"><img src={item.image} alt="" /></div>}</button>)}</div></div>)}</section>
    <section className="mare-menu-note"><p>FROM THE ATLANTIC TO YOUR TABLE</p><h2>Come hungry.<br /><em>Leave with the tide.</em></h2><a href="/#reserve">Reserve your table <span>↗</span></a></section>
    <footer><a href="/">MARÉ</a><p>Atlantic Coast · Agadir, Morocco<br />Open daily · 12:00 until late</p><div><a href="/">Home</a><a href="/#location">Location</a><a href="/admin">Owner access</a></div></footer>
    <DishDetailsModal dish={selectedDish} onClose={closeDish} />
  </main>
}
