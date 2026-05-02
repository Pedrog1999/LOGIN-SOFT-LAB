import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// enterFrom: 'left' | 'right' | null
// Si navigateTo('right') → currentSlide avanza → nuevo slide entra desde la DERECHA
// Si navigateTo('left')  → currentSlide retrocede → nuevo slide entra desde la IZQUIERDA
export default function SlideCard({ slide, exiting, exitDirection, enterFrom }) {
  const cardRef = useRef(null)

  // ── ENTRADA al montar (key={currentSlide} garantiza nuevo mount por slide) ──
  useEffect(() => {
    if (!cardRef.current) return

    const xFrom = enterFrom === 'right' ? 120 : enterFrom === 'left' ? -120 : 0

    gsap.killTweensOf(cardRef.current)
    gsap.fromTo(
      cardRef.current,
      { x: xFrom, opacity: 0, scale: 0.94, filter: 'blur(3px)' },
      { x: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' }
    )

    // Stagger del contenido
    const children = cardRef.current.querySelectorAll('.slide-title, .slide-subtitle, .slide-body')
    if (children.length) {
      gsap.fromTo(
        children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out', delay: 0.12 }
      )
    }

    return () => gsap.killTweensOf(cardRef.current)
  }, [enterFrom])  // solo en mount

  // ── SALIDA lateral ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!exiting || !cardRef.current) return
    const xTarget = exitDirection === 'right' ? -120 : 120
    gsap.killTweensOf(cardRef.current)
    gsap.to(cardRef.current, {
      x: xTarget,
      opacity: 0,
      scale: 0.94,
      duration: 0.32,
      ease: 'power2.in',
    })
    
  }, [exiting, exitDirection])

  if (!slide || slide.isLogin) return null

  return (
    <div className="slide-wrapper">
      <div className="slide-card" ref={cardRef}>
        <h1 className="slide-title">{slide.title}</h1>
        <h2 className="slide-subtitle">{slide.subtitle}</h2>
        <p className="slide-body">{slide.body}</p>
      </div>
    </div>
  )
}
