import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './styles/carousel.css'
import './styles/login.css'

// StrictMode removido intencionalmente: monta componentes 2 veces en desarrollo
// lo que hace que GSAP corra las animaciones de entrada duplicadas.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
