import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const base = process.cwd()

const files = {
  'package.json': `{
  "name": "logwin",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}`,

  'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,

  'index.html': `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Soft Lab</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@200;300;400&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

  'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,

  'src/styles/global.css': `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --gold: #c9a84c;
  --gold-light: #e8d5a3;
  --gold-dim: rgba(201, 168, 76, 0.35);
  --gold-border: rgba(201, 168, 76, 0.45);
  --glass-bg: rgba(10, 8, 5, 0.45);
  --glass-blur: blur(18px);
  --text-primary: #f0e6cc;
  --text-secondary: rgba(240, 230, 204, 0.55);
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Jost', sans-serif;
  --transition-slow: 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-mid: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

body {
  font-family: var(--font-body);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}`,

  'src/styles/login.css': `.scene {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  transition:
    filter 2.5s cubic-bezier(0.16, 1, 0.3, 1),
    brightness 2.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.bg-video.blurred {
  filter: blur(10px) brightness(0.55);
}

.scene-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 100%);
  z-index: 1;
  pointer-events: none;
}

.login-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transform: translateY(-110vh);
  opacity: 0;
  transition:
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.6s ease;
}

.login-wrapper.visible {
  transform: translateY(0);
  opacity: 1;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 48px 44px 44px;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--gold-border);
  border-radius: 4px;
  box-shadow:
    0 0 0 1px rgba(201, 168, 76, 0.08),
    0 32px 64px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(201, 168, 76, 0.15);
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-brand {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.35em;
  color: var(--gold-light);
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: 8px;
}

.login-subtitle {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 200;
  letter-spacing: 0.25em;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.login-divider {
  width: 40px;
  height: 1px;
  background: var(--gold-dim);
  margin: 14px auto 0;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.65rem;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(201, 168, 76, 0.25);
  border-radius: 2px;
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 300;
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--transition-mid), background var(--transition-mid);
  letter-spacing: 0.05em;
}

.form-group input::placeholder {
  color: rgba(240, 230, 204, 0.2);
  font-weight: 200;
}

.form-group input:focus {
  border-color: var(--gold);
  background: rgba(201, 168, 76, 0.06);
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  margin-top: -4px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  user-select: none;
}

.remember-label input[type="checkbox"] {
  appearance: none;
  width: 14px;
  height: 14px;
  border: 1px solid var(--gold-border);
  border-radius: 2px;
  background: transparent;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: background var(--transition-mid), border-color var(--transition-mid);
}

.remember-label input[type="checkbox"]:checked {
  background: var(--gold-dim);
  border-color: var(--gold);
}

.remember-label input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 4px;
  width: 4px;
  height: 7px;
  border: 1px solid var(--gold-light);
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.forgot-link {
  font-size: 0.7rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-mid);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: var(--font-body);
}

.forgot-link:hover {
  color: var(--gold-light);
}

.btn-login {
  width: 100%;
  padding: 13px;
  background: transparent;
  border: 1px solid var(--gold-border);
  border-radius: 2px;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold-light);
  cursor: pointer;
  transition:
    background var(--transition-mid),
    border-color var(--transition-mid),
    color var(--transition-mid),
    box-shadow var(--transition-mid);
}

.btn-login:hover {
  background: rgba(201, 168, 76, 0.1);
  border-color: var(--gold);
  color: #fff;
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.15);
}

.btn-login:active {
  background: rgba(201, 168, 76, 0.18);
}`,

  'src/components/LoginForm.jsx': `import React, { useState } from 'react'
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
    <div className={\`login-wrapper \${visible ? 'visible' : ''}\`}>
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
}`,

  'src/App.jsx': `import React, { useRef, useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'

// ── Configuración de timing ──────────────────────────────
const TRIGGER_TIME = 3.5        // segundo del video donde ocurre el wink
const AUDIO_INTRO_VOLUME = 0.25 // volumen de la intro (suave)
const AUDIO_DROP_VOLUME = 0.7   // volumen cuando entra el drop
// ────────────────────────────────────────────────────────

export default function App() {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const hasTriggered = useRef(false)

  const [loginVisible, setLoginVisible] = useState(false)
  const [videoBlurred, setVideoBlurred] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = AUDIO_INTRO_VOLUME
    const tryPlay = () => {
      audio.play().catch(() => {
        const unlock = () => {
          audio.play()
          document.removeEventListener('click', unlock)
        }
        document.addEventListener('click', unlock)
      })
    }
    tryPlay()
  }, [])

  const handleTimeUpdate = () => {
    if (hasTriggered.current) return
    const currentTime = videoRef.current?.currentTime ?? 0
    if (currentTime >= TRIGGER_TIME) {
      hasTriggered.current = true
      triggerLoginSequence()
    }
  }

  const triggerLoginSequence = () => {
    const audio = audioRef.current
    if (audio) fadeVolume(audio, AUDIO_INTRO_VOLUME, AUDIO_DROP_VOLUME, 600)
    setLoginVisible(true)
    setTimeout(() => setVideoBlurred(true), 200)
  }

  const fadeVolume = (audio, from, to, durationMs) => {
    const steps = 30
    const interval = durationMs / steps
    const delta = (to - from) / steps
    let current = from
    let step = 0
    const timer = setInterval(() => {
      current += delta
      step++
      audio.volume = Math.min(Math.max(current, 0), 1)
      if (step >= steps) clearInterval(timer)
    }, interval)
  }

  return (
    <div className="scene">
      <video
        ref={videoRef}
        className={\`bg-video \${videoBlurred ? 'blurred' : ''}\`}
        src="/src/assets/intro.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
      />
      <audio
        ref={audioRef}
        src="/src/assets/ambient.mp3"
        loop
        preload="auto"
      />
      <div className="scene-overlay" />
      <LoginForm visible={loginVisible} />
    </div>
  )
}`
}

// Crear directorios y archivos
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = join(base, filePath)
  const dir = join(fullPath, '..')
  mkdirSync(dir, { recursive: true })
  writeFileSync(fullPath, content, 'utf8')
  console.log(`✓ ${filePath}`)
}

console.log('\n✅ Proyecto creado. Ahora corré:\n')
console.log('   npm install')
console.log('   npm run dev\n')
