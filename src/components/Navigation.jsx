import { useEffect, useState } from 'react'
export default function Navigation({ onReserve }) {
  const [menu, setMenu] = useState(false), [hidden, setHidden] = useState(false)
  useEffect(() => { let last = scrollY; const onScroll = () => { setHidden(scrollY > last && scrollY > 120); last = scrollY }; addEventListener('scroll', onScroll, { passive: true }); return () => removeEventListener('scroll', onScroll) }, [])
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [menu])
  const close = () => setMenu(false)
  return <><nav className={`nav ${hidden ? 'nav--hidden' : ''}`} aria-label="Main navigation"><a className="nav__logo" href="#top">MARÉ</a><div className="nav__links"><a href="/menu">Menu</a><a href="#story">Story</a><a href="#location">Location</a></div><button className="nav__reserve" onClick={onReserve}>Reserve <span>↗</span></button><button className="nav__toggle" onClick={() => setMenu(true)} aria-label="Open menu">Menu</button></nav><div className={`menu-overlay ${menu ? 'is-open' : ''}`} aria-hidden={!menu}><button className="menu-overlay__close" onClick={close}>Close</button><a href="/menu" onClick={close}><small>01</small>Menu</a><a href="#story" onClick={close}><small>02</small>Story</a><a href="#location" onClick={close}><small>03</small>Location</a><a href="#reserve" onClick={close}><small>04</small>Reserve</a><p>Atlantic Coast · Agadir, Morocco</p></div></>
}
