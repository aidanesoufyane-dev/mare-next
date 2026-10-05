import { useEffect, useState } from 'react'
import { menu, photos } from '../data'
import { api } from '../api'
import DishDetailsModal from '../components/DishDetailsModal'

const local = {
  sea: '/asstes/sea top view.mp4', fire: '/asstes/Relaxing view of a warm and soothing wood fire bur.mp4',
  night: '/asstes/Stunning aerial view of a city coastline at night .mp4',
  grill: '/asstes/Octopus grilling with vegetables on a barbecue with intense flames in Tacna, Peru..jpg',
  pan: '/asstes/Close-up of a seafood medley grilling in a pan, featuring prawns, squid, and mussels. Perfect for cooking enthusiasts..jpg',
  pass: '/asstes/Chef preparing grilled seafood on a stove, featuring octopus and mussels. Indoor culinary scene..jpg',
}
const Img = ({ src, alt, className = '', eager = false, ...props }) => <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} {...props} />
const Video = ({ src, className = '', label, poster }) => <video className={className} autoPlay muted loop playsInline preload="metadata" poster={poster} aria-label={label}><source src={src} type="video/mp4" /></video>
const Reveal = ({ children }) => <div className="line-mask"><div data-reveal>{children}</div></div>
const chapters = [
  { no: '01', kicker: 'The source', title: 'Tide', copy: 'Before Agadir wakes, the Atlantic decides what tonight will taste like.' },
  { no: '02', kicker: 'The hand', title: 'Salt', copy: 'Clean cuts, coastal herbs and restraint. Nothing is added without a reason.' },
  { no: '03', kicker: 'The instinct', title: 'Fire', copy: 'Charcoal, smoke and seconds of attention turn the daily catch into dinner.' },
  { no: '04', kicker: 'The moment', title: 'Table', copy: 'A generous plate, a long sunset and nowhere else you need to be.' },
]

export default function HomeSections({ onReserve }) {
  const fallbackMenu = menu.map(([name, price, image], index) => ({ _id: `fallback-${index}`, name, price, image, category: "Tonight's catch", description: 'Fresh from the Atlantic and prepared with fire, salt and restraint.', ingredients: ['Daily Atlantic catch', 'Olive oil', 'Sea salt', 'Coastal herbs', 'Lemon'] }))
  const [hovered, setHovered] = useState(null), [liveMenu, setLiveMenu] = useState(fallbackMenu), [selectedDish, setSelectedDish] = useState(null)
  useEffect(() => { api('/api/restaurants/mare/content').then(({ menu: items }) => items.length && setLiveMenu(items)).catch(() => {}) }, [])
  return <>
    <section className="hero" id="top"><div className="hero__stage">
      <Video className="hero__media" src={local.sea} poster={photos.ocean} label="Atlantic waves seen from above" /><div className="hero__wash" />
      <div className="hero__coordinates eyebrow"><span>30.4278° N</span><span>Atlantic coast · Agadir</span></div><p className="hero__edition eyebrow">Coastal dining<br />No. 01 / 2026</p>
      <div className="hero__word"><h1>MARÉ</h1><p>From the Atlantic<br />to your table.</p></div><span className="hero__scroll">Follow the tide <i>↓</i></span>
      <div className="hero__curve" />
      <div className="hero-plate">
        <Img className="hero-plate__ceramic" src="/asstes/mare-empty-plate.png" alt="MARÉ ceramic dinner plate" eager />
        <Img className="hero-utensil hero-utensil--fork" src="/asstes/mare-fork.png" alt="Polished dinner fork" eager />
        <Img className="hero-utensil hero-utensil--knife" src="/asstes/mare-knife.png" alt="Polished table knife" eager />
      </div>
      <div className="hero-chapters">{chapters.map(chapter => <article className="hero-chapter" key={chapter.no}><p className="eyebrow">{chapter.kicker}</p><h2>{chapter.title}</h2><p>{chapter.copy}</p><div><span>{chapter.no}</span><i><b /></i><span>/ 04</span></div></article>)}</div>
      <figure className="hero-float hero-float--a"><Img src={photos.oysters} alt="Atlantic oysters" /></figure>
      <figure className="hero-float hero-float--b"><Img src={local.pass} alt="Chef preparing seafood" /></figure>
    </div></section>

    <section className="manifesto light" id="story"><p className="eyebrow">A daily ritual · Agadir</p><Reveal><h2>The sea writes</h2></Reveal>
      <div className="manifesto__middle"><p>Our menu begins at the harbour, not on paper. We cook what arrives, while it is still telling the story of the water.</p><Reveal><h2>the menu.</h2></Reveal></div>
      <div className="manifesto__portrait" data-parallax data-cursor="VIEW"><Img src={photos.fish} alt="The morning's fresh Atlantic catch" /></div><p className="manifesto__note eyebrow">Caught this morning<br />Served tonight</p>
    </section>

    <section className="sea-fire dark"><div className="sea-fire__sticky"><div className="sea-fire__sea"><Img src={photos.ocean} alt="Deep Atlantic water" /><h2>The sea<br /><em>provides.</em></h2></div><div className="fire__reveal"><Video src={local.fire} poster={local.grill} label="A wood fire burning" /><h2>We add<br /><em>fire.</em></h2></div></div></section>

    <section className="menu-section light" id="menu"><div className="menu-section__head"><div><p className="eyebrow">What arrived today</p><Reveal><h2>Tonight’s<br /><em>catch</em></h2></Reveal></div><p>The menu follows the sea.<br />Some dishes disappear when the catch does.</p></div>
      <div className="menu-list">{liveMenu.slice(0, 6).map((item, i) => <button type="button" className="menu-row" key={item._id || item.name} onClick={() => setSelectedDish(item)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} data-cursor="VIEW"><span>{String(i + 1).padStart(2, '0')}</span><h3>{item.name}</h3><b>{item.price}</b><Img src={item.image} alt="" /></button>)}</div>
      <div className={`menu-float ${hovered !== null ? 'is-visible' : ''}`}>{hovered !== null && liveMenu[hovered] && <Img src={liveMenu[hovered].image} alt="Preview of selected dish" />}</div><a className="arrow-link" href="/menu">Explore the full menu <span>↗</span></a>
    </section>

    <section className="aperitivo light" aria-labelledby="aperitivo-title"><div className="aperitivo__stage">
      <Img className="aperitivo__shell" src="/asstes/mare-shell.png" alt="" />
      <Img className="aperitivo__leaf aperitivo__leaf--left" src="/asstes/mare-monstera.png" alt="Monstera leaf" />
      <Img className="aperitivo__leaf aperitivo__leaf--right" src="/asstes/mare-monstera.png" alt="" />
      <div className="aperitivo__copy"><p className="eyebrow">When afternoon softens</p><h2 id="aperitivo-title">Aperitivo</h2></div>
      <Img className="aperitivo__drink" src="/asstes/mare-aperitivo.png" alt="Sea-salt lime aperitivo in a coupe glass" />
      <p className="aperitivo__note">A cold glass, the last of the sun, and no reason to leave just yet.</p>
      <div className="aperitivo__meta"><span>17:30</span><i /><span>Atlantic hour</span></div>
    </div></section>

    <section className="location light" id="location"><div><p className="eyebrow">At the water’s edge</p><h2>Meet us<br /><em>by the sea.</em></h2></div><div className="location__details"><p>Atlantic Coast<br />Agadir, Morocco</p><p><b>Open daily</b><br />12:00 — late</p></div><div className="location__links"><a href="https://maps.google.com/?q=Agadir,Morocco" target="_blank" rel="noreferrer">Get directions ↗</a><a href="tel:+212000000000">Call us ↗</a><a href="https://wa.me/212000000000" target="_blank" rel="noreferrer">WhatsApp ↗</a></div></section>
    <section className="reservation" id="reserve"><Img src={photos.sunset} alt="A table overlooking the Atlantic at sunset" /><div><p className="eyebrow">Come for the catch · stay for the sunset</p><h2>Your table<br /><em>is waiting.</em></h2><button className="reservation__button" onClick={onReserve} data-cursor="BOOK"><span>Reserve a table</span><i aria-hidden="true">↗</i></button></div></section>
    <footer className="footer"><div className="footer__top"><div className="footer__intro"><p className="eyebrow">MARÉ · ATLANTIC COAST</p><h3>Good food.<br />Salt air.<br /><em>Time to spare.</em></h3></div><nav aria-label="Footer navigation"><span>Explore</span><a href="/menu">Menu <i>↗</i></a><a href="#reserve">Reservations <i>↗</i></a><a href="#location">Location <i>↗</i></a><a href="#top">Back to top <i>↑</i></a></nav><address><span>Find us</span><p>Atlantic Coast<br />Agadir, Morocco</p><p>Open daily<br />12:00 — late</p></address></div><div className="footer__bottom"><span>© MARÉ 2026</span><span>Made for the Atlantic</span><span>30.4278° N</span></div><div className="footer__wordmark" aria-hidden="true">MARÉ</div></footer>
    <DishDetailsModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
  </>
}
