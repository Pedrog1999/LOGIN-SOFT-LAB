import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

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

function Arrow({ direction, onClick, label, disabled, visible }) {
  return (
    <button
      className={`arrow-btn arrow-btn--${direction} ${disabled ? 'arrow-btn--disabled' : ''} ${visible ? 'arrow-btn--visible' : ''}`}
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      style={{ opacity: 1, transform: 'translateX(0)' }}
    >
      <div className="arrow-inner">
        {direction === 'left' && (
          <>
            <ArrowSVG direction="left" />
            <span className="arrow-label">{label}</span>
          </>
        )}
        {direction === 'right' && (
          <>
            <span className="arrow-label">{label}</span>
            <ArrowSVG direction="right" />
          </>
        )}
      </div>
    </button>
  )
}

function ArrowSVG({ direction }) {
  return (
    <svg className="carousel-arrow-icon" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      {direction === 'left' ? (
        <>
          <line x1="38" y1="6" x2="2" y2="6" stroke="currentColor" strokeWidth="0.8"/>
          <polyline points="10,1 2,6 10,11" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      ) : (
        <>
          <line x1="2" y1="6" x2="38" y2="6" stroke="currentColor" strokeWidth="0.8"/>
          <polyline points="30,1 38,6 30,11" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
        </>
      )}
    </svg>
  )
}

export default function CarouselArrows({ onLeft, onRight, currentSlide, totalSlides, disabled }) {
  const [visible, setVisible] = React.useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 0)
    return () => clearTimeout(t)
  }, [])

  const prevName = SLIDE_NAMES[(currentSlide - 1 + totalSlides) % totalSlides]
  const nextName = SLIDE_NAMES[(currentSlide + 1) % totalSlides]

  return (
    <>
      <Arrow direction="left"  onClick={onLeft}  label={prevName} disabled={disabled} visible={visible} />
      <Arrow direction="right" onClick={onRight} label={nextName} disabled={disabled} visible={visible} />
      <FilmStrip current={currentSlide} total={totalSlides} />
    </>
  )
}