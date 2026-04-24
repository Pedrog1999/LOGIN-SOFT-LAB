import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function LoginForm({ visible, exiting, exitDirection }) {
  const wrapperRef = useRef(null)
  const cardRef    = useRef(null)
  const tl         = useRef(null)

  useEffect(() => {
    if (!visible || !cardRef.current || !wrapperRef.current) return

    // ── Instalación GSAP: estado inicial ──────────────────────────────────
    gsap.set(wrapperRef.current, { opacity: 1 })
    gsap.set(cardRef.current, {
      y: -window.innerHeight * 0.75,  // empieza 75vh arriba
      opacity: 0,
      scaleX: 0.88,
      scaleY: 0.82,
      rotationX: -22,                 // inclinada hacia el espectador
      transformPerspective: 900,
      transformOrigin: 'center top',
      filter: 'blur(6px)',
    })

    tl.current = gsap.timeline()

    // ── Fase 1: caída con aceleración (0 → 0.55s) ─────────────────────────
    tl.current.to(cardRef.current, {
      duration: 0.55,
      y: 18,                          // cae LIGERAMENTE por debajo del centro
      opacity: 1,
      scaleX: 1.04,
      scaleY: 0.94,
      rotationX: 4,
      filter: 'blur(0px)',
      ease: 'power3.in',
    })

    // ── Fase 2: impacto — aplastamiento en el "piso" (0.55 → 0.72s) ───────
    .to(cardRef.current, {
      duration: 0.17,
      y: 28,
      scaleX: 1.06,                   // se ensancha al golpear
      scaleY: 0.91,                   // se aplasta verticalmente
      rotationX: 0,
      ease: 'power2.out',
    })

    // ── Fase 3: rebote amortiguado + ondas de contenido (0.72s → 1.4s) ────
    .to(cardRef.current, {
      duration: 0.68,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      ease: 'elastic.out(1, 0.55)',   // elastic SIN ser exagerado
    })

    // ── Fase 4: settle final — micro-ajuste de precisión ──────────────────
    .to(cardRef.current, {
      duration: 0.3,
      rotationX: 0,
      transformPerspective: 900,
      ease: 'power2.out',
    }, '-=0.2')

    // ── Stagger: los hijos de la card aparecen escalonados ─────────────────
    .fromTo(
      cardRef.current.querySelectorAll(
        '.login-header, .form-group, .form-row, .btn-login'
      ),
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.07,
        ease: 'power2.out',
      },
      '-=0.35'   // empieza antes de que termine el settle
    )

    // ── Brillo dorado de impacto: la línea superior de la card ────────────
    .fromTo(
      cardRef.current.querySelector('.login-card')
        ? cardRef.current           // fallback
        : cardRef.current,
      {},
      {},
      0
    )

    return () => tl.current?.kill()
  }, [visible])

  // ── Salida lateral cuando navega el carrusel ──────────────────────────────
  useEffect(() => {
    if (!exiting || !cardRef.current) return
    const dir = exitDirection === 'right' ? -1 : 1
    gsap.to(cardRef.current, {
      duration: 0.32,
      x: dir * 90,
      opacity: 0,
      ease: 'power2.in',
    })
    return () => gsap.killTweensOf(cardRef.current)
  }, [exiting, exitDirection])

  // Reset x al volver al slide 0
  useEffect(() => {
    if (!exiting && cardRef.current) {
      gsap.set(cardRef.current, { x: 0 })
    }
  }, [exiting])

  return (
    <div className="login-wrapper" ref={wrapperRef}>
      <div ref={cardRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
