import React, { useEffect, useState } from 'react'

const SLIDE_NAMES = ['Login', 'Quiénes Somos', 'Nuestra Misión', 'Nuestros Servicios', 'Contacto']

function FilmStrip({ current, total }) {
  return (
    <div className="filmstrip">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`filmstrip-bar ${i === current ? 'active' : ''}`} />
      ))}
    </div>
  )
}

export default function CarouselArrows({ onLeft, onRight, currentSlide, totalSlides, disabled }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const prevName = SLIDE_NAMES[(currentSlide - 1 + totalSlides) % totalSlides]
  const nextName = SLIDE_NAMES[(currentSlide + 1) % totalSlides]

  return (
    <>
      <button
        className={`arrow-btn arrow-btn--left ${visible ? 'arrow-btn--visible' : ''} ${disabled ? 'arrow-btn--disabled' : ''}`}
        onClick={disabled ? undefined : onLeft}
        aria-label="Slide anterior"
      >
        <div className="arrow-inner">
          <svg className="carousel-arrow-icon" viewBox="0 0 32 32" fill="none">
            <line x1="28" y1="16" x2="6" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <polyline points="14,8 6,16 14,24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="arrow-label">{prevName}</span>
        </div>
      </button>

      <button
        className={`arrow-btn arrow-btn--right ${visible ? 'arrow-btn--visible' : ''} ${disabled ? 'arrow-btn--disabled' : ''}`}
        onClick={disabled ? undefined : onRight}
        aria-label="Slide siguiente"
      >
        <div className="arrow-inner">
          <span className="arrow-label">{nextName}</span>
          <svg className="carousel-arrow-icon" viewBox="0 0 32 32" fill="none">
            <line x1="4" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <polyline points="18,8 26,16 18,24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      </button>

      <FilmStrip current={currentSlide} total={totalSlides} />
    </>
  )
}