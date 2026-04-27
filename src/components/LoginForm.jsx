import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function LoginForm({ visible, exiting, exitDirection }) {
  const cardRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return
    const card = cardRef.current

    // Siempre arranca desde arriba, sin importar si visible era true antes del mount
    gsap.set(card, { y: -120, opacity: 0, scale: 0.88 })

    const t = setTimeout(() => {
      gsap.to(card, { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out' })
    }, 10)

    return () => { clearTimeout(t); gsap.killTweensOf(card) }
  }, []) // solo mount — la key externa garantiza remount limpio al volver

  useEffect(() => {
    if (!exiting || !cardRef.current) return
    const xTarget = exitDirection === 'right' ? -130 : 130
    gsap.killTweensOf(cardRef.current)
    gsap.to(cardRef.current, { x: xTarget, opacity: 0, scale: 0.92, duration: 0.32, ease: 'power2.in' })
  }, [exiting, exitDirection])

  return (
    <div className="login-wrapper">
      <div ref={cardRef} className="login-card-motion" style={{ opacity: 0 }}>
        <div className="login-card">
          <div className="login-header">
            <p className="login-brand">Soft Lab</p>
            <p className="login-subtitle">Sistema de gestión</p>
            <div className="login-divider" />
          </div>
          <div className="form-group">
            <label>Usuario</label>
            <input type="text" placeholder="Ingresá tu usuario" autoComplete="off" />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className="form-row">
            <label className="remember-label">
              <input type="checkbox" />
              Recordarme
            </label>
            <button className="forgot-link">¿Olvidaste tu contraseña?</button>
          </div>
          <button className="btn-login">Ingresar</button>
        </div>
      </div>
    </div>
  )
}