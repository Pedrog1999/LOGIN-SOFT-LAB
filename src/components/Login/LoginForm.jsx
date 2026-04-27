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
          <div className="login-github">
            <a
              className="github-link"
              href="https://github.com/Pedrog1999/LOGIN-SOFT-LAB.git"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Abrir repositorio de GitHub"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M12 0.297C5.37 0.297 0 5.667 0 12.297c0 5.29 3.438 9.77 8.205 11.36.6.11.82-.26.82-.58 0-.29-.01-1.05-.015-2.06-3.338.73-4.042-1.61-4.042-1.61-.546-1.38-1.333-1.75-1.333-1.75-1.09-.75.082-.74.082-.74 1.205.08 1.84 1.24 1.84 1.24 1.07 1.84 2.8 1.31 3.48 1.005.11-.78.42-1.31.76-1.61-2.665-.3-5.466-1.335-5.466-5.94 0-1.31.47-2.38 1.24-3.22-.124-.3-.54-1.52.117-3.16 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.41 3-.42 1.02.01 2.04.15 3 .42 2.28-1.55 3.29-1.23 3.29-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.64-5.47 5.93.43.37.81 1.1.81 2.22 0 1.6-.015 2.89-.015 3.28 0 .32.22.69.83.57C20.565 22.06 24 17.58 24 12.297c0-6.63-5.37-12-12-12"/>
              </svg>
              <span>Open in GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}