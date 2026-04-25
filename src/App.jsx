import React, { useRef, useState, useEffect, useCallback } from 'react'
import LoginForm    from './components/LoginForm'
import IntroScreen  from './components/IntroScreen'
import SlideCard    from './components/SlideCard'
import CarouselArrows from './components/CarouselArrows'

import introVideo   from './assets/intro.mp4'
import introMobile  from './assets/intromobile.mp4'
import ambientAudio from './assets/ambient.mp3'

import video2 from './assets/video2.mp4'
import video3 from './assets/video3.mp4'
import video4 from './assets/video4.mp4'
import video5 from './assets/video5.mp4'

// ─── TIMINGS ──────────────────────────────────────────────────────────────────
const TRIGGER_TIME   = 5.0    // seg en que cae todo (drop + carousel)
const VIDEO_DURATION = 8000   // 8s por video en queue

const BG_QUEUE = [video2, video3, video4, video5]
const isMobile = () => window.innerWidth <= 768

// ─── SLIDES ────────────────────────────────────────────────────────────────────
// slide 0 es login — siempre el punto de partida
export const SLIDES = [
  { id: 0, isLogin: true },
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
  const videoARef    = useRef(null)
  const videoBRef    = useRef(null)
  const audioRef     = useRef(null)
  const hasTriggered = useRef(false)
  const fadeRefs     = useRef([])
  const activeVideo  = useRef('A')
  const queueIndex   = useRef(0)
  const queueTimer   = useRef(null)
  const queueRunning = useRef(false)

  const [started,         setStarted]         = useState(false)
  const [videoBlurred,    setVideoBlurred]     = useState(false)
  const [videoSrc,        setVideoSrc]         = useState('')
  const [activeEl,        setActiveEl]         = useState('A')

  // ── Carousel ──────────────────────────────────────────────────────────────
  const [showCarousel,    setShowCarousel]     = useState(false)
  const [currentSlide,    setCurrentSlide]     = useState(0)
  const [isTransitioning, setIsTransitioning]  = useState(false)
  const [slideDirection,  setSlideDirection]   = useState(null) // 'left' | 'right' | null

  useEffect(() => {
    setVideoSrc(isMobile() ? introMobile : introVideo)
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

  // ─── Crossfade de videos ────────────────────────────────────────────────────
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

  // ─── Video queue ────────────────────────────────────────────────────────────
  const playNextInQueue = useCallback(() => {
    const src = BG_QUEUE[queueIndex.current % BG_QUEUE.length]
    crossfadeToSrc(src)
    queueIndex.current++
  }, [crossfadeToSrc])

  const startVideoQueue = useCallback(() => {
    if (queueRunning.current) return
    queueRunning.current = true
    playNextInQueue()
    queueTimer.current = setInterval(playNextInQueue, VIDEO_DURATION)
  }, [playNextInQueue])

  const stopVideoQueue = useCallback(() => {
    if (queueTimer.current) clearInterval(queueTimer.current)
    queueRunning.current = false
  }, [])

  useEffect(() => () => stopVideoQueue(), [stopVideoQueue])

  // ─── Intro enter ────────────────────────────────────────────────────────────
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

  // ─── Trigger en seg 5 ───────────────────────────────────────────────────────
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

    // 🎵 Drop musical
    if (video) fadeVolume(video, video.volume, 0.12, 600)
    if (audio) fadeVolume(audio, audio.volume, 0.65, 800)

    // ✅ Todo de golpe en seg 5
    setVideoBlurred(true)
    setShowCarousel(true)   // activa carousel — LoginForm ve visible=true y dispara GSAP
    startVideoQueue()
  }

  // ─── Navegación circular ────────────────────────────────────────────────────
  // direction: 'left' | 'right'
  // right → avanza (slide +1), left → retrocede (slide -1)
  const navigateTo = useCallback((direction) => {
    if (isTransitioning || !showCarousel) return

    const total = SLIDES.length
    const next  = direction === 'right'
      ? (currentSlide + 1) % total
      : (currentSlide - 1 + total) % total

    setIsTransitioning(true)
    setSlideDirection(direction)   // le dice al slide actual en qué dirección salir

    // Cambia el slide cuando termina la salida (~350ms)
    setTimeout(() => {
      setCurrentSlide(next)
      setSlideDirection(null)      // nueva card entra desde el lado opuesto
    }, 350)

    // Libera el lock cuando termina la entrada (~700ms total)
    setTimeout(() => setIsTransitioning(false), 700)
  }, [isTransitioning, showCarousel, currentSlide])

  const currentSlideData = SLIDES[currentSlide]

  return (
    <div className="scene">

      {/* ── Videos background ── */}
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

      {/* ── Carousel: LoginForm o SlideCard ── */}
      {showCarousel && (
        <>
          {currentSlideData.isLogin ? (
            /*
             * visible=true dispara la animación GSAP de caída en LoginForm.
             * exiting / exitDirection controlan la salida lateral.
             */
            <LoginForm
              visible={showCarousel}
              exiting={isTransitioning}
              exitDirection={slideDirection}
            />
          ) : (
            /*
             * key={currentSlide} → fuerza desmount/mount en cada cambio,
             * así GSAP siempre corre la entrada desde cero.
             * enterFrom → desde qué lado entra el nuevo slide.
             */
            <SlideCard
              key={currentSlide}
              slide={currentSlideData}
              exiting={isTransitioning}
              exitDirection={slideDirection}
              enterFrom={slideDirection}
            />
          )}

          <CarouselArrows
            onLeft={()  => navigateTo('left')}
            onRight={() => navigateTo('right')}
            currentSlide={currentSlide}
            totalSlides={SLIDES.length}
            disabled={isTransitioning}
          />
        </>
      )}

      {/* ── Pantalla de intro (tapa todo hasta que hacen click) ── */}
      {!started && <IntroScreen onEnter={handleEnter} />}
    </div>
  )
}
