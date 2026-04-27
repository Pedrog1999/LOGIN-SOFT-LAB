import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function SlideCard({ slide, exiting, exitDirection, enterFrom }) {
  const cardRef = useRef(null)

  // ── ENTRADA al montar ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!cardRef.current) return

    // Si no hay enterFrom (primera carga), entra desde abajo suavemente
    const xFrom = enterFrom === 'right' ? 140 : enterFrom === 'left' ? -140 : 0
    const yFrom = enterFrom ? 0 : 30

    gsap.killTweensOf(cardRef.current)
    gsap.fromTo(
      cardRef.current,
      { x: xFrom, y: yFrom, opacity: 0, scale: 0.93 },
      { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.42, ease: 'power3.out' }
    )

    const children = cardRef.current.querySelectorAll('.slide-title, .slide-subtitle, .slide-body')
    if (children.length) {
      gsap.fromTo(
        children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, ease: 'power2.out', delay: 0.1 }
      )
    }

    return () => gsap.killTweensOf(cardRef.current)
  }, []) // solo en mount — la key={currentSlide} garantiza un mount por slide

  // ── SALIDA lateral ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!exiting || !cardRef.current) return
    // El slide actual sale hacia el lado opuesto a la dirección de navegación
    const xTarget = exitDirection === 'right' ? -140 : 140
    gsap.killTweensOf(cardRef.current)
    gsap.to(cardRef.current, {
      x: xTarget,
      opacity: 0,
      scale: 0.92,
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