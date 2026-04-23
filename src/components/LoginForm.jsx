import React, { useState } from 'react'
import '../styles/login.css'

export default function LoginForm({ visible }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: conectar con PHP / auth
    console.log('Login intent:', { email, remember })
  }

  return (
    <div className={`login-wrapper ${visible ? 'visible' : ''}`}>
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-brand">Soft Lab</h1>
          <div className="login-divider" />
          <p className="login-subtitle">Acceso al sistema</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="usuario@softlab.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Recordarme
            </label>
            <button type="button" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="btn-login">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}