import React from 'react'

export default function LoginForm({ visible, exiting, exitDirection }) {
  const exitClass = exiting ? ` login-card-motion--exit-${exitDirection || 'left'}` : ''

  return (
    <div className="login-wrapper">
      <div className={`login-card-motion${exitClass}`}>
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