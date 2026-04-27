import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function SlideCard({ slide, exiting, exitDirection, enterFrom }) {
  const cardRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return
    const card = cardRef.current

    // Forzamos estado inicial antes de animar
    gsap.set(card, { opacity: 0, x: enterFrom === 'right' ? 140 : enterFrom === 'left' ? -140 : 0, scale: 0.94 })

    // Pequeño delay para que React termine el paint
    const t = setTimeout(() => {
      gsap.to(card, { opacity: 1, x: 0, scale: 1, duration: 0.45, ease: 'power3.out' })

      const children = card.querySelectorAll('.slide-title, .slide-subtitle, .slide-body')
      if (children.length) {
        gsap.fromTo(
          children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, ease: 'power2.out', delay: 0.1 }
        )
      }
    }, 10)

    return () => { clearTimeout(t); gsap.killTweensOf(card) }
  }, [])

  useEffect(() => {
    if (!exiting || !cardRef.current) return
    const xTarget = exitDirection === 'right' ? -140 : 140
    gsap.killTweensOf(cardRef.current)
    gsap.to(cardRef.current, { x: xTarget, opacity: 0, scale: 0.92, duration: 0.32, ease: 'power2.in' })
  }, [exiting, exitDirection])

  if (!slide || slide.isLogin) return null

  return (
    <div className="slide-wrapper">
      <div className="slide-card" ref={cardRef} style={{ opacity: 0 }}>
        <h1 className="slide-title">{slide.title}</h1>
        <h2 className="slide-subtitle">{slide.subtitle}</h2>
        <p className="slide-body">{slide.body}</p>
      </div>
    </div>
  )
}