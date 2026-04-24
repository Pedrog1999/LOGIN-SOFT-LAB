import React, { useRef, useState, useEffect, useCallback } from 'react'
import LoginForm from './components/LoginForm'
import IntroScreen from './components/IntroScreen'
import SlideCard from './components/SlideCard'
import CarouselArrows from './components/CarouselArrows'

import introVideo   from './assets/intro.mp4'
import introMobile  from './assets/intromobile.mp4'
import ambientAudio from './assets/ambient.mp3'

import video2 from './assets/video2.mp4'
import video3 from './assets/video3.mp4'
import video4 from './assets/video4.mp4'
import video5 from './assets/video5.mp4'

// ─── TIMINGS ──────────────────────────────
const TRIGGER_TIME = 5.0    // 🎵 DROP + TODO en seg 5
const VIDEO_DURATION = 8000 // 8s cada video

const BG_QUEUE = [video2, video3, video4, video5]

const isMobile = () => window.innerWidth <= 768

export const SLIDES = [
  { id: 0, isLogin: true }, // ← SLIDE 0 = LOGIN (¡SIEMPRE visible como slide!)
  {
    id: 1,
    title: 'Quiénes Somos',
    subtitle: 'Una visión, un propósito',
    body: 'Somos un equipo de mentes inquietas que decidió transformar ideas en experiencias. Fundados sobre la convicción de que la tecnología debe emocionar tanto como funcionar, construimos cada proyecto como si fuera el último.',
  },
  {
    id: 2,
    title: 'Nuestra Misión',
    subtitle: 'El norte que nos guía',
    body: 'Democratizar el acceso a soluciones de alto impacto. No creemos en el software genérico ni en los clientes invisibles. Cada desafío es único, y nuestra misión es tratarlo como tal: con rigor, creatividad y obsesión por el detalle.',
  },
  {
    id: 3,
    title: 'Nuestros Servicios',
    subtitle: 'Lo que hacemos, y cómo lo hacemos',
    body: 'Desarrollo de producto, diseño de experiencias, arquitectura de sistemas y estrategia digital. No ofrecemos servicios sueltos: ofrecemos transformación completa, desde la primera idea hasta el último píxel en producción.',
  },
  {
    id: 4,
    title: 'Contacto',
    subtitle: 'Empecemos a construir juntos',
    body: 'Cada gran proyecto comienza con una conversación. Escribinos, contanos tu idea sin filtros, y nosotros te decimos cómo hacerla realidad. No hay visión demasiado grande ni proyecto demasiado ambicioso.',
  },
]

export default function App() {
  const videoARef       = useRef(null)
  const videoBRef       = useRef(null)
  const audioRef        = useRef(null)
  const hasTriggered    = useRef(false)
  const fadeRefs        = useRef([])
  const activeVideo     = useRef('A')
  const queueIndex      = useRef(0)
  const queueTimer      = useRef(null)
  const queueRunning    = useRef(false)

  const [started,          setStarted]          = useState(false)
  const [videoBlurred,     setVideoBlurred]     = useState(false)
  const [videoSrc,         setVideoSrc]         = useState('')
  const [arrowsVisible,    setArrowsVisible]    = useState(false)
  const [currentSlide,     setCurrentSlide]     = useState(0) // ← SIEMPRE empieza en 0 (login)
  const [slideDirection,   setSlideDirection]   = useState(null)
  const [isTransitioning,  setIsTransitioning]  = useState(false)
  const [activeEl,         setActiveEl]         = useState('A')
  const [showCarousel,     setShowCarousel]     = useState(false) // ← YA en seg 5

  useEffect(() => {
    const src = isMobile() ? introMobile : introVideo
    setVideoSrc(src)
  }, [])

  // ─── Fade de volumen ────────────────────────────────────────────────────────
  const fadeVolume = (el, from, to, durationMs) => {
    const steps    = 60
    const interval = durationMs / steps
    const delta    = (to - from) / steps
    let current = from, step = 0
    const timer = setInterval(() => {
      current += delta
      step++
      el.volume = Math.min(Math.max(current, 0), 1)
      if (step >= steps) clearInterval(timer)
    }, interval)
    fadeRefs.current.push(timer)
    return timer
  }

  const clearAllFades = () => {
    fadeRefs.current.forEach(t => clearInterval(t))
    fadeRefs.current = []
  }

  useEffect(() => {
    if (videoARef.current && videoSrc) videoARef.current.load()
  }, [videoSrc])

  // ─── Crossfade videos ───────────────────────────────────────────────────────
  const crossfadeToSrc = useCallback((newSrc) => {
    if (!newSrc) return
    const isA      = activeVideo.current === 'A'
    const incoming = isA ? videoBRef.current : videoARef.current
    if (!incoming) return

    incoming.src = newSrc
    incoming.load()
    incoming.play().catch(() => {})

    activeVideo.current = isA ? 'B' : 'A'
    setActiveEl(activeVideo.current)
  }, [])

  // ─── Video queue (video2 en seg 8) ──────────────────────────────────────────
  const playNextInQueue = useCallback(() => {
    const src = BG_QUEUE[queueIndex.current % BG_QUEUE.length]
    crossfadeToSrc(src)
    queueIndex.current++
  }, [crossfadeToSrc])

  const startVideoQueue = useCallback(() => {
    if (queueRunning.current) return
    queueRunning.current = true
    playNextInQueue() // ← video2 YA
    queueTimer.current = setInterval(playNextInQueue, VIDEO_DURATION)
  }, [playNextInQueue])

  const stopVideoQueue = useCallback(() => {
    if (queueTimer.current) clearInterval(queueTimer.current)
    queueRunning.current = false
  }, [])

  // ─── Intro ──────────────────────────────────────────────────────────────────
  const handleEnter = () => {
    setStarted(true)
    const video = videoARef.current
    const audio = audioRef.current
    if (video) {
      video.muted  = false
      video.volume = 0
      video.play()
      fadeVolume(video, 0, 0.45, 800)
      setTimeout(() => fadeVolume(video, 0.45, 0.22, 4200), 800)
    }
    if (audio) {
      audio.volume = 0
      audio.play().catch(() => {})
      fadeVolume(audio, 0, 0.12, 800)
      setTimeout(() => fadeVolume(audio, 0.12, 0.35, 4000), 800)
    }
  }

  // ✅ TRIGGER SECUENCIA PRINCIPAL (seg 5)
  const handleTimeUpdate = () => {
    if (hasTriggered.current) return
    const t = videoARef.current?.currentTime ?? 0
    if (t >= TRIGGER_TIME) {
      hasTriggered.current = true
      triggerMainSequence()
    }
  }

  const triggerMainSequence = () => {
    clearAllFades()
    const video = videoARef.current
    const audio = audioRef.current
    
    // 🎵 DROP MUSICAL
    if (video) fadeVolume(video, video.volume, 0.12, 600)
    if (audio) fadeVolume(audio, audio.volume, 0.65, 800)

    // ✅ TODO DESDE SEG 5:
    setVideoBlurred(true)      // Blur YA
    setShowCarousel(true)      // ← Carousel YA (incluye slide 0=login)
    setArrowsVisible(true)     // ← Flechas YA
    startVideoQueue()          // ← Video2 YA (seg 8)
  }

  useEffect(() => () => stopVideoQueue(), [stopVideoQueue])

  // ─── Navegación CIRCULAR (0 ↔ 1 ↔ 2 ↔ 3 ↔ 4 ↔ 0) ───────────────────────────
  const navigateTo = (direction) => {
    if (isTransitioning || !showCarousel) return
    
    const total = SLIDES.length
    const nextSlide = direction === 'right'
      ? (currentSlide + 1) % total      // 4 → 0 (login)
      : (currentSlide - 1 + total) % total // 0 → 4

    setIsTransitioning(true)
    setSlideDirection(direction)

    setTimeout(() => {
      setCurrentSlide(nextSlide)
      setSlideDirection(null)
    }, 350)

    setTimeout(() => setIsTransitioning(false), 700)
  }

  return (
    <div className="scene">
      {/* Videos */}
      <video 
        ref={videoARef} 
        className={`bg-video ${videoBlurred ? 'blurred' : ''} ${activeEl === 'A' ? 'vid-active' : 'vid-inactive'}`} 
        src={videoSrc} 
        playsInline 
        preload="auto" 
        loop 
        onTimeUpdate={handleTimeUpdate}
      />
      <video 
        ref={videoBRef} 
        className={`bg-video ${videoBlurred ? 'blurred' : ''} ${activeEl === 'B' ? 'vid-active' : 'vid-inactive'}`} 
        playsInline 
        preload="auto" 
        loop 
      />

      <audio ref={audioRef} src={ambientAudio} loop preload="auto" />
      <div className="scene-overlay" />

      {/* 🔥 CAROUSEL - INCLUYE LOGIN COMO SLIDE 0 */}
      {showCarousel && (
        <div className={`slide-wrapper ${isTransitioning ? `slide-exit-${slideDirection}` : ''}`}>
          <SlideCard 
            slide={SLIDES[currentSlide]} 
            exiting={isTransitioning}
            exitDirection={slideDirection}
          />
        </div>
      )}

      {/* 🔥 LOGIN - SOLO renderiza cuando es slide 0 */}
      {showCarousel && SLIDES[currentSlide].isLogin && (
        <div className="login-overlay">
          <LoginForm />
        </div>
      )}

      {/* 🔥 FLECHAS - SIEMPRE con carousel */}
      {arrowsVisible && showCarousel && (
        <CarouselArrows
          onLeft={() => navigateTo('left')}
          onRight={() => navigateTo('right')}
          currentSlide={currentSlide}
          totalSlides={SLIDES.length}
          disabled={isTransitioning}
        />
      )}

      {!started && <IntroScreen onEnter={handleEnter} />}
    </div>
  )
}