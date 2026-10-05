'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation'
import CustomCursor from './components/CustomCursor'
import ReservationModal from './components/ReservationModal'
import HomeSections from './sections/HomeSections'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

export default function Website() {
  const root = useRef(null)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const video = document.createElement('video')
    let finished = false
    const done = () => { if (finished) return; finished = true; setLoadProgress(100); setTimeout(() => { setLoaded(true); document.body.style.overflow = ''; setTimeout(() => ScrollTrigger.refresh(), 700) }, 250) }
    video.preload = 'auto'; video.onloadeddata = done; video.onerror = done; video.src = '/asstes/sea top view.mp4'; video.load()
    const fallback = setTimeout(done, 5000)
    return () => { clearTimeout(fallback); document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!loaded || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = time => lenis.raf(time * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach(el => gsap.fromTo(el, { yPercent: 112 }, { yPercent: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
      const heroChapters = gsap.utils.toArray('.hero-chapter')
      const hero = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: .85 } })
      hero.to('.hero__media', { scale: 1.12, yPercent: 4, duration: 1 }, 0)
        .to('.hero__word h1', { scale: .76, yPercent: -35, opacity: 0, duration: .65 }, .12)
        .to('.hero__word p,.hero__edition,.hero__scroll,.hero__coordinates', { yPercent: -30, opacity: 0, duration: .45 }, .12)
        .fromTo('.hero-plate', { xPercent: -50, yPercent: 65, scale: .72 }, { xPercent: -50, yPercent: -34, scale: .88, duration: .9, ease: 'power3.out' }, .25)
        .to('.hero-utensil--fork', { x: () => document.querySelector('.hero-plate').offsetWidth * -.47, rotation: 0, duration: .72, ease: 'power3.out' }, .78)
        .to('.hero-utensil--knife', { x: () => document.querySelector('.hero-plate').offsetWidth * .47, rotation: 0, duration: .72, ease: 'power3.out' }, .78)
        .to('.hero__curve', { yPercent: -100, duration: .85, ease: 'power3.inOut' }, .88)
        .to('.hero__media,.hero__wash', { opacity: 0, duration: .45 }, 1.18)
        .to('.hero-plate', { xPercent: -50, yPercent: -50, scale: 1, duration: .65, ease: 'power2.out' }, 1.15)
      heroChapters.forEach((chapter, i) => {
        const at = 1.7 + i * .78
        hero.fromTo(chapter, { xPercent: -50, yPercent: -50, autoAlpha: 0, y: 32 }, { xPercent: -50, yPercent: -50, autoAlpha: 1, y: 0, duration: .2 }, at)
          .to(chapter, { autoAlpha: 0, y: -30, duration: .2 }, at + .54)
          .to('.hero-plate__ceramic', { rotation: (i + 1) * 38, duration: .78, ease: 'power1.inOut' }, at)
      })
      hero.fromTo('.hero-float--a', { autoAlpha: 0, y: 80, rotation: 7 }, { autoAlpha: 1, y: 0, rotation: -3, duration: .45 }, 1.9)
        .to('.hero-float--a', { autoAlpha: 0, y: -70, duration: .35 }, 3.15)
        .fromTo('.hero-float--b', { autoAlpha: 0, y: 80, rotation: -6 }, { autoAlpha: 1, y: 0, rotation: 3, duration: .45 }, 3.25)
        .to('.hero-float--b', { autoAlpha: 0, y: -70, duration: .35 }, 4.4)
        .to('.hero-utensil--fork', { x: 0, rotation: 34, duration: .7, ease: 'power3.inOut' }, 4.72)
        .to('.hero-utensil--knife', { x: 0, rotation: -34, duration: .7, ease: 'power3.inOut' }, 4.72)
        .to('.hero-plate__ceramic', { rotation: 180, duration: .7, ease: 'power2.out' }, 4.75)
        .to('.hero-plate', { scale: .92, duration: .7, ease: 'power2.out' }, 4.75)

      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.sea-fire', start: 'top top', end: 'bottom bottom', scrub: 1 } })
        .to('.sea-fire__sea img', { scale: 1.12 }, 0).to('.sea-fire__sea h2', { yPercent: -25, opacity: 0 }, .1)
        .fromTo('.fire__reveal', { clipPath: 'inset(50% 0)' }, { clipPath: 'inset(0%)' }, .35)
        .fromTo('.fire__reveal video', { scale: 1.14 }, { scale: 1 }, .35)
      gsap.utils.toArray('[data-parallax]').forEach(el => gsap.to(el, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } }))
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.aperitivo', start: 'top bottom', end: 'bottom top', scrub: 1 } })
        .fromTo('.aperitivo__drink', { yPercent: 24, scale: .86, rotation: -2 }, { yPercent: -9, scale: 1.04, rotation: 1.5 }, 0)
        .fromTo('.aperitivo__leaf--left', { xPercent: -28, yPercent: 16, rotation: -12 }, { xPercent: 4, yPercent: -12, rotation: 2 }, 0)
        .fromTo('.aperitivo__leaf--right', { xPercent: 28, yPercent: -15, rotation: 16 }, { xPercent: -4, yPercent: 12, rotation: -3 }, 0)
        .to('.aperitivo__shell', { rotation: 16, scale: 1.12 }, 0)
        .fromTo('.aperitivo__copy', { yPercent: 30 }, { yPercent: -18 }, 0)
        .fromTo('.aperitivo__note', { yPercent: 35 }, { yPercent: -20 }, 0)
    }, root)
    return () => { ctx.revert(); gsap.ticker.remove(tick); lenis.destroy() }
  }, [loaded])

  return <div ref={root}><div className={`mare-loader ${loaded ? 'is-finished' : ''}`} aria-hidden={loaded}><div className="mare-loader__simple"><p>ATLANTIC COAST · AGADIR</p><h1>MARÉ</h1><span>FROM THE ATLANTIC TO YOUR TABLE</span></div><div className="mare-loader__meta"><p>FOLLOWING THE TIDE</p><div><span style={{ transform: `scaleX(${loadProgress / 100})` }} /></div><b>{String(loadProgress).padStart(2, '0')}</b></div></div><CustomCursor /><Navigation onReserve={() => setReservationOpen(true)} /><main><HomeSections onReserve={() => setReservationOpen(true)} /></main><ReservationModal open={reservationOpen} onClose={() => setReservationOpen(false)} /></div>
}
