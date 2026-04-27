import React, { useEffect, useRef } from 'react'
import '../../styles/intro.css'

export default function IntroScreen({ onEnter }) {
  const sceneRef = useRef(null)
  const particlesRef = useRef(null)

  useEffect(() => {
    const container = particlesRef.current
    if (!container) return
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${20 + Math.random() * 60}%;
        --dur: ${4 + Math.random() * 5}s;
        --delay: ${Math.random() * 6}s;
        --op: ${0.15 + Math.random() * 0.35};
        width: ${Math.random() > 0.7 ? '2px' : '1px'};
        height: ${Math.random() > 0.7 ? '2px' : '1px'};
      `
      container.appendChild(p)
    }
  }, [])

  const handleEnter = () => {
    sceneRef.current?.classList.add('clicked')
    setTimeout(() => onEnter(), 900)
  }

  return (
    <div className="intro-scene" ref={sceneRef}>
      <div className="particles" ref={particlesRef} />

      <div className="line-top" />
      <div className="line-bottom" />

      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

      <div className="intro-content">
        <p className="brand-eyebrow">Bienvenido</p>
        <h1 className="brand-name">Soft Lab</h1>
        <p className="brand-tagline">Sistema de gestión</p>
        <button className="enter-btn" onClick={handleEnter}>
          Ingresar
          <span className="arrow-icon" />
        </button>
      </div>

      <div className="version">v1.0 · 2025</div>
    </div>
  )
}
